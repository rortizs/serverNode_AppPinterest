const express = require("express");
const path = require("path");
const morgan = require("morgan");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { format } = require("timeago.js");

//! Initializations
const app = express();
require("./database"); //**conexion a la base de datos de mongodb */

//! Settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//! Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

//! config multer storage and filename orignal
const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/img/uploads"),
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname).toLowerCase());
  },
});

//! upload iamge for multer
app.use(
  multer({
    storage,
    //? limite de peso de las imagenes 25M
    limits: { fileSize: 25000000 },
    //? filter type image acepted
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|git/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname));
      if (mimetype && extname) {
        return cb(null, true);
      }
      cb("Error: Archivo debe ser imagen valida");
    },
  }).single("image")
);

//! Global variables
app.use((req, res, next) => {
  app.locals.format = format;
  next();
});

//! Routes
app.use(require("./routes/index.routes"));

//! Static files
app.use(express.static(path.join(__dirname, "public")));

//! Start the server
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
