const mongoose = require('mongoose');

//schema for items
const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },

  price: {
    type: Number
  },

  quantity: {
    type: Number,
    required: true
  },

  checkInDate: {
    type: Date,
    required: true
  },

  purchaseOrderStatus: {
    type: Number,
    default: 0
  },

  packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'packageSchema'
  }

}, {"collection":"item"});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;