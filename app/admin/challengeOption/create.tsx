import {
  BooleanInput,
  Create,
  ReferenceInput,
  required,
  SimpleForm,
  TextInput,
} from "react-admin";

/**
 * Form component to create a new Challenge Option record in the admin panel.
 * Client Component (Inherited from react-admin context)
 *
 * @returns A form with inputs for option text, correctness flag, challenge association, image URL, and audio URL.
 *
 * @example
 * ```tsx
 * <ChallengeOptionCreate />
 * ```
 */
export const ChallengeOptionCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput label="Text" source="text" validate={[required()]} />
        <BooleanInput label="Correct option" source="correct" />
        <ReferenceInput reference="challenges" source="challengeId" />
        <TextInput label="Image URL" source="imageSrc" />
        <TextInput label="Audio URL" source="audioSrc" />
      </SimpleForm>
    </Create>
  );
};
