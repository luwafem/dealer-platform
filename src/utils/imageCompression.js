import imageCompression from 'browser-image-compression';

// Compress image before upload (max 500KB)
export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.5, // 500KB
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Image compression error:', error);
    throw error;
  }
};

// Convert file to base64 (for previews)
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Validate image file type and size
export const validateImage = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, and WEBP images are allowed');
  }
  if (file.size > 5 * 1024 * 1024) {
    // 5MB initial max before compression
    throw new Error('Image size must be less than 5MB');
  }
  return true;
};