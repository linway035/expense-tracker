// 載入 express 並建構應用程式伺服器
const express = require("express");

//dotenv設置
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const routes = require("./routes");
const app = express();
const port = process.env.PORT;

// 將 request 導入路由器
app.use(routes);

app.listen(port, () => {
  console.log(`running on https://localhost:${port}`);
});
