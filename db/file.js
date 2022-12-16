const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model("files", fileSchema);
