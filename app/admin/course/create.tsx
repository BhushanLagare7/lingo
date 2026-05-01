"use client";
import { Create, required, SimpleForm, TextInput } from "react-admin";

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
