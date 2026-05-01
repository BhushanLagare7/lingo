import {
  Edit,
  NumberInput,
  ReferenceInput,
  required,
  SimpleForm,
  TextInput,
} from "react-admin";

/**
 * Form component to edit an existing Lesson record in the admin panel.
 * Client Component (Inherited from react-admin context)
 *
 * @returns A form populated with existing lesson data for updating properties.
 *
 * @example
 * ```tsx
 * <LessonEdit />
 * ```
 */
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
