import {
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  SelectField,
  TextField,
} from "react-admin";

/**
 * Renders a list view of Challenge records for the admin panel.
 * Client Component (Inherited from react-admin context)
 *
 * @returns A datagrid displaying challenge properties including ID, question, type, associated lesson, and order.
 *
 * @example
 * ```tsx
 * <ChallengeList />
 * ```
 */
export const ChallengeList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="question" />
        <SelectField
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
        />
        <ReferenceField reference="lessons" source="lessonId" />
        <NumberField source="order" />
      </Datagrid>
    </List>
  );
};
