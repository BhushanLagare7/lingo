import { Button } from "@/components/ui/button";

/**
 * Renders a showcase page demonstrating the various button variants available in the application.
 * Server Component
 *
 * @returns A container with all configured button variants for visual testing and reference.
 *
 * @example
 * ```tsx
 * <ButtonsPage />
 * ```
 */
const ButtonsPage = () => {
  return (
    <div className="flex flex-col p-4 space-y-4 max-w-50">
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="primary-outline">Primary Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="secondary-outline">Secondary Outline</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="danger-outline">Danger Outline</Button>
      <Button variant="super">Super</Button>
      <Button variant="super-outline">Super Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="sidebar">Sidebar</Button>
      <Button variant="sidebar-outline">Sidebar Outline</Button>
    </div>
  );
};

export default ButtonsPage;
