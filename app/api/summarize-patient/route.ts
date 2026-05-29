import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { ACTIVE_PATIENT, PATIENT_HARPER, PATIENT_ELLISON, MOCK_SUMMARIES, type Patient } from '@/lib/patientData';

const PATIENT_REGISTRY: Record<string, Patient> = {
  'PT-10001': PATIENT_HARPER,
  'PT-10002': PATIENT_ELLISON,
};

// Per-patient mock summaries keyed by patientId
const MOCK_SUMMARIES_HARPER: Record<string, string> = {
  Summary:
    '• History of **mild generalised anxiety disorder** and **seasonal allergic rhinitis**\n• Low chronic disease burden — all baseline investigations within normal limits\n\nOver the past year Mr Harper has attended three GP appointments: new patient registration, an anxiety review following increased workplace stress, and an acute hay fever consultation. **Propranolol 10 mg PRN** was initiated in March 2025 for situational anxiety, alongside lifestyle and sleep hygiene advice. **Cetirizine 10 mg PRN** was added in May 2025 for seasonal rhinitis.\n\nOverall, the patient reflects a low-complexity profile with no chronic disease progression. Current care focuses on **conservative symptom management**, preventative wellbeing, and monitoring for any escalation of anxiety symptoms.',

  'Recent encounters':
    '• Jan 2025 — New patient registration: baseline review, mild situational anxiety identified, blood tests requested\n• Mar 2025 — Anxiety review: worsening work-related stress, propranolol 10 mg PRN initiated\n• May 2025 — Acute appointment: seasonal allergic rhinitis flare, cetirizine 10 mg PRN prescribed',

  'Recent activity':
    'Mr Harper has had three GP contacts since registration in January 2025, all related to anxiety management and seasonal allergy flare. Contact frequency is low, consistent with a young patient with minimal chronic disease. There is no pattern of urgent or unplanned attendance.',

  'Lifestyle & examinations':
    'Mr Harper is a non-smoker who exercises regularly and drinks socially. The main lifestyle risk factors are inconsistent sleep during work deadlines and moderate processed food intake. He works in a sedentary occupation but is active in the evenings. All recent observations including blood pressure and pulse are within normal limits.',

  'Recent tests':
    '• HbA1c (Jan 2025) — 5.2%; normal, no diabetes risk identified\n• Total cholesterol (Jan 2025) — 4.4 mmol/L; within normal range\n• eGFR (Jan 2025) — Normal\n• FBC (Jan 2025) — Normal; no haematological concerns',

  'Current medications':
    'Mr Harper is prescribed two PRN medications: cetirizine 10 mg for seasonal rhinitis and propranolol 10 mg for situational anxiety episodes. There are no regular daily medications and no known significant drug interactions. Medication burden is minimal and appropriate to his low-complexity clinical profile.',
};

const MOCK_SUMMARIES_BY_PATIENT: Record<string, Record<string, string>> = {
  'PT-10001': MOCK_SUMMARIES_HARPER,
  'PT-10002': MOCK_SUMMARIES,
};

const WIDGET_PROMPTS: Record<string, string> = {
  Summary: `Write a clinical summary in this exact two-section format:

Section 1 — Key themes (2–4 bullet points starting with •):
Each bullet should name a key diagnosis, risk factor, or clinical concern. Use **bold** around specific condition names or significant findings.

Then one blank line, then:

Section 2 — Narrative (2–3 paragraphs):
Paragraph 1: recent clinical activity and encounters. Paragraph 2: investigation findings and treatment response. Paragraph 3: overall longitudinal picture and priorities. Use **bold** around clinically significant terms, drug names, and key findings within the paragraphs.

Be concise and clinically factual. No headers, no labels, no preamble — output only the bullets and paragraphs.`,
  'Recent encounters': `Summarise the patient's recent clinical encounters in 3–4 short bullet points, highlighting the most clinically significant events and their outcomes. Use plain clinical language.`,
  'Recent activity': `In 2–3 sentences, describe the pattern of recent clinical activity for this patient — frequency of contact, types of interactions, and any trend worth noting clinically.`,
  'Lifestyle & examinations': `Briefly summarise (2–3 sentences) the patient's lifestyle risk factors and any recent examination findings relevant to their care. Highlight the most clinically significant points.`,
  'Recent tests': `Summarise the most clinically significant recent test results in 3–4 short bullet points. Flag any results outside normal range and note what action if any was taken.`,
  'Current medications': `Provide a brief medication overview (2–3 sentences): number of active medications, main therapeutic categories, and any notable interactions or review points. Do not list every drug — give a high-level clinical picture.`,
};

export async function POST(request: Request) {
  const { widgetTitle, patientId } = await request.json() as { widgetTitle: string; patientId?: string };

  if (!WIDGET_PROMPTS[widgetTitle]) {
    return NextResponse.json({ error: 'Unknown widget' }, { status: 400 });
  }

  const patient: Patient = (patientId ? PATIENT_REGISTRY[patientId] : undefined) ?? ACTIVE_PATIENT;
  const mockSummaries: Record<string, string> = (patientId ? MOCK_SUMMARIES_BY_PATIENT[patientId] : undefined) ?? MOCK_SUMMARIES;

  // Fall back to mock summaries if no API key is configured
  if (!process.env.ANTHROPIC_API_KEY) {
    const summary = mockSummaries[widgetTitle] ?? 'No summary available.';
    return NextResponse.json({ summary });
  }

  try {
    const client = new Anthropic();
    const patientContext = JSON.stringify(patient, null, 2);

    const message = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 512,
      thinking: { type: 'adaptive' },
      system: `You are a clinical AI assistant summarising patient data for a GP. Be concise, accurate, and clinically relevant. Do not include disclaimers or suggestions to consult other clinicians — the reader IS the clinician.`,
      messages: [
        {
          role: 'user',
          content: `Here is the patient record for ${patient.demographics.name}:\n\n${patientContext}\n\n---\n\nTask: ${WIDGET_PROMPTS[widgetTitle]}`,
        },
      ],
    });

    const textBlock = message.content.find(b => b.type === 'text');
    const summary = textBlock?.type === 'text' ? textBlock.text : '';
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Patient summarization error:', error);
    const summary = mockSummaries[widgetTitle] ?? 'No summary available.';
    return NextResponse.json({ summary });
  }
}
