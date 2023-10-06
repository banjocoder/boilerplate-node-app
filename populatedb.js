#! /usr/bin/env node

console.log('This script populates some pipe instances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Pipe = require('./models/pipe')
var PipeTest = require('./models/pipeTest')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var pipes = []
var pipeTests = []

function pipeCreate(serialNumber, manufacturedDate, owner, cb) {
  pipedetail = {serialNumber:serialNumber , manufacturedDate: manufacturedDate,owner:owner }
  
  var pipe = new Pipe(pipedetail);
       
  pipe.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Pipe: ' + pipe);
    pipes.push(pipe)
    cb(null, pipe)
  }  );
}

function pipeTestCreate(tester, testDate, result, pipeId, cb) {
  var pipeTest = new PipeTest({ tester:tester,testDate:testDate,result:result,pipeId:pipeId });
       
  pipeTest.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Pipe Test: ' + pipeTest);
    pipeTests.push(pipeTest)
    cb(null, pipeTest);
  }   );
}

function createPipes(cb) {
    async.series([
        function(callback) {
          pipeCreate('ts12213',new Date(2016,06,06),'schlumberger',callback)
        },
        function(callback) {
          pipeCreate('ts12217',new Date(2018,06,09),'schlumberger',callback)
        },
        function(callback) {
          pipeCreate('ts122198',new Date(2019,12,13),'schlumberger',callback)
        },
        function(callback) {
          pipeCreate('ex9989712',new Date(2020,04,01),'exxon',callback)
        },
        function(callback) {
          pipeCreate('ex9989433',new Date(2019,09,22),'exxon',callback)
        },
        function(callback) {
          pipeCreate('ex9989799',new Date(2018,06,18),'exxon',callback)
        }
        ],
        // optional callback
        cb);
}


function createPipeTests(cb) {
    async.parallel([
        function(callback) {
          pipeTestCreate('Derek Johnson',new Date(2020,11,04),'Fail',pipes[0],callback)
        },
        function(callback) {
          pipeTestCreate('Derek Johnson',new Date(2020,09,04),'Pass',pipes[0],callback)
        },
        function(callback) {
          pipeTestCreate('Derek Johnson',new Date(2020,07,09),'Pass',pipes[0],callback)
        },
        function(callback) {
          pipeTestCreate('Tim Holland',new Date(2020,11,09),'Pass',pipes[1],callback)
        },
        function(callback) {
          pipeTestCreate('Tim Holland',new Date(2020,11,09),'Pass',pipes[1],callback)
        },
        function(callback) {
          pipeTestCreate('Trevor Michaels',new Date(2020,12,09),'Pass',pipes[3],callback)
        },
        function(callback) {
          pipeTestCreate('Bilbo Baggins',new Date(2020,12,10),'Pass',pipes[4],callback)
        }
        ],
        // optional callback
        cb);
}

async.series([
    createPipes,
    createPipeTests
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Pipes: '+pipes);
        console.log('PipeTests: '+pipeTests);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



