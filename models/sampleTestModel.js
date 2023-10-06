var mongoose = require('mongoose');
var { DateTime } = require('luxon') ;

var Schema = mongoose.Schema;

var sampleTestSchema = new Schema(
  {
    tester:   {type: String, required: true},
    testDate:  {type: Date, required: true},
    result: {type: String, required: true, enum: ['Pass', 'Fail']},
    sampleId: {type: Schema.Types.ObjectId, required:true, ref: 'sampleID'},
    files: [{type: Schema.Types.ObjectId, required:false, ref: 'Files'}]
  }
);

sampleTestSchema
.virtual('testDate_formatted')
.get(function(){
  return this.testDate 
    ? DateTime.fromJSDate(this.testDate).toLocaleString(DateTime.DATE_MED) 
    : '';
});

sampleTestSchema
.virtual('url')
.get(function(){
  return '/sampleTest/' + this._id;
});

//Export model
module.exports = mongoose.model('sampleTest', sampleTestSchema);