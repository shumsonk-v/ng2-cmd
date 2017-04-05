The simple command to create files for angular2 module

This is a command line to automatically create module, routes, component and index.ts files for Angular2 Webpack Starter or Angular2 project with component lazy load feature (ng-router-loader).

Now there is only one command with only one option so it's very easy to use. To use the command, simply type

    ng2cmd create-module MODULE_NAME_OR_DIRECTORY_PATH [-f,--files]


*MODULE_OR_DIRECTORY_PATH* is the module or path you want to create and store the generated files. See example below.

    ng2cmd create-module src/app/component/templates
   
This command will create the following files:

 - src/app/component/templates/templates.component.ts
 - src/app/component/templates/templates.module.ts
 - src/app/component/templates/templates.routes.ts
 - src/app/component/templates/templates.spec.ts
 - src/app/component/templates/index.ts

The last string item (after divided by *slash ( / )*)  of the given path will be the used as a module name and component name (see the generated file contents). It also create the folder with the same name as specified module name.


If you want to create the files without the folder with the same name, simple put option -f, --files to the command like this.

    ng2cmd create-module src/app/component/my-module -f

This command will create the following files:

 - src/app/component/my-module.component.ts
 - src/app/component/my-module.module.ts
 - src/app/component/my-module.routes.ts
 - src/app/component/my-module.spec.ts
 - src/app/component/index.ts


Please note that if there is any existing file with the same name at the target path, that file will be skipped, and this also apply to the existing directory as well.



Feel free to use or let me know if you have any issue.

Cheers!