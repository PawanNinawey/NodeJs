const mongoose = require("mongoose");
const schema = mongoose.Schema;

const role = require("./role");
const profileSchema = new schema({
  roleId: { type: schema.Types.ObjectId, ref: "roles" },
  name: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
});

module.exports = mongoose.model("profiles", profileSchema);
