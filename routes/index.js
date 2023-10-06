var express = require('express');
var router = express.Router();

var pipe_controller = require('../controllers/pipeController');
var pipeTest_controller = require('../controllers/pipeTestController');
var file_controller = require('../controllers/fileController');

/* GET home page. */
router.get('/', pipe_controller.pipe_list);

// GET request for creating a pipe 
router.get('/pipe/create', pipe_controller.pipe_create_get);

// POST request for creating a pipe
router.post('/pipe/create', pipe_controller.pipe_create_post);

// GET request for one pipe.
router.get('/pipe/:id', pipe_controller.pipe_detail);

// GET request for list of all pipes
router.get('/pipelist', pipe_controller.pipe_list);

// GET requeste for creating a pipe test
router.get('/pipe/:id/pipetest/create', pipeTest_controller.pipeTest_create_get);

// POST requeste for creating a pipe test
router.post('/pipe/:id/pipetest/create', pipeTest_controller.pipeTest_create_post);

// GET request for one pipe test.
router.get('/pipe/:pipeId/pipetest/:testId', pipeTest_controller.pipeTest_detail);

// GET request for one pipe test.
router.get('/pipe/:pipeId/pipetest/:testId/file/:fileId', file_controller.download_file);

module.exports = router;
