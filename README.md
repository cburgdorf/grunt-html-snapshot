# grunt-html-snapshot

> Makes it easy to provide html snapshots for client side applications so that they can be indexed by web crawlers



## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-html-snapshot --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-html-snapshot');
```


## htmlSnapshot task
_Run this task with the `grunt htmlSnapshot` command._

## configuring the htmlSnapshot task

```js
    grunt.initConfig({
        htmlSnapshot: {
            all: {
              options: {
                //that's the path where the snapshots should be placed
                //it's empty by default which means they will go into the directory
                //where your Gruntfile.js is placed
                snapshotPath: 'snapshots/',
                //This should be either the base path to your index.html file
                //or your base URL. Currently the task does not use it's own
                //webserver. So if your site needs a webserver to be fully
                //functional configure it here.
                sitePath: 'http://localhost:8888/my-website/',
                //you can choose a prefix for your snapshots
                //by default it's 'snapshot_'
                fileNamePrefix: 'sp_',
                //by default the task waits 500ms before fetching the html.
                //this is to give the page enough time to to assemble itself.
                //if your page needs more time, tweak here.
                msWaitForPages: 1000,
                //if you would rather not keep the script tags in the html snapshots
                //set `removeScripts` to true. It's false by default
                removeScripts: true,
                // allow to add a custom attribute to the body
                bodyAttr: 'data-prerendered',
                //here goes the list of all urls that should be fetched
                urls: [
                  '',
                  '#!/en-gb/showcase'
                ]
              }
            }
        }
    });
```

## Release History

- 0.3.0 - Escape tabs & introduced new option bodyAttr to place a custom attribute on the body
- 0.2.1 - fixed a bug where quotes where missing from the html
- 0.2.0 - added option to remove script tags from the output
- 0.1.0 - Initial release
