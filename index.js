'use strict';

var fivebeans = require('fivebeans');
var async = require('async');
var datas = require('./datas');

var jobList = datas.taskData;
var taskOpt = datas.taskOpt;

var host = '127.0.0.1';
var port = 11300;

function initClient(tasks) {
  var client = new fivebeans.client(host, port);
  client.on('connect', function() {
      tasks();
    })
    .on('error', function(err) {
      console.log('err', err);
    })
    .on('close', function() {
      console.log('close');
    })
    .connect();
  return client;
}

// function done() {
//   console.log('done');
//   process.exit();
// }

function generateTask(client, d, tubename) {
  return function(cb) {
    console.log(d);
    client.put(0, 0, 60, JSON.stringify([tubename,d]), function(err, jobid) {
      console.log('jobid', jobid)
      cb();
    });
  }
}

function generateTasks(client, ds) {
  var tubename = 'defaults';
  var tasks = [];
  var d;
  for (var k in ds) {
    d = ds[k];
    tasks.push(generateTask(client, d, tubename));
  }
  return tasks;
}

function start(client, ds, opts) {
  opts = opts || {};
  var tubeName = opts.tubeName || 'defaults';
  client.use(tubeName, function(err, tubeName) {
    var tasks = generateTasks(client, ds);
    async.waterfall(tasks, function(e, d) {
      console.log(e, d, 'done', Math.random());
    });
  });
}

var client = initClient(function() { });
start(client, jobList);
//

// // process.exit();
// // client.list_tube_used(function(err, tubename) {
// //   console.log(999,err, tubename,'tubename');
// // });

