// Upload Routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage - save to backend uploads/products folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save to backend's uploads/products folder
    const uploadPath = path.join(__dirname, '../../uploads/products');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Always use timestamp + random suffix for initial upload
    // This ensures no overwrites during upload process
    // File will be renamed to use product ID after product is created
    const ext = path.extname(file.originalname).toLowerCase();
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const filename = `temp-${timestamp}-${random}${ext}`;
    
    console.log(`📤 Receiving upload: ${file.originalname} → ${filename}`);
    cb(null, filename);
  }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG and WebP are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

/**
 * POST /api/upload/product-image
 * Upload a product image (temporary upload)
 * Image will be renamed after product is created
 */
router.post('/product-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Return the URL path to access the image from backend uploads
    const imageUrl = `/uploads/products/${req.file.filename}`;
    
    console.log('✅ Image uploaded:', {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: imageUrl
    });
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
});

/**
 * POST /api/upload/rename-image
 * Rename uploaded image after product is created
 * This creates unique filenames based on product ID
 */
router.post('/rename-image', (req, res) => {
  try {
    const { oldFilename, productId } = req.body;

    if (!oldFilename || !productId) {
      return res.status(400).json({
        success: false,
        message: 'oldFilename and productId are required'
      });
    }

    const uploadPath = path.join(__dirname, '../../uploads/products');
    const oldPath = path.join(uploadPath, oldFilename);
    
    // Check if old file exists
    if (!fs.existsSync(oldPath)) {
      return res.status(400).json({
        success: false,
        message: 'Original image file not found'
      });
    }

    // Get file extension
    const ext = path.extname(oldFilename);
    
    // Create new filename with product ID
    const newFilename = `product-${productId}${ext}`;
    const newPath = path.join(uploadPath, newFilename);

    // Rename the file
    fs.renameSync(oldPath, newPath);

    const imageUrl = `/uploads/products/${newFilename}`;

    console.log('✅ Image renamed:', {
      from: oldFilename,
      to: newFilename,
      productId: productId,
      url: imageUrl
    });

    res.json({
      success: true,
      message: 'Image renamed successfully',
      imageUrl: imageUrl,
      filename: newFilename
    });
  } catch (error) {
    console.error('Rename image error:', error);
    res.status(500).json({
      success: false,
      message: 'Error renaming image',
      error: error.message
    });
  }
});

// Configure storage for bank slips
const bankSlipStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/bank-slips');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const filename = `bankslip-${timestamp}-${random}${ext}`;
    console.log(`📤 Receiving bank slip upload: ${file.originalname} → ${filename}`);
    cb(null, filename);
  }
});

// File filter for bank slips - allow images and PDF
const bankSlipFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG, WebP and PDF are allowed.'), false);
  }
};

const bankSlipUpload = multer({
  storage: bankSlipStorage,
  fileFilter: bankSlipFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max for bank slips
  }
});

/**
 * POST /api/upload/bank-slip
 * Upload a bank slip image for payment verification
 */
router.post('/bank-slip', bankSlipUpload.single('bankSlip'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No bank slip file provided'
      });
    }

    const bankSlipUrl = `/uploads/bank-slips/${req.file.filename}`;
    
    console.log('✅ Bank slip uploaded:', {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: bankSlipUrl
    });
    
    res.json({
      success: true,
      message: 'Bank slip uploaded successfully',
      bankSlipUrl: bankSlipUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Bank slip upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading bank slip',
      error: error.message
    });
  }
});

// Error handling for multer
router.use((error, req, res, next) => {
  console.error('Upload middleware error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    if (error.code === 'LIMIT_PART_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many parts'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files'
      });
    }
  }
  
  // Handle file filter errors (invalid file type)
  if (error.message && error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Only JPEG, JPG, PNG and WebP are allowed.'
    });
  }
  
  res.status(500).json({
    success: false,
    message: error.message || 'File upload error',
    error: error.message
  });
});

module.exports = router;
