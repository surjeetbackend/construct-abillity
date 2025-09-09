const mongoose=require('mongoose');


const getservice = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  date: {
    type: Date 
  },
  GQ_status: {
    type: String,
    enum: ["coordinate", "not-coordinate"]
  }
}, { timestamps: true });

module.exports=mongoose.model('getservice',getservice);