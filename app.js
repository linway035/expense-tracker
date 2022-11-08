const express = require("express"); // 載入 express 並建構應用程式伺服器
const exphbs = require("express-handlebars");

//dotenv設置
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const routes = require("./routes");
const app = express();
const port = process.env.PORT;

// setting static files靜態檔案
app.use(express.static("public"));

// setting template engine
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");

// 將 request 導入路由器
app.use(routes);

app.listen(port, () => {
  console.log(`running on https://localhost:${port}`);
});
