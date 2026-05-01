import {
  Edit,
  NumberInput,
  ReferenceInput,
  required,
  SimpleForm,
  TextInput,
} from "react-admin";

/**
 * Form component to edit an existing Unit record in the admin panel.
 * Client Component (Inherited from react-admin context)
 *
 * @returns A form populated with existing unit data for updating properties.
 *
 * @example
 * ```tsx
 * <UnitEdit />
 * ```
 */
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
