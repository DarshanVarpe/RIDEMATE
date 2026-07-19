const cloudinary = require('../config/cloudinary.connection.js');

 async function uploadImageToCloudinary(imageBuffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'Carpooling', quality: 'auto', fetch_format: 'auto' },
      (error, result) => {
        if (error) {
          console.error('Error uploading image to Cloudinary:', error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(imageBuffer);
  });
}
async function deleteImageFromCloudinary(secureUrl) {
    try {
        if (!secureUrl || typeof secureUrl !== 'string') return;
        
        // Extract public ID from secureUrl
        // Example: https://res.cloudinary.com/.../Carpooling/abc123def.jpg -> Carpooling/abc123def
        const parts = secureUrl.split('/');
        const filename = parts.pop().split('.')[0];
        const folder = parts.pop();
        const publicId = `${folder}/${filename}`;
        
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
    }
}

module.exports = { uploadImageToCloudinary, deleteImageFromCloudinary };