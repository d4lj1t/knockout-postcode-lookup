module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean : {
			build : ['build/']
		},
		copy : {
			main : {
				files : [
					{expand : true, cwd : 'src/assets/images', src : ['**'], dest : 'build/assets/images/'},
					{expand : true, cwd : 'src/assets/scripts', src : ['**'], dest : 'build/assets/scripts/'},
					{expand : true, cwd : 'src/data', src : ['**'], dest : 'build/data/'},
					{expand : true, cwd : 'src/assets/vendor', src : ['**'], dest : 'build/assets/vendor/'}
				]
			}
		},
		less : {
			development : {
				options : {
					compress : false,
					yuicompress : false,
					optimization : 2,
					sourceMap : true,
					sourceMapFilename : 'build/assets/styles/styles.min.css.map',
					sourceMapURL : 'styles.min.css.map'
				},
				files : {
					'build/assets/styles/styles.css' : 'src/assets/styles/less/styles.less'
				}
			},
			production : {
				options : {
					compress : true,
					yuicompress : true,
					optimization : 2,
					sourceMap : true,
					sourceMapFilename : 'build/assets/styles/styles.min.css.map',
					sourceMapURL : 'styles.min.css.map'
				},
				files : {
					"build/assets/styles/styles.min.css" : "src/assets/styles/less/styles.less"
				}
			},
			styleguide : {
				options : {
					compress : true
				},
				files : {
					'build/assets/styles/styleguide-fixtures.min.css' : 'src/assets/styles/less/styleguide-fixtures.less',
					'build/assets/styles/sg-fixtures.min.css' : 'src/assets/styles/less/styleguide-fixtures.less'
				}
			}
		},
		watch : {
			js : {
				files : ['src/**/*.js'],
				tasks : ['copy']
			},
			html : {
				files : ['src/**/*.html'],
				tasks : ['includereplace:build']
			},
			less : {
				files : ['src/**/*.less'],
				tasks : ['less'],
				interrupt : true
			},
			emailsHTML : {
				files : ['src/emails/**/*.html'],
				tasks : ['emailHTMLInclude']
			},
			
			emailsCSS : {
				files : ['src/emails/**/*.css'],
				tasks : ['emailHTMLInclude'],
				interrupt : true
			}
			
		},
	
		includereplace : {
			build : {
				files : [
					{src : '*.html', 'dest' : 'build/', expand: true, cwd : 'src/'}
				],
				options : {
					includesDir : 'src/include'
				}
			},
			emailsIncludes : {
				files : [
					{src : '<%= myTask.src %>.html', 'dest' : 'src/emails', expand: true, cwd : 'src/emails/non-inline/', ext : '-inline.html'}
				],
				options : {
					includesDir : 'src/emails/include'
				}
			},
			emailsBuild : {
				files : [
					{src : '*.html', 'dest' : 'build/emails', expand: true, cwd : 'src/emails/'}
				],
				options : {
					includesDir : 'src/emails/include'
				}
			}
			

		},
		compress : {
			latest : {
				options : {
					archive : 'latest.tar.gz',
					mode : 'tgz'
				},
				files : [
					{src:['build/**']}
				],

			}
		},
		phantomas : {
	    	gruntSite : {
		      options : {
		        indexPath : './phantomas/',
		        options   : {},
		        url       : 'http://localhost:4567/build/home.html',
		        buildUi   : true
		      }
	    	}
		},
		release : {
			options : {
				bump : true, // Version bumping
				npm : false, // Don't publish in NPM
				npmTag : false,
				github : {
					repo : 'HouseofFraser/Phoenix'
				}
			}
		},
		nodemailer : {

		    options: {
		      transport: {
		        type: 'SMTP',
		        options: {
		          service: 'Gmail',
		          auth: {
		            user: 'phoenixpusher@gmail.com',
		            pass: '1wq23re45yt6'
		          }
		        }
		      },
		      message: {
		        subject: 'A new release is out.',
		        html : 'A new release is out. Check it out at Azure. Version number: <%= pckg.version %>'
		      },
		      recipients: [
		        {
		          email: 'avreon@gmail.com',
		          name: 'Marush Denchev'
		        },
		        {
		        	email : 'joe@cherryinternet.com',
		        	name : 'Joe Akers-Douglas'
		        }
		      ]
		    },
		    external : []
		},
		uncss : {
			dist : {
				files : [
					{src : 'build/*.html', dest : 'build/assets/styles/tidy.css'}
				],
				options : {
					compress : true
				}
			}
		},
		processhtml : {
			dist : {
				files : {
					'build/index.html' : ['build/index.html']
				}
			}
		},
		uglify : {
			production : {
				options : {
					compress : true,
					sourceMap : true,
				},
				files : {
					'build/assets/scripts/scripts.min.js' : ['src/assets/scripts/*']
				}
			},
			development : {
				options : {
					compress : false
				},
				files : {
					'build/assets/scripts/scripts.min.js' : ['src/assets/scripts/*']
				}
			}
		},
		jshint : {
			options : {
				force : true
			},
			files : {
				src : ['src/assets/scripts/app/**/*.js']
			}
		},
		accessibility : {
		  options : {
		    accessibilityLevel: 'WCAG2A'
		  },
		  test : {
		    files: [{
		      expand  : true,
		      cwd     : 'build/',
		      src     : ['*.html'],
		      dest    : 'reports/',
		      ext     : '-report.txt'
		    }]
		  }
		},
		pagespeed : {
			options : {
				nokey : true,
				url : 'http://hof-uxtest.cloudapp.net/pagespeed.php?path='
			},
			development : {
				options : {
					paths : [grunt.option('target')],
					locale : 'en_GB',
					strategy : grunt.option('strategy') || 'desktop',
					threshold : grunt.option('thd') || 90
				}
			}
		},
		litmus: {
		    test: {
		    	src: ['src/emails/<%= myTask.src %>.html'],
				options: {
		        	username: 'hofuxd@gmail.com',
					password: 'House123!',
					url: 'https://hof69b6.litmus.com',
					clients: ['appmail6', 'notes6', 'notes7', 'notes8', 'notes85', 'ol2000', 'ol2002', 'ol2003', 'ol2007', 'ol2010', 'ol2011', 'ol2013', 'thunderbirdlatest', 'android22', 'android4', 'androidgmailapp', 'blackberry8900', 'blackberryhtml', 'iphone5s', 'ipad', 'ipadmini', 'iphone4', 'iphone5', 'iphone6', 'iphone6plus', 'aolonline', 'ffaolonline', 'chromeaolonline', 'gmailnew', 'ffgmailnew', 'chromegmailnew', 'outlookcom', 'ffoutlookcom', 'chromeoutlookcom', 'yahoo', 'ffyahoo', 'chromeyahoo', 'windowsphone8']
		      	}
		    }
		},
		emailBuilder:{
			inline: {
				files : [
					{
						expand 	: true, 
						cwd 	: 'src/emails', 
						src 	: ['<%= myTask.src %>-inline.html'], 
						dest 	: 'src/emails'
					},
				],
				options: {
					encodeSpecialChars: true
		    	}
			}
		},
		browserstack_list : {
			dev : {
				username : 'webdesign@hof.co.uk',
				password : 'HOF123!'
			}
		},

		browserstack : {
			dev : {
				credentials : {
					username : 'webdesign@hof.co.uk',
					password : 'HOF123!'
				},
				tunnel : {
					key : 'v4w5sAqWJhJGXanUaHRP',
					hosts : [{
						name : 'localhost',
						port : '4567',
						sslFlag : 0
					}]
				},
				start : {
					queueTimeout : 20000,
					url : 'http://localhost:4567/index.html',
					timeout : 10000,
					browsers : [{
						os : 'win',
						browser : 'chrome',
						version : '39.0'
					}, {
						os : 'win',
						browser : 'firefox',
						version : '34.0'
					}]
				}
			}
		},

		browserstack_clean: {
			dev: {
		    	username: 'webdesign@hof.co.uk',
		    	password: 'HOF123!'
		  	}
		},

		wpt : {
			options : {
				locations : [/*'ec2-eu-central-1:IE 11', */'ec2-ap-northeast-1:Firefox'/*, 'ec2-eu-west-1:Chrome'*/],
				key: 'A.9ac938265090e394f1135892227af333'
			},
			hof : {
				options : {
					timeout : 720,
					url : [
						'http://hof-uxtest.cloudapp.net/pagespeed.php?path=/master/home.html'
					]
				},
				dest : 'tmp/hof/'
			}
		},

		styleguide : {
			options : {
				framework : {
					name : 'kss'
				}
			},
			hof : {
				options : {
					name : "House of Fraser - Styleguide"
				},

				files : {
					'tmp/styleguide' : 'demo/*.css'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-phantomas');
	grunt.loadNpmTasks('grunt-release');
	grunt.loadNpmTasks('grunt-nodemailer');
	grunt.loadNpmTasks('grunt-uncss');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-accessibility');
	grunt.loadNpmTasks('grunt-include-replace');
	grunt.loadNpmTasks('grunt-devtools');
	grunt.loadNpmTasks('grunt-pagespeed');
	grunt.loadNpmTasks('grunt-litmus');
	grunt.loadNpmTasks('grunt-email-builder');
	grunt.loadNpmTasks('grunt-browserstack');
	grunt.loadNpmTasks('grunt-wpt');
	grunt.loadNpmTasks('grunt-styleguide');

	grunt.registerTask('build', function(target) {
		grunt.task.run('clean');
		grunt.task.run('includereplace:build');
		grunt.task.run('includereplace:emailsBuild');
		grunt.task.run('less');
		grunt.task.run('copy');
		grunt.task.run('compress');
		grunt.task.run('jshint');
		//grunt.task.run('uglify:production');
		//grunt.task.run('accessibility');

		var uncss = grunt.option('uncss');

		if(uncss) {
			grunt.task.run('uncss');
			grunt.task.run('processhtml');
		}

		var phantomas = grunt.option('phantomas');
		if(phantomas) {
			grunt.task.run('phantomas');
		}

		var release = grunt.option('release');

		if(release) {
			grunt.option('force', true);
			grunt.task.run('release');
			grunt.task.run('nodemailer');
		}
	});
	
	
	//Include HTML for emails
	//Usage:
	//	Process all .hmtl files within src/emails: grunt emailHTMLInclude
	//  Send individaul files: grunt emailHTMLInclude --fileName=[insert file name here]
	grunt.registerTask('emailHTMLInclude', function(target) {
		var fileName = grunt.option('fileName') || '*';
		grunt.config.set('myTask.src', fileName);		
		grunt.task.run('includereplace:emailsIncludes');
		grunt.task.run('emailBuilder');
		grunt.task.run('includereplace:emailsBuild');
	});


	//Send emails to Litmus
	//Usage:
	//	Send all .hmtl files within src/emails: grunt sendToLitmus
	//  Send individaul files: grunt sendToLitmus --fileName=[insert file name here]
	grunt.registerTask('sendToLitmus', function(target) {
		var fileName = grunt.option('fileName') || '*';
		grunt.config.set('myTask.src', fileName);		
		grunt.task.run('litmus');
	});
}