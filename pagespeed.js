var request = require('request'),
	cheerio = require('cheerio'),
	minimist= require('minimist'),
	fs 		= require('fs'),
	async 	= require('async'),
	argv 	= minimist(process.argv.slice(2));

function parse_score(data) {
	
	try {
		var lines = data.split("\n");
		var score_line = lines[5];
		var score = parseInt( score_line.split(':')[1], 10 );
	} catch(e) {
		console.log(e);
		return null;
	}

	return score;
}

function get_previous_dir() {

	var files = fs.readdirSync('./pagespeed');

	var dirs = [];

	for(var i = 0; i < files.length; i++) {
		// Ignore files like ".DS_Store"
		if(files[i].substr(0,1) == ".") {
			continue;
		}

		dirs.push(parseInt(files[i]));
	}

	// Sort and reverse. That way the latest created folder will be the 0 element, and the previous one will be 1
	var dirsSorted = dirs.sort().reverse();

	var previousDir = dirsSorted[0];

	return previousDir;
	
}

request('http://hof:tesla@hof-uxtest.cloudapp.net/master/', function (error, response, body) {

	if (!error && response.statusCode == 200) {

		var $ = cheerio.load(body);

		var aTags = $('ol li a');

		if(!fs.existsSync('./pagespeed')) {
			fs.mkdirSync('./pagespeed');
		}

		var path = './pagespeed/' + new Date().getTime();
		var same_score = 0;
		var previousDir = get_previous_dir();

		//console.log('Previous dir is: ', previousDir);

		fs.mkdirSync( path );
		var tagCount = 0;

		var next = function() {

			if(tagCount >= aTags.length) {
				return;
			}

			var a_tag = aTags[tagCount++];

			var href = a_tag.attribs.href.replace('./', '');

			var target = "/master/" + href;

			var strategy = argv.strategy || 'desktop';

			console.log('In progress: ', target);

			(function(href) {

				require('child_process').exec("grunt pagespeed --target " + target + " --strategy " + strategy, function(err, data) {

					fs.writeFile(path + '/' + href + '.txt', data, {encoding : 'utf8'}, function() {
						
						var new_score = parse_score(data);

						//console.log('./pagespeed/' + previousDir + '/' + href + '.txt', href, previousDir);

						var prev_file = './pagespeed/' + previousDir + '/' + href + '.txt';

						if(previousDir === undefined) {
							console.log('No previous specimen.');
							next();
							return;
						}

						fs.readFile(prev_file, 'utf8', function(err, data) {

							if(!err) {

								var prev_score = parse_score(data);

								if(prev_score != new_score) {
									console.info('There is a difference in score points for file: ' + href + '. It was: ' + prev_score + ' and now it is: ' + new_score);
								} else {
									same_score++;

									console.log('Target %s score is %d', target, new_score);

									if(aTags.length == same_score) {
										console.log('All page speed scores remains the same.');
									}
								}
								
							} else {

								console.log('Error reading file %s', prev_file);
							}

							//console.log('Processing file');
							next();
						});
					});
				});

			})(href);
			
		};

		next();
  	}
});