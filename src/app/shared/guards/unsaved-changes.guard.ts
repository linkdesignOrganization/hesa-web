import { CanDeactivateFn } from '@angular/router';

/**
 * Interface for components that have unsaved changes.
 * Components implementing this interface must provide a canDeactivate method
 * that returns true if navigation is allowed, or a Promise<boolean> if
 * a confirmation dialog needs to be shown.
 */
export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
  promptUnsavedChanges(): Promise<boolean>;
}

/**
 * Route guard that prevents navigation away from a component with unsaved changes.
 * Shows a confirmation modal via the component's promptUnsavedChanges method.
 * (UX-045, DC-135)
 */
export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  if (!component.hasUnsavedChanges()) {
    return true;
  }
  return component.promptUnsavedChanges();
};
