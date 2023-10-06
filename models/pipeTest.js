var mongoose = require('mongoose');
var { DateTime } = require('luxon') ;

var Schema = mongoose.Schema;

var PipeTestSchema = new Schema(
  {
    tester:   {type: String, required: true},
    testDate:  {type: Date, required: true},
    result: {type: String, required: true, enum: ['Pass', 'Fail']},
    pipeId: {type: Schema.Types.ObjectId, required:true, ref: 'PipeID'},
    files: [{type: Schema.Types.ObjectId, required:false, ref: 'Files'}]
  }
);

PipeTestSchema
.virtual('testDate_formatted')
.get(function(){
  return this.testDate 
    ? DateTime.fromJSDate(this.testDate).toLocaleString(DateTime.DATE_MED) 
    : '';
});

PipeTestSchema
.virtual('url')
.get(function(){
  return '/pipeTest/' + this._id;
});

//Export model
module.exports = mongoose.model('PipeTest', PipeTestSchema);