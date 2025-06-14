import express from 'express';
import { getAllProducts, getFeaturedProducts,createProduct ,deleteProduct,getRecommendedProducts,getProductsByCategory,toggleFeaturedProduct} from '../controllers/product.controller.js';
import { adminRoute, protectedRoute } from '../middleware/auth.middleware.js';

const router=express.Router();

router.get('/',protectedRoute,adminRoute,getAllProducts);
router.get('/featured',getFeaturedProducts);
router.get('/category/:category',getProductsByCategory);
router.get('/recommended',getRecommendedProducts);
router.post('/',protectedRoute,adminRoute,createProduct);
router.post('/:id',protectedRoute,adminRoute,deleteProduct);
router.patch('/:id',protectedRoute,adminRoute,toggleFeaturedProduct);

export default router;
  