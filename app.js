const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const moviesRouter = require("./routes/movie");
const directorRouter=require("./routes/director")


//body-parser modülü express in içerisinde gelir ama bu şekilde çağırdıktan sonra kullanabiliriz
const bodyParser=require("body-parser");

//Mongo Atlas ile bağlanmaya çalışırken kullandık
//const db=require("./config/db");
//db()

const mongoose = require("mongoose");
const app = express();

mongoose.connect("mongodb://localhost/movie-api", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("open", () => {
  console.log("MongoDB bağlantısı başarılı birşekilde gerçekleşmiştir...");
});
db.on("error", err => {
  console.log(err);
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));

//bodyParser Ayarları
//app.use(express.json());
app.use(bodyParser.json());
//encod edilmiş url lerde bodyParser kullanabilmek içinde extended:true yaparız
//encode edilmiş demek url i evrensel standartlara göre ayarlanmış demek mesela biz url yi string olarak yazdı isek encode a çevrilince araya + koyar
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/directors",directorRouter);

// catch 404 and forward to error handler

app.use((req, res, next) => {
  next(createError(404));
});  

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);


  res.render("error")
  //res.json({error:{message:err.message,code:err.code}});
});

module.exports = app;
