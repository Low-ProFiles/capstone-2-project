// src/app/[id]/edit/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import ImageUpload from "@/components/common/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getCategories, updateCourse } from "@/lib/api";
import { useAuth } from "@/store/auth-provider";
import { Label } from "@radix-ui/react-label";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useCourseStore } from "@/store/course.store";
import type { SpotReq, Category } from "@/types";
import { REGIONS_HIERARCHICAL } from "@/constants/regions-hierarchical";
import { TagInput } from "@/components/common/TagInput";

const AddSpotModal = dynamic(
  () => import("@/components/course/AddSpotModal"),
  {
    ssr: false,
  }
);

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const {
    courseDetails,
    loading,
    error,
    fetchCourseDetails,
    clearCourseDetails,
  } = useCourseStore();
  const { token, isAuthenticated } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>(
    undefined
  );
  const [spots, setSpots] = useState<SpotReq[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<SpotReq | null>(null);

  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [mainRegion, setMainRegion] = useState("");
  const [subRegion, setSubRegion] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      alert("코스를 수정하려면 로그인이 필요합니다.");
      router.push("/login");
      return;
    }
    if (courseId) {
      fetchCourseDetails(courseId);
    }
    const fetchInitialData = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories.filter(category => category.name !== '테마'));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchInitialData();
    return () => {
      clearCourseDetails();
    };
  }, [
    courseId,
    isAuthenticated,
    router,
    fetchCourseDetails,
    clearCourseDetails,
  ]);

  useEffect(() => {
    if (courseDetails) {
      setTitle(courseDetails.title);
      setDescription(courseDetails.description || "");
      setCoverImageUrl(courseDetails.coverImageUrl || undefined);
      setCategoryId(courseDetails.categoryId);
      setTags(courseDetails.tags || []);
      setSpots(
        courseDetails.spots.map((spot) => ({
          orderNo: spot.orderNo,
          title: spot.title,
          description: spot.description,
          lat: spot.lat,
          lng: spot.lng,
          images: spot.images,
          stayMinutes: spot.stayMinutes,
          price: spot.price,
        }))
      );

      // regionName to regionCode
      for (const main of REGIONS_HIERARCHICAL) {
        if (main.children) {
          for (const sub of main.children) {
            if (sub.name === courseDetails.regionName) {
              setMainRegion(main.code);
              setSubRegion(sub.code);
              return;
            }
          }
        } else {
          if (main.name === courseDetails.regionName) {
            setMainRegion(main.code);
            setSubRegion('');
            return;
          }
        }
      }
    }
  }, [courseDetails]);

  const subRegions = useMemo(() => {
    if (!mainRegion) return [];
    const selectedMainRegion = REGIONS_HIERARCHICAL.find(
      (r) => r.code === mainRegion
    );
    return selectedMainRegion?.children || [];
  }, [mainRegion]);

  useEffect(() => {
    if (courseDetails && courseDetails.categoryId && mainRegion !== courseDetails.categoryId.substring(0,2)) {
      setSubRegion("");
    }
  }, [mainRegion, courseDetails]);

  const handleSubmit = async () => {
    if (!isAuthenticated || !token) {
      alert("코스를 수정하려면 로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    try {
      const selectedSubRegion = subRegions.find(r => r.code === subRegion);
      const selectedMainRegion = REGIONS_HIERARCHICAL.find(r => r.code === mainRegion);

      let regionName = '';
      if(selectedSubRegion) {
        regionName = selectedSubRegion.name;
      } else if (selectedMainRegion) {
        regionName = selectedMainRegion.name;
      }

      const courseData = {
        title,
        description,
        coverImageUrl,
        spots,
        categoryId,
        tags,
        regionCode: subRegion || mainRegion,
        regionName: regionName
      };

      await updateCourse(courseId, courseData, token);
      alert("코스가 성공적으로 수정되었습니다!");
      router.push(`/`); // Redirect to home after edit
    } catch (err: unknown) {
      console.error("Failed to update course:", err);
      alert(`코스 수정에 실패했습니다: ${(err as Error).message}`);
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

  if (loading) return <div>코스 정보를 불러오는 중...</div>;
  if (error)
    return (
      <div className="text-red-500">
        코스 정보를 불러오는데 실패했습니다: {error}
      </div>
    );
  if (!courseDetails) return <div>코스를 찾을 수 없습니다.</div>;

  return (
    <div className="p-4 md:p-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">코스 수정하기</CardTitle>
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
              <Label htmlFor="category">카테고리</Label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  카테고리를 선택하세요
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search-main-region">시/도</Label>
                <select
                  id="search-main-region"
                  value={mainRegion}
                  onChange={(e) => setMainRegion(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">전체</option>
                  {REGIONS_HIERARCHICAL.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="search-sub-region">시/군/구</Label>
                <select
                  id="search-sub-region"
                  value={subRegion}
                  onChange={(e) => setSubRegion(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!mainRegion || subRegions.length === 0}
                >
                  <option value="">전체</option>
                  {subRegions.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">태그</Label>
              <TagInput tags={tags} setTags={setTags} />
            </div>

            <ImageUpload
              onUploadSuccess={setCoverImageUrl}
              currentImageUrl={coverImageUrl}
              label="코스 커버 이미지"
            />

            <div className="space-y-4">
              <Label>코스 장소</Label>
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
              코스 수정하기
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
