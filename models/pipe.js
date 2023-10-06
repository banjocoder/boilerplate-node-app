var mongoose = require('mongoose');
var { DateTime } = require('luxon') ;

var Schema = mongoose.Schema;
var { DateTime } = require('luxon') ;

var PipeSchema = new Schema(
  {
    serialNumber:   {type: String, required: true},
    manufacturedDate:  {type: Date, required: true},
    manufacturer: {type: String, required: false},
    purchaseDate:    {type: Date, required: false},
    owner: {type: String, required: true}
  }
);

// Virtual for book's URL
PipeSchema
.virtual('url')
.get(function () {
  return '/pipe/' + this.serialNumber;
});

PipeSchema
.virtual('manufacturedDate_formatted')
.get(function(){
  return this.manufacturedDate 
    ? DateTime.fromJSDate(this.manufacturedDate).toLocaleString(DateTime.DATE_MED) 
    : '';
});

PipeSchema
.virtual('purchasedDate_formatted')
.get(function(){
  return this.purchaseDate 
    ? DateTime.fromJSDate(this.purchaseDate).toLocaleString(DateTime.DATE_MED) 
    : '';
});


//Export model
module.exports = mongoose.model('Pipe', PipeSchema);