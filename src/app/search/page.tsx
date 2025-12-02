// src/app/search/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { getCourses } from "@/lib/api";
import type { CourseSummary } from "@/types";
import { REGIONS_HIERARCHICAL } from "@/constants/regions-hierarchical";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CategoryFilter from "@/components/common/CategoryFilter";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [mainRegion, setMainRegion] = useState("");
  const [subRegion, setSubRegion] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [maxCost, setMaxCost] = useState<number | "">("");

  const [results, setResults] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const subRegions = useMemo(() => {
    if (!mainRegion) return [];
    const selectedMainRegion = REGIONS_HIERARCHICAL.find(
      (r) => r.code === mainRegion
    );
    return selectedMainRegion?.children || [];
  }, [mainRegion]);

  useEffect(() => {
    setSubRegion("");
  }, [mainRegion]);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = {
        q: q || undefined,
        region: subRegion || mainRegion || undefined,
        categoryId: categoryId || undefined,
        maxCost: maxCost !== "" ? Number(maxCost) : undefined,
      };
      const searchResults = await getCourses(params);
      setResults(searchResults.content);
    } catch (error) {
      console.error("Failed to search courses:", error);
      alert("코스 검색에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (newCategoryId: string | null) => {
    setCategoryId(newCategoryId);
  };

  return (
    <div className="p-4 md:p-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Search className="mr-2 h-6 w-6" />
            코스 검색
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>카테고리</Label>
            <CategoryFilter
              onSelectCategory={handleSelectCategory}
              selectedCategoryId={categoryId}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search-query">키워드</Label>
              <Input
                id="search-query"
                placeholder="제목, 내용 등"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="search-max-cost">최대 예산 (원)</Label>
              <Input
                id="search-max-cost"
                type="number"
                placeholder="예: 50000"
                value={maxCost}
                onChange={(e) =>
                  setMaxCost(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
            </div>
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
          <Button onClick={handleSearch} className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            검색하기
          </Button>
        </CardContent>
      </Card>

      {searched && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            검색 결과 ({results.length}개)
          </h2>
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((course) => (
                <Link key={course.id} href={`/${course.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      {course.coverImageUrl && (
                        <div className="relative w-full h-32">
                          <Image
                            src={course.coverImageUrl}
                            alt={course.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-t-lg"
                          />
                        </div>
                      )}
                      <CardTitle className="mt-2">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 h-10 overflow-hidden">
                        {course.description}
                      </p>
                      <div className="mt-4 flex justify-between items-center text-sm font-medium">
                        <span>{course.regionName}</span>
                        <span>
                          {(course.estimatedCost || 0).toLocaleString()}원
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              검색 결과가 없습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
