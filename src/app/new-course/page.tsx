"use client";

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { getCategories, CategoryDto } from "@/lib/api";
import { REGIONS, Region } from '@/constants/regions';

const AddSpotModal = dynamic(() => import('@/components/course/AddSpotModal'), {
  ssr: false,
});
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createCourse } from "@/lib/api";
import { useAuth } from "@/store/auth-provider";
import { Label } from "@radix-ui/react-label";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ImageUpload from '@/components/common/ImageUpload';

interface SpotReq {
  orderNo: number;
  title: string;
  description?: string;
  lat?: number;
  lng?: number;
  images?: string[];
  price?: number;
}

export default function NewCoursePage() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>(undefined);
  const [spots, setSpots] = useState<SpotReq[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<SpotReq | null>(null);
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          setSelectedCategory(fetchedCategories[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const totalEstimatedCost = useMemo(() => {
    return spots.reduce((total, spot) => total + (spot.price || 0), 0);
  }, [spots]);

  const handleSubmit = async () => {
    if (!isAuthenticated || !token) {
      alert("코스를 생성하려면 로그인이 필요합니다.");
      router.push("/login");
      return;
    }
    if (!selectedCategory) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    if (!selectedRegion) {
      alert("지역을 선택해주세요.");
      return;
    }

    try {
      const courseData = { 
        title, 
        summary, 
        categoryId: selectedCategory, 
        regionCode: selectedRegion.code,
        regionName: selectedRegion.name,
        estimatedCost: totalEstimatedCost,
        coverImageUrl, 
        spots 
      };
      await createCourse(courseData, token);
      alert("새로운 코스가 성공적으로 생성되었습니다!");
      router.push(`/`);
    } catch (error) {
      console.error("Failed to create course:", error);
      alert("코스 생성에 실패했습니다. 입력 내용을 확인해주세요.");
    }
  };

  const handleSaveSpot = (savedSpot: Omit<SpotReq, "orderNo">) => {
    if (editingSpot) {
      setSpots(spots.map(s => s.orderNo === editingSpot.orderNo ? { ...savedSpot, orderNo: editingSpot.orderNo } : s));
      setEditingSpot(null);
    } else {
      setSpots([...spots, { ...savedSpot, orderNo: spots.length + 1 }]);
    }
    setIsModalOpen(false);
  };

  const handleEditSpot = (spotToEdit: SpotReq) => {
    setEditingSpot(spotToEdit);
    setIsModalOpen(true);
  };

  const handleRemoveSpot = (orderNo: number) => {
    setSpots(
      spots
        .filter((spot) => spot.orderNo !== orderNo)
        .map((spot, index) => ({ ...spot, orderNo: index + 1 }))
    );
  };

  return (
    <div className="p-4 md:p-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">새로운 코스 만들기</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">코스 제목</Label>
              <Input id="title" placeholder="예: 홍대 감성 카페 투어" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <select id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="" disabled>카테고리 선택</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">지역</Label>
                <select id="region" value={selectedRegion?.code || ""} onChange={(e) => setSelectedRegion(REGIONS.find(r => r.code === e.target.value) || null)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="" disabled>지역 선택</option>
                  {REGIONS.map((region) => (
                    <option key={region.code} value={region.code}>{region.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">코스 설명</Label>
              <Textarea id="summary" placeholder="이 코스에 대한 설명을 입력해주세요." value={summary} onChange={(e) => setSummary(e.target.value)} rows={4} />
            </div>

            <ImageUpload onUploadSuccess={setCoverImageUrl} currentImageUrl={coverImageUrl} label="코스 커버 이미지" />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>코스 장소</Label>
                <div className="text-lg font-semibold">총 예상 비용: {totalEstimatedCost.toLocaleString()}원</div>
              </div>
              <div className="space-y-2">
                {spots.map((spot) => (
                  <div key={spot.orderNo} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-blue-600 mr-4">{spot.orderNo}</span>
                      <div>
                        <p className="font-semibold">{spot.title}</p>
                        <p className="text-sm text-gray-500">{spot.description}</p>
                        <p className="text-sm font-medium text-blue-600">예상 비용: {(spot.price || 0).toLocaleString()}원</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" type="button" onClick={() => handleEditSpot(spot)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" type="button" onClick={() => handleRemoveSpot(spot.orderNo)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" className="w-full flex items-center" onClick={() => { setEditingSpot(null); setIsModalOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                장소 추가
              </Button>
            </div>

            <Button type="button" className="w-full" onClick={handleSubmit}>코스 생성하기</Button>
          </form>
        </CardContent>
      </Card>

      <AddSpotModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveSpot} orderNo={editingSpot ? editingSpot.orderNo : spots.length + 1} editingSpot={editingSpot} />
    </div>
  );
}
