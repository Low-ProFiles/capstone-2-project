// src/app/search/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { getCourses, getCategories, CategoryDto, CourseSummary } from '@/lib/api';
import { REGIONS, Region } from '@/constants/regions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [region, setRegion] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [maxCost, setMaxCost] = useState<number | ''>('');
  
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [results, setResults] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchInitialData();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = {
        q: q || undefined,
        region: region || undefined,
        categoryId: categoryId || undefined,
        maxCost: maxCost ? Number(maxCost) : undefined,
      };
      const searchResults = await getCourses(params);
      setResults(searchResults);
    } catch (error) {
      console.error("Failed to search courses:", error);
      alert("코스 검색에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Search className="mr-2 h-6 w-6" />
            코스 검색
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search-query">키워드</Label>
              <Input id="search-query" placeholder="제목, 내용 등" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="search-region">지역</Label>
              <select id="search-region" value={region} onChange={(e) => setRegion(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">모든 지역</option>
                {REGIONS.map((r) => (
                  <option key={r.code} value={r.code}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="search-category">카테고리</Label>
              <select id="search-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">모든 카테고리</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="search-max-cost">최대 예산 (원)</Label>
              <Input id="search-max-cost" type="number" placeholder="예: 50000" value={maxCost} onChange={(e) => setMaxCost(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
          </div>
          <Button onClick={handleSearch} className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            검색하기
          </Button>
        </CardContent>
      </Card>

      {searched && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">검색 결과 ({results.length}개)</h2>
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`} legacyBehavior>
                  <a className="block">
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        {course.coverImageUrl && <img src={course.coverImageUrl} alt={course.title} className="w-full h-32 object-cover rounded-t-lg" />}
                        <CardTitle className="mt-2">{course.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{course.summary}</p>
                        <div className="mt-4 flex justify-between items-center text-sm font-medium">
                          <span>{course.regionName}</span>
                          <span>{(course.estimatedCost || 0).toLocaleString()}원</span>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">검색 결과가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}
