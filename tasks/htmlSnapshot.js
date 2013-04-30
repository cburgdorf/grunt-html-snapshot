/*
 * grunt-contrib-seo
 *
 * Copyright (c) 2013 Christoph Burgdorf, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    var fs          = require("fs"),
        path        = require("path"),
        phantom     = require("grunt-lib-phantomjs").init(grunt);

    var asset = path.join.bind(null, __dirname, '..');

    grunt.registerMultiTask('htmlSnapshot','fetch html snapshots', function(){

        var options = this.options({
          urls: [],
          msWaitForPages: 500,
          fileNamePrefix: 'snapshot_',
          snapshotPath: '',
          sitePath: ''
        });

        var sanitizeFilename = function(name){
            return name.replace(/#|\/|\!/g,'_') || '';
        };

        phantom.on("error.onError", function (msg, trace) {
            grunt.log.writeln('error: ' + msg);
            phantom.halt();
        });

        phantom.on("console", function (msg, trace) {
            grunt.log.writeln(msg);
        });

        phantom.on("htmlSnapshot.pageReady", function (msg, url) {
            
            //remove weird pseudo new lines and escaped quotes
            msg = msg.replace(/\\n|\\"/g,"");

            //remove first quote character
            msg = msg.substr(1);

            //remove last quote character
            msg = msg.substr(0, msg.length - 1);

            var fileName =  options.snapshotPath + 
                            options.fileNamePrefix + 
                            sanitizeFilename(url.replace(sitePath, '')) +
                            '.html';

            grunt.file.write(fileName, msg);
            grunt.log.writeln(fileName, 'written');
            phantom.halt();
        });

        var done = this.async();

        var urls = options.urls;
        var sitePath = options.sitePath;

        grunt.util.async.forEachSeries(urls, function(url, next) {
            
            phantom.spawn(sitePath + url, {
                // Additional PhantomJS options.
                options: {
                    phantomScript: asset('phantomjs/bridge.js'),
                    msWaitForPages: options.msWaitForPages
                },
                // Complete the task when done.
                done: function (err) {
                    if (err) {
                        // If there was an error, abort the series.
                        done();
                    } 
                    else {
                        // Otherwise, process next url.
                        next();
                    }
                }
            });
        });
        grunt.log.writeln('running html-snapshot task...hold your horses');
    });
};