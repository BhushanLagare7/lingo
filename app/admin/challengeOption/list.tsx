import {
  BooleanField,
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  TextField,
} from "react-admin";

/**
 * Renders a list view of Challenge Option records for the admin panel.
 * Client Component (Inherited from react-admin context)
 *
 * @returns A datagrid displaying challenge option properties including ID, text, correctness, associated challenge, image URL, and audio URL.
 *
 * @example
 * ```tsx
 * <ChallengeOptionList />
 * ```
 */
export const ChallengeOptionList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="text" />
        <BooleanField source="correct" />
        <ReferenceField reference="challenges" source="challengeId" />
        <TextField source="imageSrc" />
        <TextField source="audioSrc" />
      </Datagrid>
    </List>
  );
};
