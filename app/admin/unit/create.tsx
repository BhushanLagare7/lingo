import {
  Create,
  NumberInput,
  ReferenceInput,
  required,
  SimpleForm,
  TextInput,
} from "react-admin";

/**
 * Form component to create a new Unit record in the admin panel.
 * Client Component (Inherited from react-admin context)
 *
 * @returns A form with inputs for title, description, course association, and order.
 *
 * @example
 * ```tsx
 * <UnitCreate />
 * ```
 */
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
