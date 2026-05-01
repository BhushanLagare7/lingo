import { Datagrid, List, ReferenceField, TextField } from "react-admin";

/**
 * Renders a list view of Unit records for the admin panel.
 * Client Component (Inherited from react-admin context)
 *
 * @returns A datagrid displaying unit properties including ID, title, description, associated course, and order.
 *
 * @example
 * ```tsx
 * <UnitList />
 * ```
 */
export const UnitList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="description" />
        <ReferenceField reference="courses" source="courseId" />
        <TextField source="order" />
      </Datagrid>
    </List>
  );
};
