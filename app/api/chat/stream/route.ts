/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { searchWebForProcedure, findEmergencyCare, searchGeneralHealthInfo } from '@/lib/webSearch';
import { getInsuranceInfo } from '@/lib/insurance';
import { getSheetData } from '@/lib/googleSheets';
import type { InsurancePlan } from '@/lib/insurance';
import type { EmergencyFacility } from '@/components/EmergencyCard';
import type { Procedure } from '@/components/ProcedureCard';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get proprietary data with Google Sheets integration
const getProprietaryData = async (specialty?: string): Promise<Procedure[]> => {
  try {
    const sheetData = await getSheetData();
    
    if (sheetData && sheetData.length > 0) {
      // Convert sheet data to Procedure format
      const procedures: Procedure[] = sheetData
        .filter((row: any) => {
          if (specialty && row.specialty) {
            return row.specialty.toLowerCase().includes(specialty.toLowerCase()) ||
                   row.servicename?.toLowerCase().includes(specialty.toLowerCase());
          }
          return true;
        })
        .map((row: any) => ({
          clinicname: row.clinicname || row.clinic_name || '',
          service: row.servicename || row.service_name || row.service || '',
          cashprice: row.cashprice || row.cash_price || '',
          address: row.location || row.address || '',
          phone: row.phone || '',
          source: 'Proprietary Data',
          partnershipTier: row.partnership_tier || 'standard'
        }))
        .filter(proc => proc.clinicname && proc.service)
        .sort((a: any, b: any) => {
          const tierOrder = { premium: 0, standard: 1, basic: 2 };
          return (tierOrder[a.partnershipTier as keyof typeof tierOrder] || 2) - 
                 (tierOrder[b.partnershipTier as keyof typeof tierOrder] || 2);
        })
        .slice(0, 3);

      return procedures;
    }
  } catch (error) {
    console.error('Error fetching proprietary data:', error);
  }
  
  return [];
};

// Get targeted insurance recommendations
const getTargetedInsurance = async (specialty?: string, isEmergency: boolean = false): Promise<InsurancePlan[]> => {
  const prioritizedPlans: InsurancePlan[] = [
    {
      planName: "Premium Health Care Plus",
      provider: "Dubai Health Partners",
      premium: 2800,
      benefits: [
        `Comprehensive coverage for ${specialty || 'all medical'} services`,
        "Priority appointments at partner facilities",
        "24/7 emergency support",
        "Prescription medication coverage",
      ]
    },
    {
      planName: "Essential Health Shield",
      provider: "Emirates Medical Insurance", 
      premium: 1500,
      benefits: [
        `Specialized ${specialty || 'medical'} care coverage`,
        "Emergency care at top hospitals",
        "Outpatient consultation coverage",
        "Diagnostic test coverage",
      ]
    }
  ];

  if (isEmergency) {
    return [{
      planName: "Emergency Care Plus",
      provider: "Dubai Emergency Coverage",
      premium: 1200,
      benefits: [
        "Immediate emergency care coverage",
        "Ambulance services included",
        "ICU and hospital stay coverage",
        "24/7 medical helpline"
      ]
    }, ...prioritizedPlans];
  }

  return prioritizedPlans;
};

// Emergency facilities
const getEmergencyFacilities = (): EmergencyFacility[] => [
  { name: "Dubai Hospital Emergency", address: "Oud Metha Road, Dubai", phone: "+971 4 219 5000" },
  { name: "American Hospital Emergency", address: "Oud Metha Road, Dubai", phone: "+971 4 336 7777" },
  { name: "NMC Royal Hospital Emergency", address: "Al Garhoud, Dubai", phone: "+971 4 267 0000" }
];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const message = body.message;

  if (!message) {
    return new Response('Message is required', { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const sendUpdate = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // Step 1: Intent Analysis
        sendUpdate({ type: 'progress', step: 'analyzing', message: 'Understanding your query...' });

        const intentAnalysis = await openai.chat.completions.create({
          model: 'gpt-4-turbo',
          messages: [
            {
              role: 'system',
              content: `Analyze the user's health query for a Dubai-based assistant. Respond with JSON:
{
"isEmergency": boolean,
"medicalSpecialty": "e.g., cardiology, dermatology",
"briefAnswer": "A 2-3 sentence, non-diagnostic answer. Include a disclaimer."
}`
            },
            { role: 'user', content: message },
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
        });

        const intentData = JSON.parse(intentAnalysis.choices[0].message.content || '{}');

        // Step 2: Emergency Check
        if (intentData.isEmergency) {
          const emergencyFacilities = getEmergencyFacilities();
          const insurancePlans = await getTargetedInsurance(intentData.medicalSpecialty, true);
          
          sendUpdate({
            type: 'complete',
            response: `⚠️ **MEDICAL EMERGENCY DETECTED**\n\n${intentData.briefAnswer}\n\n**🚨 IMMEDIATE ACTION REQUIRED:** If this is a life-threatening emergency, please call 999 or go to the nearest emergency room. Would you like help finding the closest facilities and insurance coverage?`,
            emergencyFacilities,
            insurancePlans,
            isEmergency: true,
          });
          controller.close();
          return;
        }

        // Step 3: Non-Emergency - Get Data
        sendUpdate({ type: 'progress', step: 'finding_care', message: 'Finding care options...' });

        let regularFacilities = await getProprietaryData(intentData.medicalSpecialty);
        if (regularFacilities.length === 0) {
          sendUpdate({ type: 'progress', step: 'web_search', message: 'Searching for more options...' });
          const searchQuery = `${intentData.medicalSpecialty} specialist in Dubai`;
          regularFacilities = await searchWebForProcedure(searchQuery);
        }
        
        const insurancePlans = await getTargetedInsurance(intentData.medicalSpecialty, false);

        // Step 4: Sales Funnel Response
        const salesFunnelResponse = `⚠️ **Medical Disclaimer**: This information is for educational purposes only. Please consult a healthcare provider for diagnosis and treatment.\n\n**${intentData.briefAnswer}**\n\n---\n\n**🏥 Would you like help finding the right healthcare provider and insurance for your ${intentData.medicalSpecialty || 'medical'} needs?**\n\n${regularFacilities.length > 0 ? `I've found ${regularFacilities.length} specialized providers.` : `I can help you find qualified providers.`}`;

        sendUpdate({
          type: 'complete',
          response: salesFunnelResponse,
          regularFacilities,
          pricing: regularFacilities,
          insurancePlans,
          isEmergency: false,
          specialty: intentData.medicalSpecialty,
        });

      } catch (error) {
        console.error('Stream processing error:', error);
        sendUpdate({ type: 'error', message: 'An error occurred. Please try again.' });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
  });
} 