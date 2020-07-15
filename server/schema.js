const mongoose = require('mongoose');

//nested schema for items
let itemSchema = new mongoose.Schema({
  itemName: {type: String},
  price: {type: Number},
  quantity: {type: Number}

});

//parent schema for package information
const packageSchema = new mongoose.Schema({
  trackingNum: {
    type: String,
    required: true,
    trim: true
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

  itemsOrdered: [itemSchema],

  purchaseOrderStatus: {
    type: String,
    default: "unknown"
  }


}, {"collection":"purchase-order"});

const Package = mongoose.model("Package", packageSchema);
module.exports = Package;