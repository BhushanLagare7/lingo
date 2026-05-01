import {
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  TextField,
} from "react-admin";

/**
 * Renders a list view of Lesson records for the admin panel.
 * Client Component (Inherited from react-admin context)
 *
 * @returns A datagrid displaying lesson properties including ID, title, associated unit, and order.
 *
 * @example
 * ```tsx
 * <LessonList />
 * ```
 */
export const LessonList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="title" />
        <ReferenceField reference="units" source="unitId" />
        <NumberField source="order" />
      </Datagrid>
    </List>
  );
};
