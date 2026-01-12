# Image Upload Debugging Guide

## How the Image Upload Process Works

### 1. **File Selection & Validation (Frontend)**
- User selects image from their Downloads folder
- File type is checked: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`
- File size is checked: max 5MB
- Image preview is shown

### 2. **File Upload to Server**
- FormData created with file
- Sent to: `POST /api/upload/product-image`
- Server saves to: `/uploads/products/` folder
- Filename: `temp-{timestamp}-{random}.{ext}`
- Returns: imageUrl path to frontend

### 3. **Create Product**
- Product created with temporary imageUrl
- Server returns productId
- Image is then renamed to use productId

### 4. **Image Rename (After Product Creation)**
- Original filename: `temp-1234567890-9876543210.jpg`
- New filename: `product-{productId}.jpg`
- Update product with new imageUrl

## Debugging Steps

### Step 1: Check Browser Console (F12)
Open DevTools and go to **Console** tab. When you upload an image, you should see:

```
📤 File selected: {
  name: "iphone.jpg",
  size: 2097152,
  type: "image/jpeg",
  sizeInMB: "2.00"
}

🚀 Starting upload to /api/upload/product-image
📦 FormData contents: {...}
🔑 Token available: true

✅ Image upload response received: 200
📎 Server response: {
  success: true,
  imageUrl: "/uploads/products/temp-1704796800000-123456789.jpg",
  filename: "temp-1704796800000-123456789.jpg"
}

💾 Image URL stored (temporary): /uploads/products/temp-...jpg
```

**If you see errors:**
```
❌ Invalid file type: application/octet-stream
❌ File too large: 6.50MB
❌ Upload error occurred
```

### Step 2: Check Network Tab (F12)
1. Go to **Network** tab
2. Select image and upload
3. Find POST request to `/api/upload/product-image`
4. Check:
   - **Status:** Should be 200 (success) or 4xx/5xx (error)
   - **Request Headers:** Should have `Authorization: Bearer {token}`
   - **Request Body:** Should be multipart/form-data with file
   - **Response:** Should show success:true and imageUrl

### Step 3: Check Backend Logs
Backend should print:
```
📤 Receiving upload: iphone.jpg → temp-1704796800000-123456789.jpg
✅ Image uploaded: {
  filename: "temp-1704796800000-123456789.jpg",
  originalName: "iphone.jpg",
  size: 2097152,
  path: "/uploads/products/temp-..."
}
```

**If upload fails:**
```
Upload middleware error: Error: Invalid file type
❌ Error uploading image
```

### Step 4: Test File Formats
Try uploading different file formats from Downloads:

| Format | Status | Notes |
|--------|--------|-------|
| `.jpg` | ✅ Works | Most common |
| `.jpeg` | ✅ Works | Same as jpg |
| `.png` | ✅ Works | Supports transparency |
| `.webp` | ✅ Works | Modern format |
| `.gif` | ❌ Fails | Not supported |
| `.bmp` | ❌ Fails | Not supported |
| `.webm` | ❌ Fails | Video format |

### Step 5: Test File Sizes
Try uploading files of different sizes:

| Size | Status | Notes |
|------|--------|-------|
| < 1MB | ✅ Works | Fast upload |
| 1-5MB | ✅ Works | Normal upload |
| > 5MB | ❌ Fails | Max limit exceeded |

### Step 6: Check Uploads Folder
Backend uploads should be saved at:
```
c:\Users\User\Desktop\KSP2\KSP_Website\KSP\backend\uploads\products\
```

Check if folder exists and contains files like:
```
temp-1704796800000-123456789.jpg
product-507f1f77bcf86cd799439011.jpg
```

### Step 7: Test Complete Flow

1. **Ensure both servers are running:**
   ```powershell
   # Terminal 1 - Backend
   cd "c:\Users\User\Desktop\KSP2\KSP_Website\KSP\backend"
   npm start
   # Should show: 🚀 Server running on http://localhost:5000
   
   # Terminal 2 - Frontend  
   cd "c:\Users\User\Desktop\KSP2\KSP_Website\KSP\frontend"
   npm start
   # Should show: webpack compiled on http://localhost:3000
   ```

2. **Go to Admin Dashboard:**
   - Login as admin@ksp.com / admin123
   - Click "Add New Product"

3. **Select Image from Downloads:**
   - Click the image upload area
   - Navigate to Downloads folder
   - Select an image (e.g., any .jpg or .png file)
   - Open it

4. **Watch Console:**
   - Open F12 → Console
   - You should see upload logs
   - Check for errors

5. **Fill Form & Add Product:**
   - Fill in Name, Brand, Price, etc.
   - Click "Add Product"
   - Watch console for product creation logs

## Common Issues & Solutions

### Issue 1: "Invalid file type"
**Problem:** Image shows as `application/octet-stream` type

**Solution:**
- Some files might not have proper MIME type detection
- Try uploading from a different location
- Ensure file has proper extension (.jpg, .png, etc.)
- Try a different image file

**Check:** 
```javascript
// In browser console
const file = document.querySelector('input[type="file"]').files[0];
console.log(file.type); // Should show image/jpeg, image/png, etc.
```

### Issue 2: "File too large" when file is < 5MB
**Problem:** File rejected as too large

**Solution:**
- Check actual file size vs reported size
- Try a smaller file
- Ensure file isn't corrupted

**Check:**
```javascript
// In browser console
const file = document.querySelector('input[type="file"]').files[0];
console.log(file.size / (1024 * 1024) + ' MB');
```

### Issue 3: "No image file provided" on backend
**Problem:** Backend receives request but no file

**Solution:**
- Check `Content-Type: multipart/form-data` header
- Verify FormData is created correctly
- Ensure file input `name` attribute matches backend expectation (should be "image")

### Issue 4: Token not found / 401 Unauthorized
**Problem:** Image upload fails with 401

**Solution:**
- Make sure you're logged in
- Check localStorage for authToken:
  ```javascript
  // In browser console
  console.log(localStorage.getItem('authToken'));
  ```
- If empty, login again

### Issue 5: Image not appearing in preview
**Problem:** File selected but preview doesn't show

**Solution:**
- Check console for FileReader errors
- File might be corrupted
- Try a different image file

## File Upload Technical Details

### Frontend → Backend
```
POST /api/upload/product-image
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body:
  image: [File object from input]
```

### Backend Processing
```javascript
multer.diskStorage({
  destination: '/uploads/products',
  filename: 'temp-{timestamp}-{random}.{ext}'
})

fileFilter: Only allow image/jpeg, image/jpg, image/png, image/webp
limits: Max 5MB
```

### Response
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "imageUrl": "/uploads/products/temp-1704796800000-123456789.jpg",
  "filename": "temp-1704796800000-123456789.jpg"
}
```

### After Product Creation - Rename
```
POST /api/upload/rename-image
Body:
{
  "oldFilename": "temp-1704796800000-123456789.jpg",
  "productId": "507f1f77bcf86cd799439011"
}

Response:
{
  "success": true,
  "imageUrl": "/uploads/products/product-507f1f77bcf86cd799439011.jpg",
  "filename": "product-507f1f77bcf86cd799439011.jpg"
}
```

## Quick Test Commands

### Test if backend is running:
```powershell
curl http://localhost:5000/health
```

### Test upload endpoint:
```powershell
# Windows PowerShell
$token = "your_jwt_token"
$file = "C:\path\to\image.jpg"

curl -X POST "http://localhost:5000/api/upload/product-image" `
  -H "Authorization: Bearer $token" `
  -F "image=@$file"
```

### Check uploaded files:
```powershell
Get-ChildItem "C:\Users\User\Desktop\KSP2\KSP_Website\KSP\backend\uploads\products\"
```

## Summary

**Working Flow:**
1. ✅ Select image from Downloads
2. ✅ File validation (type, size)
3. ✅ Preview generated
4. ✅ Upload to /api/upload/product-image
5. ✅ Receive temporary imageUrl
6. ✅ Create product
7. ✅ Rename image with product ID
8. ✅ Update product with new imageUrl
9. ✅ Product appears in list with image

If any step fails, console will show detailed error message!
