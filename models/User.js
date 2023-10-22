const mongoose = require('mongoose');
const Blog = require("./Blog");

const userSchema = new mongoose.Schema({
  name: String,
  events: [String]
});

module.exports = mongoose.model('User', userSchema);
