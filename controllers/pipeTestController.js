// Include pipe model here
var async = require('async');
const { body,validationResult } = require('express-validator');
var Pipe = require('../models/pipe');
var PipeTest = require('../models/pipeTest');
var PipeFile = require('../models/pipeFile')

/* GET pipe test detail*/
exports.pipeTest_detail = function(req, res, next){
    async.parallel({
      pipeTest_item: function(callback) {
          PipeTest.findById(req.params.testId)
          .exec(callback);
      },
      pipe_item: function(callback) {
          Pipe.find({'serialNumber':req.params.pipeId})
          .exec(callback);
      },
      files: function(callback){
          PipeFile.find({'pipeTestId':req.params.testId}, 'name _id')
          .exec(callback);
      }
  }, function(err, results) {
      res.render('pipeTest_detail', { title: 'Pipe Test', error: err, data: results });
  });  
};

/* GET pipe test create*/
exports.pipeTest_create_get = function(req, res){
  Pipe.find({'serialNumber': req.params.id})
  .exec(function (err, pipe_item) {
    if (err) { return next(err); }
    // Successful, so render.
    res.render('pipeTest_form', {title: 'Create Pipe Test', pipe: pipe_item[0]});
  });
};

/* POST pipe test create*/
exports.pipeTest_create_post = [

  // Validate and sanitise fields.
  body('tester', 'Tester must be specified').trim().isLength({ min: 1 }).escape(),
  body('testDate', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),
  body('result').escape(),
  body('pipeTestFiles').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      var fileArray = [];
      
      if(req.files.pipeTestFiles.length > 1){
      
          // TODO: allow for only 1 file
          req.files.pipeTestFiles.forEach(file =>{
              var newFile = new PipeFile({
                  name: file.name,
                  data: file.data,
                  contentType:file.mimetype
              });

              fileArray.push(newFile);
          });
      }else{
        var newFile = new PipeFile({
            name: req.files.pipeTestFiles.name,
            data: req.files.pipeTestFiles.data,
            contentType:req.files.pipeTestFiles.mimetype
        });
        fileArray.push(newFile);
      }
      
      var newPipeTest = new PipeTest({
          tester: req.body.tester,
          testDate: req.body.testDate,
          result: req.body.result,
          pipeId: req.body.pipeId,
          files: fileArray
      });


      if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values and error messages.
          Pipe.find({'serialNumber': req.params.serialNumber})
              .exec(function (err, pipe_item) {
                  if (err) { return next(err); }
                  // Successful, so render.
                  res.render('pipeTest_form', { title: 'Create Pipe Test', pipe: pipe_item, errors: errors.array(), pipeTest: newPipeTest});
                });
          return;
      }
      else {

          

          // Data from form is valid.
        newPipeTest.save(function (err,pipeTest) {
            if (err) { return next(err); }

            // Add all files
            fileArray.forEach(file=>{
            
                // Add new id
                file.pipeTestId = pipeTest._id
                
                // save file
                file.save(function (err) {
                    if (err) { return next(err); }
                });
            });

            // Successful - redirect to new record.
            res.redirect('/pipelist');
        });
      }
  }
];