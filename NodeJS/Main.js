const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

var authRouter = require("./router/auth.js");
var fileRouter = require("./router/file.js");
var aiRouter = require("./router/ai.js");

var authCheck = require("./modules/authCheck.js");
var template = require("./modules/template.js");

var app = express();
var port = 3005;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "as321v3221sadv65q!@#ASVasd321",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/auth", authRouter); // 인증 라우터
app.use("/file", fileRouter); // 파일 라우터
app.use("/ai", aiRouter); // ai 라우터

app.get("/", (req, res) => {
  if (!authCheck.isOwner(req, res)) {
    // 로그인 안되어있으면 로그인 페이지로 이동시킴
    res.redirect("/auth/login");
    return false;
  } else {
    // 로그인 되어있으면 메인 페이지로 이동시킴
    res.redirect("/main");
    return false;
  }
});

// 메인 페이지
app.get("/main", (req, res) => {
  if (!authCheck.isOwner(req, res)) {
    // 로그인 안되어있으면 로그인 페이지로 이동시킴
    res.redirect("/auth/login");
    return false;
  }
  var html = template.HTML(
    "Welcome",
    `<hr>
    <h2>메인 페이지에 오신 것을 환영합니다</h2>
    <p>로그인에 성공하셨습니다.</p>
    <a href="/file">FileUpload</a>
    <a href="/ai">AI Module</a>
    `,
    authCheck.statusUI(req, res)
  );
  res.send(html);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
