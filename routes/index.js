var express = require('express');
var router = express.Router();

//var sample_controller = require('../controllers/sampleController');
//var sampleTest_controller = require('../controllers/sampleTestController');

var home_controler = require('../controllers/homeController');

/* GET home page. */
router.get('/', home_controler.index);

// // GET request for creating a sample model
// router.get('/sample/create', sample_controller.sample_create_get);

// // POST request for creating a sample
// router.post('/sample/create', sample_controller.sample_create_post);

// // GET request for one sample.
// router.get('/sample/:id', sample_controller.sample_detail);

// // GET request for list of all samples
// router.get('/samplelist', sample_controller.sample_list);

// // GET requeste for creating a sample test
// router.get('/sample/:id/sampletest/create', sampleTest_controller.sampleTest_create_get);

// // POST requeste for creating a sample test
// router.post('/sample/:id/sampletest/create', sampleTest_controller.sampleTest_create_post);

// // GET request for one sample test.
// router.get('/sample/:sampleId/sampletest/:testId', sampleTest_controller.sampleTest_detail);

module.exports = router;
