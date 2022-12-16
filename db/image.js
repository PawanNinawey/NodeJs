const mongoose = require("mongoose");

const car = require("./car");
const imageSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "cars" },
  url: String,
  file: String,
});

module.exports = mongoose.model("images", imageSchema);
