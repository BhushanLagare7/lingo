"use client";
import { Create, required, SimpleForm, TextInput } from "react-admin";

/**
 * Form component to create a new Course record in the admin panel.
 * Client Component
 *
 * @returns A form with inputs for course title and image source.
 *
 * @example
 * ```tsx
 * <CourseCreate />
 * ```
 */
export const CourseCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput label="Title" source="title" validate={required()} />
        <TextInput label="Image" source="imageSrc" validate={required()} />
      </SimpleForm>
    </Create>
  );
};
