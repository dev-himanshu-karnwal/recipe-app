const path = require("path");
const express = require("express");
const multer = require("multer");

const appController = require(path.join(
  __dirname,
  "./../controllers/app-controller"
));

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "./../public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get("/", appController.homepage);
router.get("/categories", appController.allCategoriesPage);
router.get("/categories/:name", appController.oneCategoryPage);
router.get("/recipe/:id", appController.recipePage);
router.get("/explore-latest", appController.exploreLatest);
router.get("/explore-random", appController.exploreRandom);
router.get("/submit-recipe", appController.submitRecipePage);
router.post("/search", appController.search);
router.post(
  "/submit-recipe",
  upload.single("image"),
  appController.submitRecipe
);

module.exports = router;
