"use client";

import dynamic from 'next/dynamic';

const NewCourseClientPage = dynamic(
  () => import('./NewCourseClientPage'),
  { ssr: false }
);

const NewCoursePage = () => {
  return <NewCourseClientPage />;
};

export default NewCoursePage;
