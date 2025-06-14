import Product from "../models/product.model.js"
import redis from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
export const getAllProducts=async(req,res)=>{
  try{
    const products=await Product.find({});
    res.status(200).json({products});
  }catch(error){
    console.log(error.message);
    res.status(500).json({error:"Internal server error"});
  }
}

export const getFeaturedProducts=async(req,res)=>{
  try{
    let featuredProducts=await redis.get("featured_products")
    if(featuredProducts){
      return res.json({products:JSON.parse(featuredProducts)});
    }
    featuredProducts=await Product.find({isFeatured:true}).lean();
    if(!featuredProducts){
      return res.status(404).json({error:"Products not found"});
    }

    await redis.set("featured_products",JSON.stringify(featuredProducts));
    res.status(200).json({featuredProducts});
  }catch(error){
    console.log(error.message);
    res.status(500).json({error:"Internal server error"});
  }
}

export const createProduct=async(req,res)=>{
  try{
    const {name,description,price,image, category,isFeatured}=req.body;
    let cloudinaryResponse=null;
    if(image){
      cloudinaryResponse =await cloudinary.uploader.upload(image, {folder: "products"} );
        
    }
    const product=await Product.create({
      name,
      description,
      price,
      image:cloudinaryResponse?.secure_url?cloudinaryResponse:"", 
      category,
      });
   
    res.status(201).json(product);
  }catch(error){
    console.log(error.message);
    res.status(500).json({error:"Internal server error"});
  }
}

export const deleteProduct=async(req,res)=>{
  try{
    const product=await Product.findById(req.params.id);
    if(!product){
      return res.status(404).json({error:"Product not found"});
    }

    if(product.image){
      const publicId=product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Image deleted from cloudinary");
        
      } catch (error) {
        console.log(error.message);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"Product deleted successfully"});
  }catch(error){
    console.log(error.message);
    res.status(500).json({error:"Internal server error"});
  }
}

export const getRecommendedProducts=async(req,res)=>{
  try{
    const products=await Product.aggregate([
      {
        $sample:{size:4}
      },{
        $project:{name:1,description:1,price:1,image:1,category:1
  }
}
])

res.json(products);
  }catch(error){
    console.log(error.message);
    res.status(500).json({error:"Internal server error"});
  }
}

export const getProductsByCategory=async(req,res)=>{
  try{
    const products=await Product.find({category:req.params.category});
    res.json(products);
  }catch(error){
    console.log(error.message);
    res.status(500).json({error:"Internal server error"});
  }
}

export const toggleFeaturedProduct=async(req,res)=>{
  try{
    const product=await Product.findById(req.params.id);
    if(!product){
      return res.status(404).json({error:"Product not found"});
    }
    product.isFeatured=!product.isFeatured;
    const updatedProduct=await product.save();
    await updateFeaturedProductCache();
    res.status(200).json({product:updatedProduct,message:"Product updated successfully"});
  }catch(error){
    console.log(error.message);
    res.status(500).json({error:"Internal server error"});
  }
}

async function updateFeaturedProductCache(){
  try{
    const featuredProducts=await Product.find({isFeatured:true}).lean();
    await redis.set("featured_products",JSON.stringify(featuredProducts));
  }catch(error){
    console.log(error.message);
    
  }
  }
  