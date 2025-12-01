"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { getCategories } from "@/lib/api";
import type { Category } from "@/types";
import {
  REGIONS_HIERARCHICAL,
} from "@/constants/regions-hierarchical";
import type { SpotReq } from "@/types/course";

const AddSpotModal = dynamic(() => import("@/components/course/AddSpotModal"), {
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
import ImageUpload from "@/components/common/ImageUpload";
import { TagInput } from "@/components/common/TagInput";

export default function NewCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>(
    undefined
  );
  const [spots, setSpots] = useState<SpotReq[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<SpotReq | null>(null);
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedParentRegionCode, setSelectedParentRegionCode] =
    useState<string>("");
  const [selectedChildRegionCode, setSelectedChildRegionCode] =
    useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        const filteredCategories = fetchedCategories.filter(category => category.name !== '테마');
        setCategories(filteredCategories);
        setSelectedCategory(""); // Do not auto-select a category

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

    const parentRegion = REGIONS_HIERARCHICAL.find(
      (r) => r.code === selectedParentRegionCode
    );
    const childRegion = parentRegion?.children?.find(
      (c) => c.code === selectedChildRegionCode
    );

    // --- Start Validation ---
    if (!title.trim()) {
      alert("코스 제목을 입력해주세요.");
      return;
    }
    if (!description.trim()) {
      alert("코스 설명을 입력해주세요.");
      return;
    }
    if (!selectedCategory) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    if (!parentRegion) {
      alert("시/도 지역을 선택해주세요.");
      return;
    }
    // "시까지는 필수로 입력" 규칙 적용: 부모 지역이 자식 지역을 가지고 있다면, 자식 지역은 반드시 선택되어야 함
    if (parentRegion.children && parentRegion.children.length > 0 && !childRegion) {
      alert("세부 지역(시/군/구)을 선택해주세요.");
      return;
    }
    if (!coverImageUrl) {
      alert("대표 이미지를 업로드해주세요.");
      return;
    }
    if (spots.length < 2) {
      alert("코스는 최소 2개 이상의 스팟을 포함해야 합니다.");
      return;
    }

    for (const spot of spots) {
      if (!spot.title?.trim()) {
        alert(`스팟 #${spot.orderNo}의 제목을 입력해주세요.`);
        return;
      }
      if (spot.price == null || spot.price < 0) {
        alert(`스팟 #${spot.orderNo}의 예상 비용을 0 이상으로 입력해주세요.`);
        return;
      }
      if (spot.stayMinutes == null || spot.stayMinutes < 0) {
        alert(`스팟 #${spot.orderNo}의 예상 체류 시간을 0분 이상으로 입력해주세요.`);
        return;
      }
    }
    // --- End Validation ---

    // 최종적으로 제출할 지역 정보. 자식 지역이 있으면 자식 지역을, 없으면 부모 지역을 사용
    const finalRegion = childRegion || parentRegion;

    try {
      const courseData = {
        title,
        description,
        categoryId: selectedCategory,
        regionCode: finalRegion.code,
        regionName: finalRegion.name,
        tags,
        coverImageUrl,
        spots,
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
      setSpots(
        spots.map((s) =>
          s.orderNo === editingSpot.orderNo
            ? { ...savedSpot, orderNo: editingSpot.orderNo }
            : s
        )
      );
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
              <Input
                id="title"
                placeholder="예: 공강 시간 보내기 좋은 코스"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>
                    카테고리 선택
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent-region">지역 (시/도)</Label>
                <select
                  id="parent-region"
                  value={selectedParentRegionCode}
                  onChange={(e) => {
                    setSelectedParentRegionCode(e.target.value);
                    setSelectedChildRegionCode(""); // 시/도 변경 시 자식 지역 초기화
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>
                    시/도 선택
                  </option>
                  {REGIONS_HIERARCHICAL.map((region) => (
                    <option key={region.code} value={region.code}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="child-region">세부 지역 (시/군/구)</Label>
                <select
                  id="child-region"
                  value={selectedChildRegionCode}
                  onChange={(e) => setSelectedChildRegionCode(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={
                    !selectedParentRegionCode ||
                    (REGIONS_HIERARCHICAL.find(
                      (r) => r.code === selectedParentRegionCode
                    )?.children?.length || 0) === 0
                  }
                  required={
                    (REGIONS_HIERARCHICAL.find(
                      (r) => r.code === selectedParentRegionCode
                    )?.children?.length || 0) > 0
                  }
                >
                  <option value="" disabled>
                    세부 지역 선택
                  </option>
                  {REGIONS_HIERARCHICAL.find(
                    (r) => r.code === selectedParentRegionCode
                  )?.children?.map((child) => (
                    <option key={child.code} value={child.code}>
                      {child.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">코스 설명</Label>
              <Textarea
                id="description"
                placeholder="이 코스에 대한 설명을 입력해주세요."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">태그</Label>
              <TagInput
                id="tags"
                placeholder="태그를 입력하세요"
                tags={tags}
                setTags={setTags}
              />
            </div>

            <ImageUpload
              onUploadSuccess={setCoverImageUrl}
              currentImageUrl={coverImageUrl}
              label="코스 커버 이미지"
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>코스 장소</Label>
                <div className="text-lg font-semibold">
                  총 예상 비용: {totalEstimatedCost.toLocaleString()}원
                </div>
              </div>
              <div className="space-y-2">
                {spots.map((spot) => (
                  <div
                    key={spot.orderNo}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-blue-600 mr-4">
                        {spot.orderNo}
                      </span>
                      <div>
                        <p className="font-semibold">{spot.title}</p>
                        <p className="text-sm text-gray-500">
                          {spot.description}
                        </p>
                        <p className="text-sm font-medium text-blue-600">
                          예상 비용: {(spot.price || 0).toLocaleString()}원
                        </p>
                        <p className="text-sm font-medium text-green-600">
                          예상 소요 시간: {spot.stayMinutes || 0}분
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => handleEditSpot(spot)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => handleRemoveSpot(spot.orderNo)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center"
                onClick={() => {
                  setEditingSpot(null);
                  setIsModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                장소 추가
              </Button>
            </div>

            <Button type="button" className="w-full" onClick={handleSubmit}>
              코스 생성하기
            </Button>
          </form>
        </CardContent>
      </Card>

      <AddSpotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSpot}
        orderNo={editingSpot ? editingSpot.orderNo : spots.length + 1}
        editingSpot={editingSpot}
      />
    </div>
  );
}
