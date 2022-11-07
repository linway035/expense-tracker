const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categorySchema = new Schema({
  //需要給id
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Category", categorySchema);
