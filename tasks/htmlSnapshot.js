/*
 * grunt-html-snapshot
 *
 * Copyright (c) 2013 Christoph Burgdorf, contributors
 * Licensed under the MIT license.
 */
(function() {

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
          sitePath: '',
          removeScripts: false,
          removeLinkTags: false,
          removeMetaTags: false,
          replaceStrings: []
        });

        // the channel prefix for this async grunt task
        var taskChannelPrefix = "" + new Date().getTime();

        var sanitizeFilename = function(name){
            return name.replace(/#|\/|\!/g,'_') || '';
        };

        var isLastUrl = function(url){
            return options.urls[options.urls.length - 1] === url;
        };

        phantom.on(taskChannelPrefix + ".error.onError", function (msg, trace) {
            grunt.log.writeln('error: ' + msg);
            phantom.halt();
        });

        phantom.on(taskChannelPrefix + ".console", function (msg, trace) {
            grunt.log.writeln(msg);
        });

        phantom.on(taskChannelPrefix + ".htmlSnapshot.pageReady", function (msg, url) {
            var plainUrl = url.replace(sitePath, '');

            var fileName =  options.snapshotPath +
                            options.fileNamePrefix +
                            sanitizeFilename(plainUrl) +
                            '.html';

            if (options.removeScripts){
                msg = msg.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            }

            if (options.removeLinkTags){
                msg = msg.replace(/<link\s.*?(\/)?>/gi, '');
            }

            if (options.removeMetaTags) {
                msg = msg.replace(/<meta\s.*?(\/)?>/gi, '');
            }

            options.replaceStrings.forEach(function(obj) {
                var key = Object.keys(obj);
                var value = obj[key];
                var regex = new RegExp(key, 'g');
                msg = msg.replace(regex, value);
            });

            grunt.file.write(fileName, msg);
            grunt.log.writeln(fileName, 'written');
            phantom.halt();

            isLastUrl(plainUrl) && done();
        });

        var done = this.async();

        var urls = options.urls;
        var sitePath = options.sitePath;

        grunt.util.async.forEachSeries(urls, function(url, next) {

            phantom.spawn(sitePath + url, {
                // Additional PhantomJS options.
                options: {
                    phantomScript: asset('phantomjs/bridge.js'),
                    msWaitForPages: options.msWaitForPages,
                    bodyAttr: options.bodyAttr,
                    cookies: options.cookies,
                    taskChannelPrefix: taskChannelPrefix
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

}());
