import mongoose from "mongoose";

const CouponSchema=new mongoose.Schema({
  code:{
    type:String,
    required:true,
    unique:true
  },
  disocuntPercentage:{
    type:Number,
    required:true,
    min:0,
    max:100
  },
  expiryDate:{
    type:Date,
    required:true
  },
  isActive:{
    type:Boolean,
    default:true
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  }
},
{timestamps:true}
);

const Coupon=mongoose.model("Coupon",CouponSchema);
export default Coupon;