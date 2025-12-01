// src/components/course/CourseCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import type { CourseSummary } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CourseCardProps {
  course: CourseSummary;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Link href={`/?courseId=${course.id}`}>
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
          <CardTitle className="mt-2 text-base">{course.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 h-10 overflow-hidden">
            {course.description}
          </p>
          <div className="mt-4 flex justify-between items-center text-sm font-medium">
            <span>{course.regionName}</span>
            <span>{(course.estimatedCost || 0).toLocaleString()}원</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            By {course.creatorDisplayName}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
