import {
  Create,
  NumberInput,
  ReferenceInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
} from "react-admin";

/**
 * Form component to create a new Challenge record in the admin panel.
 * Client Component (Inherited from react-admin context)
 *
 * @returns A form with inputs for challenge question, type (e.g. SELECT, ASSIST), lesson association, and order.
 *
 * @example
 * ```tsx
 * <ChallengeCreate />
 * ```
 */
export const ChallengeCreate = () => {
  return (
    <Create>
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
    </Create>
  );
};
