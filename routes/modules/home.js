// 封裝 home 模組，這支模組專門管理首頁

// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();

//引用資料庫model
const Record = require("../../models/record");
// const User = require("../../models/user");
// const Category = require("../../models/category");

// 定義首頁路由
router.get("/", (req, res) => {
  Record.find()
    .lean()
    .then((records) => res.render("index", { records }))
    .catch((err) => console.log(err));
});
// 匯出路由模組
module.exports = router;
