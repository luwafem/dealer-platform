import { supabase } from '../lib/supabase';

export const storageService = {
  // Upload a photo to Supabase Storage
  async uploadPhoto(file, dealerId) {
    const fileName = `${dealerId}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('listing-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('listing-photos')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  },

  async uploadAvatar(file, dealerId) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${dealerId}/${Date.now()}.${fileExt}`; // path inside bucket
  const { error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { cacheControl: '3600', upsert: true });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return publicUrl;
},

  async uploadDocument(file, dealerId) {
  const fileName = `documents/${dealerId}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('verification-docs')
    .upload(fileName, file, { cacheControl: '3600' });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('verification-docs')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
},

  // Delete a photo
  async deletePhoto(photoUrl) {
    // Extract path from URL (implement based on your URL structure)
    const path = photoUrl.split('/').slice(-2).join('/'); // e.g., "dealerId/filename"
    const { error } = await supabase.storage
      .from('listing-photos')
      .remove([path]);

    if (error) throw error;
    return true;
  },
};