module.exports = function(grunt) {

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("jquery-tooltip.json"),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.licenses[0].type %> License\n" +
				" */\n"
		},

		// Concat definitions
		concat: {
			dist: {
				src: ["dist/jquery.tooltip.js"],
				dest: "dist/jquery.tooltip.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// Lint definitions
		jshint: {
			files: ["src/jquery.tooltip.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify definitions
		uglify: {
			my_target: {
				src: ["dist/jquery.tooltip.js"],
				dest: "dist/jquery.tooltip.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// CoffeeScript compilation
		coffee: {
			compile: {
				files: {
					"dist/jquery.tooltip.js": "src/jquery.tooltip.coffee"
				}
			}
		},
		stylus: {
			compile: {
				files:{
					"dist/style.css": "src/style.styl"
				}
			}
		},
		watch: {
			scripts:{
				files:"src/jquery.tooltip.coffee",
				tasks: ["coffee", "jshint", "concat", "uglify"]
			},
			css:{
				files: "src/style.styl",
				tasks: ["stylus"]
			},
			
		}

	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-coffee");
	grunt.loadNpmTasks("grunt-contrib-stylus");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("default", ["coffee", "stylus", "jshint", "concat", "uglify"]);
	grunt.registerTask("travis", ["jshint"]);

};
