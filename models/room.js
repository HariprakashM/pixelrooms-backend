const mongoose=require('mongoose');

const roomSchema=mongoose.Schema({
    name:{type:String,required:true},
    location:{type:String,required:true},
    maxcount:{type:Number,required:true},
    phonenumber:{type:Number,required:true},
    rating:{type:Number},
    type:{type:String,required:true},
    rentperday:{type:Number,required:true},
    imageurls:[],
    currentbookings:[],
    description:{type:String,required:true},
    facilities:{type:String,required:true}
},{timestamps:true})

const roomModel=mongoose.model('rooms', roomSchema);

module.exports=roomModel;