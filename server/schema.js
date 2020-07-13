const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  trackingNum: {
    type: String,
    required: true,
    trim: true,
  },
  deliveryStatus: {
    type: String,
    default: "unknown",
    
    //NOTE: add validation after reviewing APIs
    //validate(value) {
    //  if (value < 0) throw new Error("Negative calories aren't real.");
    //}
  },
  checkInStatus: {
    type: String,
    default: "not checked in",
  }
}, {"collection":"purchase-order"});

const Package = mongoose.model("Package", packageSchema);
module.exports = Package;