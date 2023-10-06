// Include sample model here
var async = require('async');
const { body,validationResult } = require('express-validator');
var sample = require('../models/sample');
var sampleTest = require('../models/sampleTest');
var sampleFile = require('../models/sampleFile')

/* GET sample test detail*/
exports.sampleTest_detail = function(req, res, next){
    async.parallel({
      sampleTest_item: function(callback) {
          sampleTest.findById(req.params.testId)
          .exec(callback);
      },
      sample_item: function(callback) {
          sample.find({'serialNumber':req.params.sampleId})
          .exec(callback);
      },
      files: function(callback){
          sampleFile.find({'sampleTestId':req.params.testId}, 'name _id')
          .exec(callback);
      }
  }, function(err, results) {
      res.render('sampleTest_detail', { title: 'sample Test', error: err, data: results });
  });  
};

/* GET sample test create*/
exports.sampleTest_create_get = function(req, res){
  sample.find({'serialNumber': req.params.id})
  .exec(function (err, sample_item) {
    if (err) { return next(err); }
    // Successful, so render.
    res.render('sampleTest_form', {title: 'Create sample Test', sample: sample_item[0]});
  });
};

/* POST sample test create*/
exports.sampleTest_create_post = [

  // Validate and sanitise fields.
  body('tester', 'Tester must be specified').trim().isLength({ min: 1 }).escape(),
  body('testDate', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),
  body('result').escape(),
  body('sampleTestFiles').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      var fileArray = [];
      
      if(req.files.sampleTestFiles.length > 1){
      
          // TODO: allow for only 1 file
          req.files.sampleTestFiles.forEach(file =>{
              var newFile = new sampleFile({
                  name: file.name,
                  data: file.data,
                  contentType:file.mimetype
              });

              fileArray.push(newFile);
          });
      }else{
        var newFile = new sampleFile({
            name: req.files.sampleTestFiles.name,
            data: req.files.sampleTestFiles.data,
            contentType:req.files.sampleTestFiles.mimetype
        });
        fileArray.push(newFile);
      }
      
      var newsampleTest = new sampleTest({
          tester: req.body.tester,
          testDate: req.body.testDate,
          result: req.body.result,
          sampleId: req.body.sampleId,
          files: fileArray
      });


      if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values and error messages.
          sample.find({'serialNumber': req.params.serialNumber})
              .exec(function (err, sample_item) {
                  if (err) { return next(err); }
                  // Successful, so render.
                  res.render('sampleTest_form', { title: 'Create sample Test', sample: sample_item, errors: errors.array(), sampleTest: newsampleTest});
                });
          return;
      }
      else {

          

          // Data from form is valid.
        newsampleTest.save(function (err,sampleTest) {
            if (err) { return next(err); }

            // Add all files
            fileArray.forEach(file=>{
            
                // Add new id
                file.sampleTestId = sampleTest._id
                
                // save file
                file.save(function (err) {
                    if (err) { return next(err); }
                });
            });

            // Successful - redirect to new record.
            res.redirect('/samplelist');
        });
      }
  }
];