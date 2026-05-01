import {
  BooleanInput,
  Edit,
  ReferenceInput,
  required,
  SimpleForm,
  TextInput,
} from "react-admin";

/**
 * Form component to edit an existing Challenge Option record in the admin panel.
 * Client Component (Inherited from react-admin context)
 *
 * @returns A form populated with existing challenge option data for updating properties.
 *
 * @example
 * ```tsx
 * <ChallengeOptionEdit />
 * ```
 */
export const ChallengeOptionEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput label="Text" source="text" validate={[required()]} />
        <BooleanInput label="Correct option" source="correct" />
        <ReferenceInput reference="challenges" source="challengeId" />
        <TextInput label="Image URL" source="imageSrc" />
        <TextInput label="Audio URL" source="audioSrc" />
      </SimpleForm>
    </Edit>
  );
};
