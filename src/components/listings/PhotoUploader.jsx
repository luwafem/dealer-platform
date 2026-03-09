import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { compressImage, validateImage, fileToBase64 } from '../../utils/imageCompression';
import { storageService } from '../../services/storageService';
import toast from 'react-hot-toast';

const PhotoUploader = ({ dealerId, onUploadComplete, maxPhotos = 20 }) => {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > maxPhotos) {
      toast.error(`You can only upload up to ${maxPhotos} photos`);
      return;
    }

    setUploading(true);
    const newPhotos = [];

    for (const file of files) {
      try {
        // Validate file
        validateImage(file);

        // Compress image
        const compressed = await compressImage(file);

        // Generate preview
        const preview = await fileToBase64(compressed);

        // Upload to Supabase Storage
        const photoUrl = await storageService.uploadPhoto(compressed, dealerId);

        newPhotos.push({
          file: compressed,
          preview,
          url: photoUrl,
          name: compressed.name,
        });
      } catch (error) {
        toast.error(`Error uploading ${file.name}: ${error.message}`);
      }
    }

    setPhotos(prev => [...prev, ...newPhotos]);
    onUploadComplete?.(newPhotos.map(p => p.url));
    setUploading(false);
  }, [photos.length, maxPhotos, dealerId, onUploadComplete]);

  const removePhoto = useCallback((index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    // Optionally delete from storage
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
        {photos.map((photo, index) => (
          <div key={index} className="relative aspect-square border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <img src={photo.preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute top-1 right-1 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-1"
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        ))}
        {photos.length < maxPhotos && (
          <label className="aspect-square border-2 border-black border-dashed bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-yellow-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Upload size={24} strokeWidth={2} className="text-black" />
            <span className="text-xs font-bold uppercase mt-1">Upload</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>
      {uploading && (
        <div className="text-sm font-bold">
          Uploading...
        </div>
      )}
      <p className="text-xs font-bold">
        Max {maxPhotos} photos, 500KB each after compression. JPEG, PNG, WEBP.
      </p>
    </div>
  );
};

export default PhotoUploader;