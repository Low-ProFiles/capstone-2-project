"use client";

import dynamic from 'next/dynamic';

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
import { useState } from "react";

// Define SpotReq type based on backend DTO
interface SpotReq {
  orderNo: number;
  title: string;
  description?: string;
  lat?: number;
  lng?: number;
  // Add other fields as needed
}

export default function NewCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [spots, setSpots] = useState<SpotReq[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!isAuthenticated || !token) {
      alert("코스를 생성하려면 로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    try {
      const courseData = { title, description, spots };
      await createCourse(courseData, token);
      alert("새로운 코스가 성공적으로 생성되었습니다!");
      router.push(`/`);
    } catch (error) {
      console.error("Failed to create course:", error);
      alert("코스 생성에 실패했습니다. 입력 내용을 확인해주세요.");
    }
  };

  const handleSaveSpot = (newSpot: Omit<SpotReq, "orderNo">) => {
    setSpots([...spots, { ...newSpot, orderNo: spots.length + 1 }]);
    setIsModalOpen(false);
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
            {/* ... form fields for title and description ... */}
            <div className="space-y-2">
              <Label htmlFor="title">코스 제목</Label>
              <Input
                id="title"
                placeholder="예: 홍대 감성 카페 투어"
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
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
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
                onClick={() => setIsModalOpen(true)}
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
        orderNo={spots.length + 1}
      />
    </div>
  );
}
