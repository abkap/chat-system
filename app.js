const express = require("express");

const PORT = 3000;
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
