"use client";
import { Edit, required, SimpleForm, TextInput } from "react-admin";

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
