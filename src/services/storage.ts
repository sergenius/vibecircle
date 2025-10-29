import { supabase } from '../lib/supabase';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class StorageService {
  /**
   * Upload a vibe video to Supabase Storage
   */
  async uploadVibeVideo(
    file: Blob,
    userId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `${userId}/${timestamp}-vibe.mp4`;

      // Convert blob to File for upload
      const uploadFile = new File([file], fileName, { type: 'video/mp4' });

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('vibe-videos')
        .upload(fileName, uploadFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'video/mp4',
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('vibe-videos')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading vibe video:', error);
      throw error;
    }
  }

  /**
   * Upload a user avatar to Supabase Storage
   */
  async uploadAvatar(
    file: Blob,
    userId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    try {
      const fileName = `${userId}/avatar-${Date.now()}.jpg`;

      const uploadFile = new File([file], fileName, { type: 'image/jpeg' });

      const { data, error } = await supabase.storage
        .from('user-avatars')
        .upload(fileName, uploadFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/jpeg',
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }

  /**
   * Upload a circle cover image to Supabase Storage
   */
  async uploadCircleCover(
    file: Blob,
    circleId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    try {
      const fileName = `${circleId}/cover-${Date.now()}.jpg`;

      const uploadFile = new File([file], fileName, { type: 'image/jpeg' });

      const { data, error } = await supabase.storage
        .from('circle-covers')
        .upload(fileName, uploadFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/jpeg',
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('circle-covers')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading circle cover:', error);
      throw error;
    }
  }

  /**
   * Upload an event photo to Supabase Storage
   */
  async uploadEventPhoto(
    file: Blob,
    eventId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    try {
      const fileName = `${eventId}/${Date.now()}-event.jpg`;

      const uploadFile = new File([file], fileName, { type: 'image/jpeg' });

      const { data, error } = await supabase.storage
        .from('event-photos')
        .upload(fileName, uploadFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg',
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('event-photos')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading event photo:', error);
      throw error;
    }
  }

  /**
   * Delete a file from Supabase Storage
   */
  async deleteFile(bucket: string, filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting file from ${bucket}:`, error);
      throw error;
    }
  }

  /**
   * Get a signed URL for a private file
   */
  async getSignedUrl(bucket: string, filePath: string, expiresIn = 3600): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn);

      if (error) throw error;

      return data.signedUrl;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();
