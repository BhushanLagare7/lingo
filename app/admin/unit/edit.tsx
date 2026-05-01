import {
  Edit,
  NumberInput,
  ReferenceInput,
  required,
  SimpleForm,
  TextInput,
} from "react-admin";

export const UnitEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <NumberInput label="Id" source="id" validate={required()} />
        <TextInput label="Title" source="title" validate={required()} />
        <TextInput
          label="Description"
          source="description"
          validate={required()}
        />
        <ReferenceInput label="Course" reference="courses" source="courseId" />
        <NumberInput label="Order" source="order" validate={required()} />
      </SimpleForm>
    </Edit>
  );
};
