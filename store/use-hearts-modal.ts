/**
 * @file use-hearts-modal.ts
 * @description Zustand store for managing the hearts modal state.
 * Provides functions to open, close, and check the status of the hearts modal.
 */

import { create } from "zustand";

/**
 * State interface for the hearts modal
 */
interface HeartsModalState {
  /**
   * Whether the hearts modal is currently open
   * @type {boolean}
   */
  isOpen: boolean;

  /**
   * Function to open the hearts modal
   * Sets isOpen to true
   * @returns {void}
   */
  open: () => void;

  /**
   * Function to close the hearts modal
   * Sets isOpen to false
   * @returns {void}
   */
  close: () => void;
}

/**
 * Zustand store for managing the hearts modal state
 * Provides functions to open, close, and check the status of the hearts modal
 *
 * @example
 * // Get the store instance
 * import { useHeartsModal } from "./use-hearts-modal";
 *
 * // Access the state and actions
 * const { isOpen, open, close } = useHeartsModal();
 *
 * @example
 * // Open the hearts modal
 * useHeartsModal.getState().open();
 *
 * @example
 * // Close the hearts modal
 * useHeartsModal.getState().close();
 *
 * @example
 * // Subscribe to modal state changes
 * const unsubscribe = useHeartsModal.subscribe((state) => {
 *   console.log("Hearts modal is:", state.isOpen ? "open" : "closed");
 * });
 */
export const useHeartsModal = create<HeartsModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
