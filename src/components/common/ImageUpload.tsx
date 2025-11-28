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
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // Clean up previous preview URL
    }
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("업로드할 파일을 선택해주세요.");
      return;
    }
    if (!token) {
      setError("로그인이 필요합니다.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await uploadFile(formData, token); // Assuming uploadFile returns { url: string }
      onUploadSuccess(result.url);
      setFile(null); // Clear selected file after successful upload
    } catch (err: unknown) {
      setError(`파일 업로드 실패: ${(err as Error).message}`);
    } finally {
      setLoading(false);
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
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          className="flex-grow"
        >
          <UploadCloud className="h-4 w-4 mr-2" />
          {file ? file.name : (currentImageUrl ? "이미지 변경" : "파일 선택")}
        </Button>
        <Button 
          type="button" 
          onClick={handleUpload} 
          disabled={!file || loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "업로드"}
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {(currentImageUrl || previewUrl) && (
        <div className="mt-2 space-y-2">
          {currentImageUrl && !previewUrl && (
            <div>
              <p className="text-sm text-gray-500">현재 이미지:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentImageUrl} alt="Current" className="w-24 h-24 object-cover rounded-md mt-1" />
            </div>
          )}
          {previewUrl && (
            <div>
              <p className="text-sm text-gray-500">새 이미지 미리보기:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Preview" className="w-24 h-24 object-cover rounded-md mt-1" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
