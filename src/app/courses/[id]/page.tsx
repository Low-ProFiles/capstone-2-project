'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getCourseById } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Flag } from 'lucide-react';

export default function CourseDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourseById(id),
    enabled: !!id, // only run query if id is available
  });

  if (isLoading) return <div className="p-4">Loading course details...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;
  if (!course) return <div className="p-4">Course not found.</div>;

  return (
    <div className="p-4 md:p-6">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{course.title}</CardTitle>
          <CardDescription>Created by: {course.authorNickname}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Placeholder for map or image */}
          <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <p>Map/Image Placeholder</p>
          </div>
          
          <p className="text-gray-700 whitespace-pre-wrap">
            {course.description}
          </p>

          {/* TODO: Display course spots */}

        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Button variant="outline">
              <Heart className="mr-2 h-4 w-4" /> Like ({course.likeCount || 0})
            </Button>
            <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600">
              <Flag className="mr-2 h-4 w-4" /> Report
            </Button>
          </div>
          {/* TODO: Add edit/delete buttons if user is author */}
        </CardFooter>
      </Card>
    </div>
  );
}
