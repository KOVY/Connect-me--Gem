import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Video } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTranslations } from '../hooks/useTranslations';
import { supabase } from '../src/lib/supabase';

interface StoryCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function StoryCreateModal({ isOpen, onClose, onSuccess }: StoryCreateModalProps) {
  const { user } = useUser();
  const { t } = useTranslations();
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      alert('Please select an image or video file');
      return;
    }

    // Validate file size (max 50MB for videos, 10MB for images)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File too large. Max size: ${isVideo ? '50MB' : '10MB'}`);
      return;
    }

    setMediaType(isImage ? 'image' : 'video');
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `stories/${fileName}`;

      const { data, error } = await supabase.storage
        .from('media') // Make sure this bucket exists in Supabase
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      setMediaUrl(publicUrl);
      setUploadProgress(100);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!mediaUrl || !user) return;

    setIsUploading(true);
    try {
      // Insert story into database
      const { error } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          media_url: mediaUrl,
          media_type: mediaType,
          caption: caption.trim() || null,
        });

      if (error) throw error;

      // Success!
      alert('Story created successfully! 🎉');
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error creating story:', error);
      alert('Failed to create story. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setCaption('');
    setMediaUrl('');
    setPreviewUrl(null);
    setUploadProgress(0);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 z-[60] animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold aurora-text">Create Story</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Upload Area */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-white">
                Upload Photo or Video
              </label>

              {!previewUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-pink-500 transition-colors bg-white/5"
                >
                  <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/70 mb-2">Click to upload</p>
                  <p className="text-sm text-white/50">
                    Images up to 10MB, Videos up to 50MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden bg-black">
                  {mediaType === 'image' ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      controls
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  )}
                  <button
                    onClick={() => {
                      setPreviewUrl(null);
                      setMediaUrl('');
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                  {mediaType === 'image' && (
                    <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/60 rounded-full flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-white" />
                      <span className="text-xs text-white">Image</span>
                    </div>
                  )}
                  {mediaType === 'video' && (
                    <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/60 rounded-full flex items-center gap-2">
                      <Video className="w-4 h-4 text-white" />
                      <span className="text-xs text-white">Video</span>
                    </div>
                  )}
                </div>
              )}

              {isUploading && uploadProgress < 100 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Alternative: URL Input */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-white">
                Or paste media URL
              </label>
              <input
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-white">
                Caption (optional)
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="What's on your mind?"
                maxLength={200}
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors resize-none"
              />
              <div className="text-xs text-white/50 mt-1 text-right">
                {caption.length}/200
              </div>
            </div>

            {/* Info */}
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <p className="text-sm text-white/80">
                📸 Your story will be visible for 24 hours
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-6 flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!mediaUrl || isUploading}
              className="flex-1 px-6 py-3 aurora-gradient rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-white"
            >
              {isUploading ? 'Creating...' : 'Share Story'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
