module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        ts: {
            dummyApp: {
                files: [{
                    src: "src/routes/dummy-service/starter/*",
                    dest: "functions/dummy-service"
                }, {
                    src: ["src/common/**", "src/routes/dummy-service/**", "!src/routes/dummy-service/starter/**"],
                    dest: "functions/dummy-service"
                }],
                options: {
                    module: "commonjs",
                    noLib: true,
                    target: "ES6",
                    sourceMap: false,
                    allowUnreachableCode: false,
                    allowUnusedLabels: false,
                    declaration: false,
                    forceConsistentCasingInFileNames: true,
                    noFallthroughCasesInSwitch: true,
                    noImplicitReturns: true,
                    pretty: true,
                    strictNullChecks: true,
                    suppressExcessPropertyErrors: false,
                    verbose: true,
                    fast: 'never'
                }
            }
        },
        copy: {
            package: {
                files: [{
                    src: ["package.json"],
                    dest: "functions/"
                }]
            },
            serverless: {
                files: [{
                    cwd: 'serverless',
                    src: '**',
                    dest: "functions/",
                    expand: true
                }]
            }
        },

        tslint: {
            options: {
                configuration: "tslint.json"
            },
            files: {
                src: ["src/**/*.ts"]
            }
        },
        watch: {
            ts: {
                files: ["js/src/**/*.ts", "src/**/*.ts"],
                tasks: ["ts", "tslint"]
            }
        },
        clean: {
            functions: {
                src: ["functions/"]
            }
        },
        apidoc: {
            myapp: {
                src: "src/routes/",
                includeFilters: ["service\.ts"],
                dest: "docs/"
            }

        }
    });

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks('grunt-apidoc');

    grunt.registerTask("default", [
        "ts",
        "copy",
        "tslint"
    ]);

    grunt.registerTask("cleanDeploy", [
        "clean",
        "ts",
        "copy",
        "tslint"
    ]);

};