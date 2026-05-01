import {
  Edit,
  NumberInput,
  ReferenceInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
} from "react-admin";

/**
 * Form component to edit an existing Challenge record in the admin panel.
 * Client Component (Inherited from react-admin context)
 *
 * @returns A form populated with existing challenge data for updating properties.
 *
 * @example
 * ```tsx
 * <ChallengeEdit />
 * ```
 */
export const ChallengeEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput label="Question" source="question" validate={[required()]} />
        <SelectInput
          choices={[
            {
              id: "SELECT",
              name: "SELECT",
            },
            {
              id: "ASSIST",
              name: "ASSIST",
            },
          ]}
          source="type"
          validate={[required()]}
        />
        <ReferenceInput reference="lessons" source="lessonId" />
        <NumberInput label="Order" source="order" validate={[required()]} />
      </SimpleForm>
    </Edit>
  );
};
