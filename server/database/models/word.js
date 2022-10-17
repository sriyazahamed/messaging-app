const { Schema, model } = require('mongoose');

const WordModel = model('words', new Schema({
  word: {
    type: Schema.Types.String,
    required: true,
   
  },
  
}));

module.exports= WordModel;
