const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name of Category is required"],
  },
  image: {
    type: String,
    required: [true, "Image of Category is required"],
  },
});

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
