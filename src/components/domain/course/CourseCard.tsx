
import Image from 'next/image';
import Link from 'next/link';
import type { CourseSummary } from '@/types/course';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface CourseCardProps {
  course: CourseSummary;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      <Link href={`/courses/${course.id}`} className="flex flex-col flex-grow">
        <CardHeader>
          <Image 
            src={course.coverImageUrl || '/images/default-course.png'} 
            alt={course.title} 
            width={500}
            height={300}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </CardHeader>
        <CardContent className="flex-grow">
          <CardTitle className="text-lg font-bold mb-2">{course.title}</CardTitle>
          <p className="text-sm text-gray-600 mb-2">{course.regionName}</p>
          <p className="text-sm text-gray-800 line-clamp-2">{course.summary}</p>
        </CardContent>
      </Link>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-600">
          <Heart className="w-4 h-4 mr-1 text-red-500" />
          <span>{course.likeCount}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
