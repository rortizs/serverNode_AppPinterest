const { Router } = require("express");
const router = Router();
const path = require("path");
const { unlink } = require("fs-extra");

const Image = require("../models/image");
const image = require("../models/image");

//? ruta principal
router.get("/", async (req, res) => {
  const images = await Image.find();
  res.render("index", { images });
});

//? ruta para mostrar el formulario que permita adjuntar la imagen */
router.get("/upload", (req, res) => {
  res.render("upload"); //! rederiza un html en --> upload.ejs
});

//? ruta para subir la imagen con el submit
router.post("/upload", async (req, res) => {
  const image = new Image();
  image.title = req.body.title;
  image.description = req.body.description;
  image.filename = req.file.filename;
  image.path = "/img/uploads/" + req.file.filename;
  image.originalname = req.file.originalname;
  image.mimetype = req.file.mimetype;
  image.size = req.file.size;

  await image.save(); //? guardando en la base de datos en mongodb

  res.redirect("/"); //! lo redirecciono a la pagina inicial
});

//? ruta para mostrar una unica vista para una unica imagen
router.get("/image/:id", async (req, res) => {
  const { id } = req.params;
  const image = await Image.findById(id);
  console.log(image);
  res.render("profile", { image });
});

//!ruta para eliminar una imagen por medio del id
router.get("/image/:id/delete", async (req, res) => {
  const { id } = req.params; //! obtengo el id de la imagen
  const image = await Image.findByIdAndDelete(id); //! elimino el path de la base de datos.
  await unlink(path.resolve("./src/public" + image.path)); //! elimino la imagen del servidor
  res.redirect("/"); //! redirecciona a la pagina inicio
});

module.exports = router;
