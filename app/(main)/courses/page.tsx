import { getCourses, getUserProgress } from "@/db/queries";

import { List } from "./list";

/**
 * Renders the Courses page displaying all available language courses.
 * Server Component
 *
 * @returns The courses page UI containing a title and the List component of available courses, along with the user's active course ID.
 *
 * @example
 * ```tsx
 * <CoursesPage />
 * ```
 */
const CoursesPage = async () => {
  const coursesPromise = getCourses();
  const userProgressPromise = getUserProgress();

  const [courses, userProgress] = await Promise.all([
    coursesPromise,
    userProgressPromise,
  ]);

  return (
    <div className="h-full max-w-228 px-3 mx-auto">
      <h1 className="text-2xl font-bold text-neutral-700">Language Courses</h1>
      <List activeCourseId={userProgress?.activeCourseId} courses={courses} />
    </div>
  );
};

export default CoursesPage;
