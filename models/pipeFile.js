var mongoose = require('mongoose');
var { DateTime } = require('luxon') ;

var Schema = mongoose.Schema;

var PipeFileSchema = new Schema(
  {
    name:   {type: String, required: true},
    pipeTestId:  {type: String, required: true},
    data:    {type: Buffer, required: true},
    contentType: {type: String}
  }
);

//Export model
module.exports = mongoose.model('PipeFile', PipeFileSchema);