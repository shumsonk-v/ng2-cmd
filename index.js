#!/usr/bin/env node
'use strict';
const fs = require('fs');
const chalk = require('chalk');

const program = require('commander'),
    exec = require('child_process').exec;

const fileContent = {
    index: [
        `export { {new_module_name} } from './{module_name}.module';`,
    ],
    component: [
        `import { Component, OnInit } from '@angular/core';`,
        `@Component({`,
        `\tselector: '{component_selector}',`,
        `\ttemplate: '<p>Hello from {component_name}</p>'`,
        `})`,
        `export class {component_name} implements OnInit {`,
        `\tpublic ngOnInit() {`,
        `\t\tconsole.log('Hello from {component_name}');`,
        `\t}`,        
        `}`
    ],
    route: [
        `import { {component_name} } from './{module_name}.component';`,
        `export const routes = [`,
        `\t{ path: '', children: [`,
        `\t\t{ path: '', component: {component_name} }`,
        `\t]},`,
        `];`
    ],
    module: [
        `import { CommonModule } from '@angular/common';`,
        `import { FormsModule } from '@angular/forms';`,
        `import { NgModule } from '@angular/core';`,
        `import { RouterModule } from '@angular/router';`,
        `\n`,
        `import { routes } from './{module_name}.routes';`,
        `import { {component_name} } from './{module_name}.component';`,
        `\n`,
        `@NgModule({`,
        `\tdeclarations: [`,
        `\t\t// Components / Directives/ Pipes`,
        `\t\t{component_name}`,
        `\t],`,
        `\timports: [`,
        `\t\tCommonModule,`,
        `\t\tFormsModule,`,
        `\t\tRouterModule.forChild(routes),`,
        `\t],`,
        `})`,
        `export class {new_module_name} {`,
        `\tpublic static routes = routes;`,
        `}`
    ],
    spec: [
        `import { NO_ERRORS_SCHEMA } from '@angular/core';`,
        `import { inject, async, TestBed, ComponentFixture } from '@angular/core/testing';`,
        `import { {component_name} } from './{component_filename}';`,
        `\ndescribe('{component_name}', () => {`,
        `\tlet comp: {component_name};`,
        `\tlet fixture: ComponentFixture<{component_name}>;`,
        `\n\t// async beforeEach`,
        `\tbeforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ {component_name} ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents(); // compile template and css
    }));
        `,
        `\t// synchronous beforeEach`,
        `\tbeforeEach(() => {
        fixture = TestBed.createComponent({component_name});
        comp    = fixture.componentInstance;

        fixture.detectChanges(); // trigger initial data binding
    });`,
        `\n\tit('should be readly initialized', () => {
        expect(fixture).toBeDefined();
        expect(comp).toBeDefined();
    });`,
        `});`
    ]
}; 

let toCamelCase = (str) => {
    return str.replace(/-([a-z])/g, (g) => { return g[1].toUpperCase(); });
};

let execCallback = (error, stdout, stderr) => {
    if (error) console.log(chalk.red("exec error: " + error));
    if (stdout) console.log(chalk.green("Result: " + stdout));
    if (stderr) console.log(chalk.red("shell error: " + stderr));
};

let initCreatingFiles = (moduleName, targetDirectory) => {
    if (moduleName) {
        let fileExtList = [".module.ts",".routes.ts",".component.ts","index.ts",".spec.ts"],        
            componentName = "",
            newModuleName = "", tmpComponentName = "",
            componentSelector = "cmp-" + componentName;
        
        tmpComponentName = toCamelCase(moduleName);                
        componentName = tmpComponentName[0].toUpperCase() + tmpComponentName.substring(1, tmpComponentName.length);
        newModuleName = componentName + "Module";
        componentName += "Component";
        
        fileExtList.forEach((item) => {
            let newFileContent = "", targetFilePath;

            if (item !== "index.ts") {
                targetFilePath = targetDirectory + "\\" + moduleName + item;
            } else {
                targetFilePath = targetDirectory + "\\" + item;
            }

            targetFilePath = targetFilePath.replace(/\\/g, "/");
            if (targetFilePath[0] === "/" || targetFilePath[0] === "\\") {
                targetFilePath = targetFilePath.substring(1, targetFilePath.length);
            }
            
            if (!fs.existsSync(targetFilePath)) {
                if (item === ".component.ts") {
                    newFileContent = fileContent.component.join('\n');                     
                }
                if (item === ".routes.ts") {
                    newFileContent = fileContent.route.join('\n');
                }
                if (item === ".module.ts") {
                    newFileContent = fileContent.module.join('\n');
                }
                if (item === "index.ts") {
                    newFileContent = fileContent.index.join('\n');
                }
                if (item === ".spec.ts") {
                    newFileContent = fileContent.spec.join('\n');
                }

                newFileContent = newFileContent.replace(/\{(component_selector)\}/g, componentSelector);
                newFileContent = newFileContent.replace(/\{(component_name)\}/g, componentName);
                newFileContent = newFileContent.replace(/\{(module_name)\}/g, moduleName);
                newFileContent = newFileContent.replace(/\{(new_module_name)\}/g, newModuleName);
                newFileContent = newFileContent.replace(/\{(component_filename)\}/g, moduleName + '.component');
                

                fs.writeFile(targetFilePath, newFileContent, (err) => {
                    if (err) throw err;
                    console.log(chalk.green(targetFilePath + " created successfully!"));
                });
            } else {
                console.log(chalk.gray(targetFilePath + " skipped because it's already exist."));
            }
        });
    } 
};

let listFunction = (targetPath,options) => {
    let pathArr = [], moduleName = "", targetDirectory = [], i = 0,
        createDirCommand = "md ";

    if (!targetPath) {
        console.log("Info: no target module name or path was assigned.");
    } else {
        if (targetPath.indexOf("/") > -1) {
            pathArr = targetPath.split("/");
            moduleName = pathArr[pathArr.length - 1];
        } else {
            moduleName = targetPath;
        }

        if (pathArr.length > 0) {
            pathArr.forEach((item) => {
                targetDirectory.push(item);
            });
        }
        targetDirectory = targetDirectory.join("\\");

        if (targetDirectory) {
            if (!fs.existsSync(targetDirectory)) {
                createDirCommand += targetDirectory;
                exec(createDirCommand, (error, stdout, stderr) => {
                    if (error) console.log(chalk.red("exec error: " + error));
                    if (stdout) console.log(chalk.green("Result: " + stdout));
                    if (stderr) console.log(chalk.red("shell error: " + stderr));

                    if (!stdout && !stdout && !error) {
                        console.log(chalk.green(targetDirectory + " created."));
                        initCreatingFiles(moduleName, targetDirectory);
                    }
                });
            } else {
                initCreatingFiles(moduleName, targetDirectory);
            }
        }
    } 
};

program
  .version('0.0.1')
  .command('create-module [targetPath]')
  .description('Create angular2 module source code')
  .action(listFunction);
program.parse(process.argv);