// 封裝 home 模組，這支模組專門管理首頁

// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();

// 定義首頁路由
router.get("/", (req, res) => {
  res.render("index");
});
// 匯出路由模組
module.exports = router;
