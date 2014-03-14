pkg = require './package.json'
module.exports = (grunt)->

    grunt.initConfig

        #Import package manifest
        pkg: pkg

        #Banner definitions
        meta:
            banner: """
                /* 
                 *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>
                 *  <%= pkg.description %>
                 *  <%= pkg.homepage %>
                 *
                 *  Made by <%= pkg.author.name %>
                 *  Under <%= pkg.licenses[0].type %> License
                 */\n\n
            """

        #Concat definitions
        concat:
            dist:
                src: ["dist/jquery.tooltip.js"]
                dest: "dist/jquery.tooltip.js"
            options:
                banner: "<%= meta.banner %>"

        #Lint definitions
        jshint:
            files: ["src/jquery.tooltip.js"]
            options:
                jshintrc: ".jshintrc"

        #Minify definitions
        uglify:
            my_target:
                src: ["dist/jquery.tooltip.js"]
                dest: "dist/jquery.tooltip.min.js"
            options:
                banner: "<%= meta.banner %>"

        #CoffeeScript compilation
        coffee:
            compile:
                files:
                    "dist/jquery.tooltip.js": "src/jquery.tooltip.coffee"

        stylus:
            compile:
                files:
                    "dist/style.css": "src/style.styl"

        watch:
            scripts:
                files:"src/jquery.tooltip.coffee",
                tasks: ["coffee", "jshint", "concat", "uglify"]
            css:
                files: "src/style.styl",
                tasks: ["stylus"]

        bump:
            options:
                files: ["package.json"]
                commitFiles: ["-a"]

        _release:
            options:
                bump: false
                add: true
                commit: true
                tag: true
                push: true
                pushTags: true
                npm: false


    grunt.loadNpmTasks("grunt-contrib-concat")
    grunt.loadNpmTasks("grunt-contrib-jshint")
    grunt.loadNpmTasks("grunt-contrib-uglify")
    grunt.loadNpmTasks("grunt-contrib-coffee")
    grunt.loadNpmTasks("grunt-contrib-stylus")
    grunt.loadNpmTasks("grunt-contrib-watch")
    grunt.loadNpmTasks("grunt-bump")
    grunt.loadNpmTasks("grunt-release")

    
    grunt.registerTask("build", ["coffee", "jshint", "concat", "uglify"])
    grunt.registerTask("default", "build");
    grunt.renameTask("release", "_release")

    grunt.registerTask "release", (target="") ->
        grunt.task.run ["bump-only:#{target}", "build", "_release:#{target}"]

