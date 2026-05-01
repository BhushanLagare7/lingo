"use client";
import { Edit, required, SimpleForm, TextInput } from "react-admin";

/**
 * Form component to edit an existing Course record in the admin panel.
 * Client Component
 *
 * @returns A form populated with existing course data for updating title and image source.
 *
 * @example
 * ```tsx
 * <CourseEdit />
 * ```
 */
export const CourseEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput label="Id" source="id" validate={required()} />
        <TextInput label="Title" source="title" validate={required()} />
        <TextInput label="Image" source="imageSrc" validate={required()} />
      </SimpleForm>
    </Edit>
  );
};
