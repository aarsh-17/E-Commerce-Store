import  Coupon  from "../models/coupon.model.js";
export const getCoupon=async(req,res)=>{
  try{
    const coupons=await Coupon.findOne({userId:req.user._id,isActive:true});
    res.json(coupons);
  }catch(error){
    console.log(error.message);
    res.status(500).json({error:"Internal server error"});
  }
}

export const validateCoupon=async(req,res)=>{
  try{
    const {code}=req.body;
    const coupon=await Coupon.findOne({code:code,userId:req.user._id,isActive:true});
    if(!coupon){
      return res.status(404).json({error:"Coupon not found"});
    }
    res.json({message:"Coupon is valid",code:coupon.code,disocuntPercentage:coupon.disocuntPercentage});
  }catch(error){
    console.log(error.message);
    res.status(500).json({error:"Internal server error"});
  }
}