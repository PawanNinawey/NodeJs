const mongoose = require("mongoose");
require("./brand");
require("./category");

const carSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: "brands" },
  name: String,
  model: Number,
  transmission: String,
  engine: String,
  power: Number,
  seater: Number,
  price: Number,
  deposit: Number,
});

module.exports = mongoose.model("cars", carSchema);
