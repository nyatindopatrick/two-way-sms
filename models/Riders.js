const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const riderSchema= new Schema({
    // _id:mongoose.Schema.Types.ObjectId,
    name: String,
    plateNumber: String,
    sacco: String,
    saccoLeader: String,
    motorbikeMake: String,
    saccoCode:String,
    bikeOwner: String,
    riderContact:Number,
    saccoContact:Number

});

module.exports = mongoose.model("Riders", riderSchema);