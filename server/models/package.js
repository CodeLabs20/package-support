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
    type: Number,
    default: 6,   //'unknown'

    //Possible values: ['pre_transit', 'transit', 'out_for_delivery', 'delivered', 
    // 'return_to_sender', 'failure', 'unknown']

    //NOTE: get the correct number for the API response before making create/update call to db
    
    //Validation
    validate(value) {
      if (value < 0 || value > 6) throw new Error("Please enter a valid value.");
    }
  },

  checkInStatus: {
    type: Number,
    default: 0,   //'not checked in'

    //Possible values: ['not checked in', 'checked in']

    validate(value) {
      if (value < 0 || value > 1) throw new Error("Please enter a valid value.");
    }
  },

  checkInDate: {
    type: Date
  },


}, {"collection":"purchase-order"});

const Package = mongoose.model("Package", packageSchema);
module.exports = Package;