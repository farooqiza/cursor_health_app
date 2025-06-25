/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { searchWebForProcedure, findEmergencyCare, searchGeneralHealthInfo } from '@/lib/webSearch';
import { getInsuranceInfo } from '@/lib/insurance';
import type { InsurancePlan } from '@/lib/insurance';
import type { EmergencyFacility } from '@/components/EmergencyCard';
import type { Procedure } from '@/components/ProcedureCard';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  let message = '';
  try {
    const body = await req.json();
    message = body.message;
    
    if (!message) {
      return new Response('Message is required', { status: 400 });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        const sendUpdate = (data: Record<string, unknown>) => {
          const chunk = encoder.encode(`data: ${JSON.stringify(data)}\n\n`);
          controller.enqueue(chunk);
        };

        try {
          // Step 1: Comprehensive Intent Analysis
          sendUpdate({
            type: 'progress',
            step: 'intent_analysis',
            message: 'Analyzing your health query...',
            status: 'analyzing'
          });

          const intentAnalysis = await openai.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: [
              {
                role: 'system',
                content: `You are an expert healthcare intent analyzer for a Dubai-based health assistant. Analyze the user's message and respond with a comprehensive JSON object.

CRITICAL ANALYSIS REQUIREMENTS:
1.  **Emergency Detection**: Set "isEmergency": true for life-threatening situations.
2.  **Service Classification**: Identify the most specific medical service needed.
3.  **Query Type**: Determine if it's "health-advice", "pricing-inquiry", "facility-search", or "insurance-coverage".
4.  **Keywords**: Generate relevant keywords for searching facilities and insurance.

RESPONSE FORMAT:
{
  "isEmergency": boolean,
  "serviceQuery": "specific medical service",
  "queryType": "health-advice|pricing-inquiry|facility-search|insurance-coverage",
  "medicalSpecialty": "specific specialty",
  "insuranceKeywords": ["keyword1", "keyword2"]
}`,
              },
              { role: 'user', content: message },
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
          });

          const intentData = JSON.parse(intentAnalysis.choices[0].message.content || '{}');
          sendUpdate({ type: 'progress', step: 'intent_complete', message: 'Query understood.' });
          
          // Step 2: Parallel Data Collection
          sendUpdate({ type: 'progress', step: 'data_collection_start', message: 'Gathering information...' });

          const promises = [];
          
          // Facilities Search
          if (intentData.isEmergency) {
            promises.push(findEmergencyCare().then(data => ({ type: 'emergencyFacilities', data })));
          } else {
            const facilityQuery = `${intentData.medicalSpecialty || intentData.serviceQuery} clinics in Dubai`;
            promises.push(searchWebForProcedure(facilityQuery).then(data => ({ type: 'regularFacilities', data })));
          }

          // Insurance Search
          promises.push(getInsuranceInfo(intentData.insuranceKeywords || []).then(data => ({ type: 'insurance', data })));
          
          // General Health Info Search
          promises.push(searchGeneralHealthInfo(message).then(data => ({ type: 'healthInfo', data })));

          const results = await Promise.all(promises);

          const emergencyFacilities = results.find(r => r.type === 'emergencyFacilities')?.data || [];
          const regularFacilities = results.find(r => r.type === 'regularFacilities')?.data || [];
          const insurancePlans = results.find(r => r.type === 'insurance')?.data || [];
          const healthInfo = results.find(r => r.type === 'healthInfo')?.data || 'Please consult a doctor for advice.';

          sendUpdate({ type: 'progress', step: 'data_collection_complete', message: 'Information gathered.' });

          // Step 3: Comprehensive Response Generation
          sendUpdate({ type: 'progress', step: 'response_generation', message: 'Synthesizing your answer...' });

          const systemPrompt = `You are an expert AI Health Concierge for Dubai. Your mission is to provide a comprehensive, accurate, and helpful response based on the collected data.

MANDATORY RESPONSE STRUCTURE:
⚠️ **Medical Disclaimer**: This information is for educational purposes only and not a substitute for professional medical advice.

RESPONSE PRINCIPLES:
1.  **Synthesize**: Combine the provided health info, facility details, and insurance data into a cohesive answer.
2.  **Prioritize**: Use the fetched health information as the primary source for medical advice.
3.  **Dubai Context**: Ensure all recommendations are relevant to Dubai.
4.  **Clarity**: Present the information clearly and concisely.

Return the final synthesized response as a single markdown string in a JSON object: {"responseText": "..."}`;

          const finalResponse = await openai.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `
User Query: "${message}"

Collected Health Information:
${healthInfo}

Available Facilities:
${(regularFacilities.length > 0 ? regularFacilities : emergencyFacilities).map((f: any) => `- ${f.clinicname || f.name} at ${f.address}`).join('\n')}

Available Insurance Plans:
${insurancePlans.map((p: InsurancePlan) => `- ${p.planName} by ${p.provider}`).join('\n')}

Please generate a comprehensive response.` }
            ],
            response_format: { type: "json_object" },
            temperature: 0.5,
          });

          const responseContent = JSON.parse(finalResponse.choices[0]?.message.content || '{}');

          // Send the final, complete payload
          sendUpdate({
            type: 'complete',
            response: responseContent.responseText || 'I have gathered some information for you. Please review the tabs for details.',
            emergencyFacilities,
            regularFacilities,
            pricing: regularFacilities, // Use facility results for pricing cards
            insurancePlans
          });

        } catch (error) {
          console.error('Stream processing error:', error);
          sendUpdate({ type: 'error', message: 'An error occurred while processing your request.' });
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Stream setup error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 