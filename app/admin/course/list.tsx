"use client";
import { Datagrid, List, TextField } from "react-admin";

/**
 * Renders a list view of Course records for the admin panel.
 * Client Component
 *
 * @returns A datagrid displaying course properties including ID, title, and image source.
 *
 * @example
 * ```tsx
 * <CourseList />
 * ```
 */
export const CourseList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="imageSrc" />
      </Datagrid>
    </List>
  );
};
