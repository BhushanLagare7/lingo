import {
  Edit,
  NumberInput,
  ReferenceInput,
  required,
  SimpleForm,
  TextInput,
} from "react-admin";

export const LessonEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput label="Title" source="title" validate={[required()]} />
        <ReferenceInput reference="units" source="unitId" />
        <NumberInput label="Order" source="order" validate={[required()]} />
      </SimpleForm>
    </Edit>
  );
};
