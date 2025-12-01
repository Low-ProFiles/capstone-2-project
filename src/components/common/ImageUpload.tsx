// src/components/common/ImageUpload.tsx
"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Import Label
import { uploadFile } from '@/lib/api'; // Assuming uploadFile API exists
import { useAuth } from '@/store/auth-provider';
import { Loader2, UploadCloud } from 'lucide-react';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  currentImageUrl?: string;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess, currentImageUrl, label = "이미지 업로드" }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // Clean up previous preview URL
    }
    
    const file = event.target.files && event.target.files[0];
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    
    if (!token) {
      setError("로그인이 필요합니다.");
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await uploadFile(formData, token);
      onUploadSuccess(result.url);
    } catch (err: unknown) {
      setError(`파일 업로드 실패: ${(err as Error).message}`);
      // Clear preview if upload fails
      if(previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } finally {
      setLoading(false);
      // Clear the file input so the same file can be selected again
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload">{label}</Label>
      <div className="flex items-center space-x-2">
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden" // Hide default input
          disabled={loading}
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          className="flex-grow"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <UploadCloud className="h-4 w-4 mr-2" />
          )}
          {loading ? "업로드 중..." : (currentImageUrl || previewUrl ? "이미지 변경" : "파일 선택")}
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {(currentImageUrl || previewUrl) && (
        <div className="mt-2 space-y-2">
          {previewUrl ? (
             <div>
              <p className="text-sm text-gray-500">새 이미지 미리보기:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Preview" className="w-24 h-24 object-cover rounded-md mt-1" />
            </div>
          ) : currentImageUrl && (
            <div>
              <p className="text-sm text-gray-500">현재 이미지:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentImageUrl} alt="Current" className="w-24 h-24 object-cover rounded-md mt-1" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
