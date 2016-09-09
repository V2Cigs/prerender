#!/usr/bin/env node
require('newrelic');
var prerender = require('./lib');

var server = prerender({
    workers: process.env.PRERENDER_NUM_WORKERS,
    iterations: process.env.PRERENDER_NUM_ITERATIONS,
    logRequests: true,
    // pageDoneCheckTimeout: 1000,
    // resourceDownloadTimeout: 60000,
    // waitAfterLastRequest: 1000,
    jsTimeout: 30000,
    // jsCheckTimeout: 1000,
    // noJsExecutionTimeout: 60000,
    // evaluateJavascriptCheckTimeout: 1000,
    accessLog: {
        // Check out the file-stream-rotator docs for parameters
        fileStreamRotator: {
            filename: './logs/access-%DATE%.log',
            frequency: 'daily',
            date_format: 'YYYY-MM-DD',
            verbose: false
        },

        // Check out the morgan docs for the available formats
        morgan: {
            format: 'combined'
        }
    }
});

server.use(prerender.levelCache());
server.use(prerender.monitoring());
server.use(require('prerender-access-log'));

server.use(prerender.sendPrerenderHeader());
// server.use(prerender.basicAuth());
// server.use(prerender.whitelist());
server.use(prerender.blacklist());
// server.use(prerender.logger());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());
// server.use(prerender.inMemoryHtmlCache());
// server.use(prerender.s3HtmlCache());

server.start();