/**
 * @file use-exit-modal.ts
 * @description Zustand store for managing the exit modal state.
 * Provides functions to open, close, and check the status of the exit modal.
 */

import { create } from "zustand";

/**
 * State interface for the exit modal
 */
interface ExitModalState {
  /**
   * Whether the exit modal is currently open
   * @type {boolean}
   */
  isOpen: boolean;

  /**
   * Function to open the exit modal
   * Sets isOpen to true
   * @returns {void}
   */
  open: () => void;

  /**
   * Function to close the exit modal
   * Sets isOpen to false
   * @returns {void}
   */
  close: () => void;
}

/**
 * Zustand store for managing the exit modal state
 * Provides functions to open, close, and check the status of the exit modal
 * @type {import("zustand").UseStore<ExitModalState>} - Zustand store instance
 *
 * @example
 * // Get the store instance
 * import { useExitModal } from "./use-exit-modal";
 *
 * // Access the state and actions
 * const { isOpen, open, close } = useExitModal();
 *
 * @example
 * // Open the exit modal
 * useExitModal.getState().open();
 *
 * @example
 * // Close the exit modal
 * useExitModal.getState().close();
 *
 * @example
 * // Subscribe to modal state changes
 * const unsubscribe = useExitModal.subscribe((state) => {
 *   console.log("Exit modal is:", state.isOpen ? "open" : "closed");
 * });
 */
export const useExitModal = create<ExitModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
