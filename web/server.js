const express = require("express");
const path = require("path");

const app = express();
const PORT = 10000;

// phục vụ file tĩnh trong thư mục "web"
app.use(express.static(path.join(__dirname, "web")));

// route /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

// route /stocks
app.get("/stocks", (req, res) => {
  res.sendFile(path.join(__dirname, "stock.html"));
});

// start server
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});
