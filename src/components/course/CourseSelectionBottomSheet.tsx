import React from "react";
import { Course } from "@/lib/types";

interface CourseSelectionBottomSheetProps {
  courses: Course[];
  activeCourseId: string | null;
  setActiveCourseId: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const CourseSelectionBottomSheet: React.FC<CourseSelectionBottomSheetProps> = ({
  courses,
  activeCourseId,
  setActiveCourseId,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40" // Changed opacity to 30%
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-lg transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}`}
        style={{ maxHeight: "75vh" }} // Limit height to 75% of viewport height
      >
        <div className="relative h-full flex flex-col">
          {/* Handle for dragging/closing */}
          <div className="flex justify-center p-2">
            <div
              className="w-10 h-1 bg-gray-300 rounded-full cursor-pointer"
              onClick={onClose}
            ></div>
          </div>

          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-center text-2xl font-bold">코스 선택</h2>
          </div>

          {/* Course List */}
          <div className="flex-grow overflow-y-auto p-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className={`p-4 mb-3 rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                  activeCourseId === course.id
                    ? "bg-blue-50 border-blue-500 shadow-md"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
                onClick={() => {
                  setActiveCourseId(course.id);
                  onClose(); // Close sheet after selection
                }}
              >
                <h3 className="text-xl font-bold text-gray-800">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{course.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseSelectionBottomSheet;
