const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true // 之後測試是否能用同名 以及空白是否trim
    // trim: true, //空白是否trim有效
  },
  email: {
    type: String // 沒有email這type
    // required: true, //若不能同名就保留
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model('User', userSchema)
