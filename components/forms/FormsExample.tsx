/**
 * Forms Example Component
 *
 * Demonstrates how to use the form components in workflows.
 *
 * USAGE EXAMPLES:
 *
 * 1. Small Form (Inline in Dialog):
 * ```tsx
 * <FormContainer
 *   title="Quick Patient Note"
 *   description="Add a brief note to the patient record"
 * >
 *   <SmallFormReturn
 *     formId="quick-note-form"
 *     submitText="Save Note"
 *     cancelText="Cancel"
 *     onSubmit={(formData) => {
 *       console.log('Note:', formData.get('note'));
 *     }}
 *     onCancel={() => console.log('Cancelled')}
 *   >
 *     <TextArea
 *       label="Note"
 *       name="note"
 *       placeholder="Enter your note here..."
 *       rows={3}
 *       required
 *     />
 *   </SmallFormReturn>
 * </FormContainer>
 * ```
 *
 * 2. Large Form Dialog (Non-Modal Floating):
 * ```tsx
 * const [isFormOpen, setIsFormOpen] = useState(false);
 *
 * <LargeFormDialog
 *   formId="UID-1234"
 *   title="Patient Encounter"
 *   subtitle="18-Sep-2025 at 13:15"
 *   isOpen={isFormOpen}
 *   onClose={() => setIsFormOpen(false)}
 *   submitText="Complete Encounter"
 *   onSubmit={(formData) => {
 *     console.log('Encounter data:', Object.fromEntries(formData));
 *     setIsFormOpen(false);
 *   }}
 * >
 *   <FieldGroup legend="Vitals">
 *     <TextInput
 *       label="Blood Pressure"
 *       name="blood_pressure"
 *       placeholder="120/80"
 *       required
 *     />
 *     <TextInput
 *       label="Heart Rate"
 *       name="heart_rate"
 *       type="number"
 *       placeholder="72"
 *     />
 *   </FieldGroup>
 *
 *   <FieldGroup legend="Assessment">
 *     <TextArea
 *       label="Clinical Notes"
 *       name="notes"
 *       rows={6}
 *       required
 *     />
 *   </FieldGroup>
 * </LargeFormDialog>
 * ```
 *
 * 3. Multi-Step Form Workflow:
 * ```tsx
 * function PatientIntakeWorkflow() {
 *   const [step, setStep] = useState(1);
 *   const [formData, setFormData] = useState({});
 *
 *   return (
 *     <>
 *       {step === 1 && (
 *         <FormContainer
 *           stepLabel="Step 1 of 3"
 *           title="Patient Demographics"
 *         >
 *           <SmallFormReturn
 *             onSubmit={(data) => {
 *               setFormData({ ...formData, ...Object.fromEntries(data) });
 *               setStep(2);
 *             }}
 *           >
 *             <TextInput label="First Name" name="first_name" required />
 *             <TextInput label="Last Name" name="last_name" required />
 *             <TextInput label="Date of Birth" name="dob" type="date" required />
 *           </SmallFormReturn>
 *         </FormContainer>
 *       )}
 *
 *       {step === 2 && (
 *         <FormContainer
 *           stepLabel="Step 2 of 3"
 *           title="Medical History"
 *         >
 *           <SmallFormReturn
 *             onSubmit={(data) => {
 *               setFormData({ ...formData, ...Object.fromEntries(data) });
 *               setStep(3);
 *             }}
 *           >
 *             <Checkbox label="Diabetes" name="diabetes" />
 *             <Checkbox label="Hypertension" name="hypertension" />
 *             <TextArea label="Allergies" name="allergies" rows={3} />
 *           </SmallFormReturn>
 *         </FormContainer>
 *       )}
 *     </>
 *   );
 * }
 * ```
 *
 * 4. Form with All Field Types:
 * ```tsx
 * <SmallFormReturn onSubmit={handleSubmit}>
 *   <TextInput
 *     label="Patient Name"
 *     name="patient_name"
 *     required
 *   />
 *
 *   <Select
 *     label="Appointment Type"
 *     name="appointment_type"
 *     placeholder="Select type..."
 *     options={[
 *       { value: 'consultation', label: 'Consultation' },
 *       { value: 'followup', label: 'Follow-up' },
 *       { value: 'urgent', label: 'Urgent Care' },
 *     ]}
 *     required
 *   />
 *
 *   <TextArea
 *     label="Reason for Visit"
 *     name="reason"
 *     rows={3}
 *     helpText="Brief description of symptoms or concerns"
 *   />
 *
 *   <RadioGroup
 *     label="Urgency Level"
 *     name="urgency"
 *     options={[
 *       { value: 'low', label: 'Low' },
 *       { value: 'medium', label: 'Medium' },
 *       { value: 'high', label: 'High' },
 *     ]}
 *     required
 *   />
 *
 *   <Checkbox
 *     label="Patient consents to treatment"
 *     name="consent"
 *     helpText="Required for all procedures"
 *   />
 * </SmallFormReturn>
 * ```
 *
 * 5. Trigger Large Form from Data Return:
 * ```tsx
 * function PatientSummaryWithForm() {
 *   const [showForm, setShowForm] = useState(false);
 *
 *   return (
 *     <>
 *       <DataReturnContainer title="Patient Summary">
 *         <LargeDataReturn
 *           layoutType="patient-summary"
 *           suggestedActions={[
 *             { id: 'start-encounter', text: 'Start new encounter' }
 *           ]}
 *           onSelectAction={(action) => {
 *             if (action.id === 'start-encounter') {
 *               setShowForm(true);
 *             }
 *           }}
 *         />
 *       </DataReturnContainer>
 *
 *       <LargeFormDialog
 *         formId="ENC-2025-001"
 *         title="New Encounter"
 *         subtitle={new Date().toLocaleString()}
 *         isOpen={showForm}
 *         onClose={() => setShowForm(false)}
 *         onSubmit={handleEncounterSubmit}
 *       >
 *         <TextArea label="Chief Complaint" name="complaint" required />
 *         <TextArea label="History of Present Illness" name="hpi" rows={6} />
 *       </LargeFormDialog>
 *     </>
 *   );
 * }
 * ```
 */

'use client';

// This file contains usage examples only - no actual component code
export {};
