import {
  Create,
  NumberInput,
  ReferenceInput,
  required,
  SimpleForm,
  TextInput,
} from "react-admin";

export const UnitCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput label="Title" source="title" validate={required()} />
        <TextInput
          label="Description"
          source="description"
          validate={required()}
        />
        <ReferenceInput label="Course" reference="courses" source="courseId" />
        <NumberInput label="Order" source="order" validate={required()} />
      </SimpleForm>
    </Create>
  );
};
