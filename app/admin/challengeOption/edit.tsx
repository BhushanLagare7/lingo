import {
  BooleanInput,
  Edit,
  ReferenceInput,
  required,
  SimpleForm,
  TextInput,
} from "react-admin";

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
