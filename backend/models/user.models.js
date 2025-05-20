import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  password:{
    type: String,
    required: [true,"password is required"],
    minlength: [6,"password must be at least 6 characters long"],
  },
  email: {
    type:String,
    required: [true,"email is required"],
    unique: true,
    trim: true,
  },
  cartitems:[
    {
    quantity:{
      type: Number,
      default: 1,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  }
  ],
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
  },
  {
    timestamps: true,
  }
  );



userSchema.pre("save",async function(next){
  if(!this.isModified("password")){
    next();
  }
  try{
    const salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt);
  }
  catch(error){
    next(error);
  }
})

userSchema.methods.comparePassword=async function(password){
  return bcrypt.compare(password,this.password);
}

const User=mongoose.model("User",userSchema);
export default User;