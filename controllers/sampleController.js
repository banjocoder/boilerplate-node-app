// Include sample model here
var async = require('async');
const { body,validationResult } = require('express-validator');
var sample = require('../models/sample');
var sampleTest = require('../models/sampleTest');

/* GET home page. */
exports.index = function(req, res) {

    res.render('index', { title: 'Texas Iron Trackers'});
};

/* GET sample list*/
exports.sample_list = function(req, res){
    console.log('Retrieving sample List')
    sample.find()
      .exec(function (err, list_samples) {
        if (err) { return next(err); }
        //Successful, so render

        res.render('sample_list', { title: 'sample List', sample_list: list_samples });
        });
};

/* GET sample detail*/
exports.sample_detail = function(req, res, next){
    async.waterfall([
        function(callback){
            sample.find({'serialNumber':req.params.id})
            .exec(callback);
        },
        function(sample,callback){
            sampleTest.find({'sampleId':sample})
            .then(tests =>  {callback(null,sample,tests)});
        }
    ], function(err,sample_object,tests) {
        if (err) { return next(err); }
        if (sample_object==null) { // No results.
            var err = new Error('sample not found');
            err.status = 404;
            return next(err);
        }

        // Successful, so render.
        res.render('sample_detail', { title: sample_object[0].serialNumber, sample: sample_object[0], sampleTests: tests});
        //res.send(sample + tests);
    });
};

/* GET sample create*/
exports.sample_create_get = function(req, res){
    sample.find({},'sampleId')
    .exec(function (err, samples) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('sample_form', {title: 'Create sample', sample_list: samples});
    });
};


/* POST sample create*/
exports.sample_create_post = [

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
        
        var newsample = new sample({
            serialNumber: req.body.serialNumber,
            manufacturedDate: req.body.manufacturedDate,
            manufacturer: req.body.manufacturer,
            purchaseDate: req.body.purchaseDate,
            owner: req.body.owner
        });
  
        console.log(newsample);
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            res.render('sample_form', { title: 'Create sample', sample: newsample, errors: errors.array()});
            return;
        }
        else {
  
            // Data from form is valid.
            newsample.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   res.redirect('/samplelist');
                });
        }
    }
  ]