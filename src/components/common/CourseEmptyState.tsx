// src/components/common/CourseEmptyState.tsx
"use client";

import { Map } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const CourseEmptyState = () => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
      <div className="text-center p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
        <Map className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-3 text-lg font-semibold text-gray-800">
          아직 등록된 코스가 없어요.
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          가장 먼저 멋진 코스를 등록해보세요!
        </p>
        <div className="mt-4">
          <Link href="/new-course">
            <Button>새 코스 만들기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
