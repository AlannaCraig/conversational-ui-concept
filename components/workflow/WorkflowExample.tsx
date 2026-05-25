/**
 * Workflow Example Component
 *
 * Demonstrates how to compose DataReturnContainer, SmallDataReturn, and LargeDataReturn
 * into multi-step workflows.
 *
 * USAGE EXAMPLES:
 *
 * 1. Simple Small Data Workflow Step:
 * ```tsx
 * <DataReturnContainer
 *   stepLabel="Step 1 of 3"
 *   title="Your Upcoming Appointments"
 *   description="Here are your scheduled appointments for today"
 * >
 *   <SmallDataReturn
 *     cards={[
 *       { id: '1', type: 'appointment-list', data: {...} },
 *       { id: '2', type: 'appointment-list', data: {...} }
 *     ]}
 *     followUpText="You have 2 appointments scheduled for today."
 *     suggestedActions={[
 *       { id: 'action-1', text: 'View full calendar' },
 *       { id: 'action-2', text: 'Reschedule appointment' }
 *     ]}
 *     onSelectAction={handleAction}
 *   />
 * </DataReturnContainer>
 * ```
 *
 * 2. Large Data Workflow Step:
 * ```tsx
 * <DataReturnContainer
 *   stepLabel="Step 2 of 3"
 *   title="Patient Summary"
 * >
 *   <LargeDataReturn
 *     layoutType="patient-summary"
 *     introText="Complete medical history for Robert Smith"
 *     suggestedActions={[
 *       { id: 'action-1', text: 'Start new encounter' },
 *       { id: 'action-2', text: 'Review medications' }
 *     ]}
 *     onSelectAction={handleAction}
 *   />
 * </DataReturnContainer>
 * ```
 *
 * 3. Multi-Step Workflow with Transitions:
 * ```tsx
 * function PatientWorkflow() {
 *   const [step, setStep] = useState(1);
 *
 *   return (
 *     <>
 *       {step === 1 && (
 *         <DataReturnContainer
 *           stepLabel="Step 1 of 3"
 *           title="Next Appointment"
 *         >
 *           <SmallDataReturn
 *             cards={[{ type: 'patient-card', data: {...} }]}
 *             suggestedActions={[
 *               { id: 'view-summary', text: 'View patient summary' }
 *             ]}
 *             onSelectAction={(action) => {
 *               if (action.id === 'view-summary') setStep(2);
 *             }}
 *           />
 *         </DataReturnContainer>
 *       )}
 *
 *       {step === 2 && (
 *         <DataReturnContainer
 *           stepLabel="Step 2 of 3"
 *           title="Patient Medical History"
 *         >
 *           <LargeDataReturn
 *             layoutType="patient-summary"
 *             suggestedActions={[
 *               { id: 'view-bp', text: 'View blood pressure readings' }
 *             ]}
 *             onSelectAction={(action) => {
 *               if (action.id === 'view-bp') setStep(3);
 *             }}
 *           />
 *         </DataReturnContainer>
 *       )}
 *
 *       {step === 3 && (
 *         <DataReturnContainer
 *           stepLabel="Step 3 of 3"
 *           title="Blood Pressure Trends"
 *         >
 *           <SmallDataReturn
 *             cards={[{ type: 'line-graph', data: {...} }]}
 *             followUpText="Blood pressure readings show consistent elevation."
 *           />
 *         </DataReturnContainer>
 *       )}
 *     </>
 *   );
 * }
 * ```
 *
 * 4. Nested Workflow Steps (disable animation on inner container):
 * ```tsx
 * <DataReturnContainer
 *   title="Patient Review"
 *   stepLabel="Overview"
 * >
 *   <div className="space-y-6">
 *     <DataReturnContainer
 *       title="Recent Appointments"
 *       disableAnimation
 *     >
 *       <SmallDataReturn cards={appointmentCards} />
 *     </DataReturnContainer>
 *
 *     <DataReturnContainer
 *       title="Vital Signs"
 *       disableAnimation
 *     >
 *       <SmallDataReturn cards={vitalCards} />
 *     </DataReturnContainer>
 *   </div>
 * </DataReturnContainer>
 * ```
 *
 * 5. With Custom Footer (pagination, metadata, etc.):
 * ```tsx
 * <DataReturnContainer
 *   title="All Patients"
 *   footer={
 *     <div className="flex justify-between items-center">
 *       <div className="text-sm text-text-tertiary">Showing 1-20 of 150</div>
 *       <div className="flex gap-2">
 *         <button className="px-4 py-2 border border-border rounded">Previous</button>
 *         <button className="px-4 py-2 border border-border rounded">Next</button>
 *       </div>
 *     </div>
 *   }
 * >
 *   <SmallDataReturn cards={patientCards} />
 * </DataReturnContainer>
 * ```
 */

'use client';

// This file contains usage examples only - no actual component code
// See DataReturnContainer.tsx, SmallDataReturn.tsx, and LargeDataReturn.tsx
// for the component implementations

export {};
