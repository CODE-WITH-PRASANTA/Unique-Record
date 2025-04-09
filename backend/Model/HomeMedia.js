const mongoose = require("mongoose");

const homeMediaSchema = new mongoose.Schema({
  name: String,
  url: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("HomeMedia", homeMediaSchema);
