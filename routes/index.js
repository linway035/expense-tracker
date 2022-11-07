// 建立專案總路由器：express.Router

// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();

// 引入 模組程式碼
const home = require("./modules/home");
const expenses = require("./modules/expenses");

// 將網址結構符合  字串的 request 導向  模組
router.use("/expenses", expenses);
router.use("/", home);

// 匯出路由器
module.exports = router;
