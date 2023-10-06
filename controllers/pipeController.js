// Include pipe model here
var async = require('async');
const { body,validationResult } = require('express-validator');
var Pipe = require('../models/pipe');
var PipeTest = require('../models/pipeTest');

/* GET home page. */
exports.index = function(req, res) {

    res.render('index', { title: 'Texas Iron Trackers'});
};

/* GET pipe list*/
exports.pipe_list = function(req, res){
    console.log('Retrieving Pipe List')
    Pipe.find()
      .exec(function (err, list_pipes) {
        if (err) { return next(err); }
        //Successful, so render

        res.render('pipe_list', { title: 'Pipe List', pipe_list: list_pipes });
        });
};

/* GET pipe detail*/
exports.pipe_detail = function(req, res, next){
    async.waterfall([
        function(callback){
            Pipe.find({'serialNumber':req.params.id})
            .exec(callback);
        },
        function(pipe,callback){
            PipeTest.find({'pipeId':pipe})
            .then(tests =>  {callback(null,pipe,tests)});
        }
    ], function(err,pipe_object,tests) {
        if (err) { return next(err); }
        if (pipe_object==null) { // No results.
            var err = new Error('Pipe not found');
            err.status = 404;
            return next(err);
        }

        // Successful, so render.
        res.render('pipe_detail', { title: pipe_object[0].serialNumber, pipe: pipe_object[0], pipeTests: tests});
        //res.send(pipe + tests);
    });
};

/* GET pipe create*/
exports.pipe_create_get = function(req, res){
    Pipe.find({},'PipeId')
    .exec(function (err, pipes) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('pipe_form', {title: 'Create Pipe', pipe_list: pipes});
    });
};


/* POST pipe create*/
exports.pipe_create_post = [

    // Validate and sanitise fields.
    body('serialNumber', 'Serial Number is invalid. Only alphanumeric characters allowed').trim().isLength({ min: 1 }).matches(/^[A-Za-z1-9]+$/).escape(),
    body('manufacturedDate').toDate(),
    body('manufacturer').optional().trim().isLength({ min: 1 }).escape(),
    body('purchaseDate').optional({ checkFalsy: true }).toDate(),
    body('owner', 'Owner must be specified').trim().isLength({ min: 1 }).escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        var newPipe = new Pipe({
            serialNumber: req.body.serialNumber,
            manufacturedDate: req.body.manufacturedDate,
            manufacturer: req.body.manufacturer,
            purchaseDate: req.body.purchaseDate,
            owner: req.body.owner
        });
  
        console.log(newPipe);
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            res.render('pipe_form', { title: 'Create Pipe', pipe: newPipe, errors: errors.array()});
            return;
        }
        else {
  
            // Data from form is valid.
            newPipe.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   res.redirect('/pipelist');
                });
        }
    }
  ]