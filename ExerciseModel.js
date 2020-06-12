var mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exerciseSchema = new Schema(
  {
    userId: { type: String, minLength: 3 },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, required: false },
    username: { type: String, required: false }
  },
  { timestamps: true }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);
module.exports = Exercise;
