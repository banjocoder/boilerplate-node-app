var File = require('../models/pipeFile');

exports.download_file = function(req, res, next){
    File.findById(req.params.fileId)
    .exec(function (err, file_item) {
        if (err) { return next(err); }
        res.setHeader('content-type', file_item.contentType);
        res.setHeader('content-disposition','attachment; filename="' + file_item.name + '"');
        // Successful, so render.
        res.send(file_item.data);
    });
};