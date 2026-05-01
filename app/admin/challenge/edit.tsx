import {
  Edit,
  NumberInput,
  ReferenceInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
} from "react-admin";

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
