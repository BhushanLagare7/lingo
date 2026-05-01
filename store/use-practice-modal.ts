/**
 * @file use-practice-modal.ts
 * @description Zustand store for managing the practice modal state.
 * Provides functions to open, close, and check the status of the practice modal.
 */

import { create } from "zustand";

/**
 * State interface for the practice modal
 */
interface PracticeModalState {
  /**
   * Whether the practice modal is currently open
   * @type {boolean}
   */
  isOpen: boolean;

  /**
   * Function to open the practice modal
   * Sets isOpen to true
   * @returns {void}
   */
  open: () => void;

  /**
   * Function to close the practice modal
   * Sets isOpen to false
   * @returns {void}
   */
  close: () => void;
}

/**
 * Zustand store for managing the practice modal state
 * Provides functions to open, close, and check the status of the practice modal
 * @type {import("zustand").UseStore<PracticeModalState>} - Zustand store instance
 *
 * @example
 * // Get the store instance
 * import { usePracticeModal } from "./use-practice-modal";
 *
 * // Access the state and actions
 * const { isOpen, open, close } = usePracticeModal();
 *
 * @example
 * // Open the practice modal
 * usePracticeModal.getState().open();
 *
 * @example
 * // Close the practice modal
 * usePracticeModal.getState().close();
 *
 * @example
 * // Subscribe to modal state changes
 * const unsubscribe = usePracticeModal.subscribe((state) => {
 *   console.log("Practice modal is:", state.isOpen ? "open" : "closed");
 * });
 */
export const usePracticeModal = create<PracticeModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
