import {
  Create,
  NumberInput,
  ReferenceInput,
  required,
  SimpleForm,
  TextInput,
} from "react-admin";

/**
 * Form component to create a new Lesson record in the admin panel.
 * Client Component (Inherited from react-admin context)
 *
 * @returns A form with inputs for lesson title, unit association, and order.
 *
 * @example
 * ```tsx
 * <LessonCreate />
 * ```
 */
export const LessonCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput label="Title" source="title" validate={[required()]} />
        <ReferenceInput reference="units" source="unitId" />
        <NumberInput label="Order" source="order" validate={[required()]} />
      </SimpleForm>
    </Create>
  );
};
