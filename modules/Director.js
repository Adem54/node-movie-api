const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { String } = Schema.Types;

const movieSchema = new Schema({
  name: { type: String, maxlength: 14, minlength: 5 },
  surname: { type: String, maxlength: 18, minlength: 3 },
  bio: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("directors", movieSchema);
