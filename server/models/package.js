const mongoose = require('mongoose');

//schema for package information
const packageSchema = new mongoose.Schema({
  trackingNum: {
    type: String,
    required: true,
    trim: true
  },

  carrier: {
    type: String,
    required: true
  },

  deliveryStatus: {
    type: String,
    default: "unknown"
    
    //NOTE: add validation after reviewing APIs
    //validate(value) {
    //  if (value < 0) throw new Error("Negative calories aren't real.");
    //}
  },

  checkInStatus: {
    type: String,
    default: "not checked in"
  },

  checkInDate: {
    type: Date
  },


}, {"collection":"purchase-order"});

const Package = mongoose.model("Package", packageSchema);
module.exports = Package;