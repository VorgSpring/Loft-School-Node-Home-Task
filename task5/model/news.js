const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const news = new Schema({
  theme: {
    type: String
  },
  date: {
    type: Date
  },
  text: {
    type: String
  },
  userId: {
    type: Number
  }
});

mongoose.model('news', news);
