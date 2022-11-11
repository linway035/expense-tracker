//npm run seed  建議categorySeeder先做

//因為種子資料檔是一個獨立執行的檔案，它沒經過app.js，所以這裡要寫一次，不然db(mongoose)中的process.env.MONGODB_URI讀不到
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const Category = require("../category");
//注意，這句要放在dotenv後面，才會有採用到環境變數
const db = require("../../config/mongoose");

const SEED_CATEGORIES = [
  {
    id: 1,
    name: "家居物業",
  },
  {
    id: 2,
    name: "交通出行",
  },
  {
    id: 3,
    name: "休閒娛樂",
  },
  {
    id: 4,
    name: "餐飲食品",
  },
  {
    id: 5,
    name: "其他",
  },
];

db.once("open", () => {
  Promise.all(
    SEED_CATEGORIES.map((cat) => {
      return Category.create(cat);
    })
  )
    .then(() => {
      console.log("categorySeeder Done!");
      process.exit();
    })
    .catch((err) => console.log(err));
});
