const path = require("path");

const Category = require(path.join(__dirname, "./../models/category-model"));
const Recipe = require(path.join(__dirname, "./../models/recipe-model"));

exports.homepage = async (req, res, next) => {
  try {
    const categories = await Category.find().limit(5);
    const latest = await Recipe.find().sort({ _id: -1 }).limit(5);
    const thai = await Recipe.find({ category: "Thai" }).limit(5);
    const american = await Recipe.find({ category: "American" }).limit(5);
    const chinese = await Recipe.find({ category: "Chinese" }).limit(5);

    if (!categories || !latest || !thai || !american || !chinese)
      throw new Error("Error getting categories");

    res.status(200).render("homepage", {
      categories,
      food: { latest, thai, american, chinese },
      title: "Cooking Blog - Home",
    });
  } catch (error) {
    console.log("ERROR", error.message);
    res.status(200).render("homepage", {
      title: "Cooking Blog - Home",
    });
  }
};

exports.allCategoriesPage = async (req, res, next) => {
  try {
    const allCategory = await Category.find();
    if (!allCategory) throw new Error("Error getting categories");

    res.status(200).render("allCategories", {
      categories: allCategory,
      title: "Categories - Cooking Blog",
    });
  } catch (error) {
    console.log("ERROR", error.message);
    res.status(200).render("categories", {
      title: "Cooking Blog",
    });
  }
};

exports.oneCategoryPage = async (req, res, next) => {
  try {
    const categoryById = await Recipe.find({ category: req.params.name });
    if (!categoryById) throw new Error("Error getting recipe");

    res.status(200).render("recipesByCategory", {
      category: req.params.name,
      categoryById,
      title: `Categories - Cooking Blog`,
    });
  } catch (error) {
    console.log("ERROR", error.message);
    res.status(200).render("recipesByCategory", {
      title: `Cooking Blog`,
    });
  }
};

exports.recipePage = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) throw new Error("Error getting recipe");

    res.status(200).render("recipe", {
      recipe,
      title: `${recipe.name} - Cooking Blog`,
    });
  } catch (error) {
    console.log("ERROR", error.message);
    res.status(200).render("recipe", {
      title: `Cooking Blog`,
    });
  }
};

exports.search = async (req, res, next) => {
  try {
    const searchTerm = req.body.searchTerm;
    let recipes = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });

    res.render("search", {
      title: `Search - ${searchTerm}`,
      recipes,
      searchTerm,
    });
  } catch (err) {
    res.redirect("/");
  }
};

exports.exploreLatest = async (req, res, next) => {
  try {
    const recipes = await Recipe.find().sort({ _id: -1 });
    res.render("exploreLatest", {
      title: "Explore Latest",
      recipes,
    });
  } catch (err) {
    res.redirect("/");
  }
};

exports.exploreRandom = async (req, res, next) => {
  try {
    const count = await Recipe.find().countDocuments();
    const random = Math.floor(Math.random() * count);
    const recipe = await Recipe.findOne().skip(random).exec();
    res.render("exploreRandom", {
      title: "Random Recipe",
      recipe,
    });
  } catch (error) {}
  res.render("exploreRandom", {
    title: "Random Recipe",
  });
};

exports.submitRecipePage = async (req, res, next) => {
  try {
    res.render("submitRecipe", {
      title: "Submit Recipe",
    });
  } catch (error) {
    res.render("submitRecipe", {
      title: "Submit Recipe",
    });
  }
};

exports.submitRecipe = async (req, res, next) => {
  try {
    const { name, description, email, ingredients, category } = req.body;

    const recipe = await Recipe.create({
      name,
      description,
      email,
      ingredients,
      category,
      image: req.file.filename,
    });
    res.render("submitRecipe", {
      title: "Submit Recipe",
      success: "Recipe Posted Successfully",
    });
  } catch (err) {
    res.render("submitRecipe", {
      title: "Submit Recipe",
      error: err.message,
    });
  }
};
