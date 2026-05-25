/**
 * Form Components
 *
 * Reusable components for building forms in workflows.
 *
 * USAGE RULES:
 *
 * 1. When user is in conversational dialog view:
 *    - ALWAYS use InDialogForm (inline in conversation)
 *
 * 2. When user is viewing a large data return:
 *    - Can use EITHER InDialogForm OR PopOutForm
 *    - Choice depends on the specific use case
 *    - Will be determined at implementation time
 *
 * COMPONENTS:
 * - InDialogForm: Forms displayed inline in the conversation thread
 * - PopOutForm: Non-modal floating forms that can be minimized/docked
 */

export { FormContainer } from './FormContainer';
export { InDialogForm } from './InDialogForm';
export { PopOutForm } from './PopOutForm';
export {
  TextInput,
  TextArea,
  Select,
  Checkbox,
  RadioGroup,
  FieldGroup,
} from './FormFields';
