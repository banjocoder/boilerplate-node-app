// Sample Model
var mongoose = require('mongoose');
var { DateTime } = require('luxon') ;

var Schema = mongoose.Schema;
var { DateTime } = require('luxon') ;

var sampleSchema = new Schema(
  {
    serialNumber:   {type: String, required: true},
    manufacturedDate:  {type: Date, required: true},
    manufacturer: {type: String, required: false},
    purchaseDate:    {type: Date, required: false},
    owner: {type: String, required: true}
  }
);

// Virtual for book's URL
sampleSchema
.virtual('url')
.get(function () {
  return '/sample/' + this.serialNumber;
});

sampleSchema
.virtual('manufacturedDate_formatted')
.get(function(){
  return this.manufacturedDate 
    ? DateTime.fromJSDate(this.manufacturedDate).toLocaleString(DateTime.DATE_MED) 
    : '';
});

sampleSchema
.virtual('purchasedDate_formatted')
.get(function(){
  return this.purchaseDate 
    ? DateTime.fromJSDate(this.purchaseDate).toLocaleString(DateTime.DATE_MED) 
    : '';
});


//Export model
module.exports = mongoose.model('sample', sampleSchema);