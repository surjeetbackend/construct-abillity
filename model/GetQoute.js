const mongoose=require('mongoose');


const GetQoute=new mongoose.Schema({
    customer_name:{type:String,required:true,},
    customer_number:{type:Number,required:true},
    customer_email:{type:String,required:true},
    Massage:{type:String},
    GQ_status:{type:String,enum:["coordinate","not-coordinate"]}

});

module.exports=mongoose.model('getquote',GetQoute);