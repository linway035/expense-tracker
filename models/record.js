const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const recordSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    //Mongoose 提供的 Populate 功能，
    type: Schema.Types.ObjectId, //定義 userId 這個項目是一個 ObjectId，也就是它會連向另一個資料物件
    ref: "User", //定義參考對象是 User model
    index: true, //把 userId 設定成「索引」，使用索引來查詢資料能夠增加讀取效能
    required: true,
  },
  categoryId: {
    type: Number, //用number就好，不需要Schema.Types.ObjectId之類複雜的
    ref: "Category",
    index: true,
    required: true,
  },
});
module.exports = mongoose.model("Record", recordSchema);
