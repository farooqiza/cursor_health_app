import plans from '@/data/insurancePlans.json';
import NodeCache from 'node-cache';

const insuranceCache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

export interface InsurancePlan {
  planName: string;
  provider: string;
  premium: number;
  benefits: string[];
}

// Enhanced function that searches web for current insurance information
export async function getInsuranceInfo(requiredBenefits: string[]): Promise<InsurancePlan[]> {
  if (!requiredBenefits || requiredBenefits.length === 0) {
    return getFallbackInsurance();
  }

  // Try web search for current insurance information first
  try {
    console.log('[WEB SEARCH] Searching for insurance information via OpenAI');
    const webInsuranceResults = await searchInsuranceWithOpenAI(requiredBenefits);
    if (webInsuranceResults && webInsuranceResults.length > 0) {
      console.log(`[WEB SEARCH] Found ${webInsuranceResults.length} insurance plans via OpenAI`);
      return webInsuranceResults;
    }
  } catch (error) {
    console.log('[WEB SEARCH] OpenAI insurance search failed:', error);
  }

  // Fallback to local insurance data
  console.log('[FALLBACK] Using local insurance data');
  const matchingPlans = plans.filter(plan => 
    requiredBenefits.every(requiredBenefit => plan.benefits.includes(requiredBenefit))
  );

  return matchingPlans.length > 0 ? matchingPlans : getFallbackInsurance();
}

// New function to search for insurance information via OpenAI
async function searchInsuranceWithOpenAI(requiredBenefits: string[]): Promise<InsurancePlan[]> {
  const cacheKey = `insurance-${requiredBenefits.join('-').toLowerCase()}`;
  const cachedResult = insuranceCache.get<InsurancePlan[]>(cacheKey);
  if (cachedResult) {
    console.log(`[CACHE HIT] Insurance cache hit for benefits: ${requiredBenefits.join(', ')}`);
    return cachedResult;
  }

  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not found');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a healthcare insurance research assistant. Search the web for current health insurance plans available in Dubai, UAE that cover the specified medical benefits.

Focus on finding:
1. **Insurance plan names** and providers
2. **Premium costs** in AED (UAE Dirhams) 
3. **Coverage details** for the requested medical benefits
4. **Major insurance providers** in UAE (like DHA, SEHA, Oman Insurance, AXA, etc.)
5. **Specific coverage** for medical specialties and procedures

Return your findings as a JSON array with this exact structure:
[
  {
    "planName": "Plan Name",
    "provider": "Insurance Provider",
    "premium": "Annual Premium in AED (number only)",
    "benefits": ["benefit1", "benefit2", "benefit3"]
  }
]

Only include real UAE health insurance plans with actual coverage information. Focus on plans that cover the requested benefits. If you cannot find specific plans, return an empty array [].`
          },
          {
            role: 'user',
            content: `Search the web for current health insurance plans in Dubai, UAE that cover these medical benefits: ${requiredBenefits.join(', ')}

Find insurance plans with coverage for these specific medical services, including premium costs and provider information. Return as JSON array.`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (content) {
      try {
        const parsed = JSON.parse(content);
        // Handle both direct array and object with array property
        const results = Array.isArray(parsed) ? parsed : (parsed.results || parsed.plans || parsed.insurance || []);
        
        if (Array.isArray(results) && results.length > 0) {
          // Validate and clean the results
          const validResults = results.filter(plan => 
            plan.planName && plan.provider && plan.benefits && Array.isArray(plan.benefits)
          ).map(plan => ({
            ...plan,
            premium: typeof plan.premium === 'string' ? parseInt(plan.premium.replace(/[^\d]/g, '')) : plan.premium
          }));
          
          if (validResults.length > 0) {
            insuranceCache.set(cacheKey, validResults, 3600);
            console.log(`[WEB SEARCH] OpenAI insurance search successful, found ${validResults.length} valid plans`);
            return validResults;
          }
        }
      } catch (parseError) {
        console.error('[WEB SEARCH] Failed to parse OpenAI insurance response:', parseError);
      }
    }
    
    return [];
  } catch (error) {
    console.error('[WEB SEARCH] OpenAI insurance search error:', error);
    throw error;
  }
}

// Fallback insurance plans when web search fails or no specific benefits requested
function getFallbackInsurance(): InsurancePlan[] {
  return [
    {
      planName: "DHA Essential Health Plan",
      provider: "Dubai Health Authority",
      premium: 2500,
      benefits: ["general-care", "emergency-services", "specialist-consultations", "diagnostic-tests"]
    },
    {
      planName: "Emirates Comprehensive Health",
      provider: "Emirates Insurance",
      premium: 4200,
      benefits: ["general-care", "emergency-services", "specialist-consultations", "diagnostic-tests", "dental-care", "maternity-care"]
    },
    {
      planName: "AXA Gulf Premium Health",
      provider: "AXA Gulf",
      premium: 6800,
      benefits: ["general-care", "emergency-services", "specialist-consultations", "diagnostic-tests", "dental-care", "maternity-care", "mental-health", "alternative-medicine"]
    },
    {
      planName: "Oman Insurance Health Plus",
      provider: "Oman Insurance Company",
      premium: 3600,
      benefits: ["general-care", "emergency-services", "specialist-consultations", "diagnostic-tests", "chronic-disease-management"]
    },
    {
      planName: "SEHA Network Plan",
      provider: "SEHA",
      premium: 2800,
      benefits: ["general-care", "emergency-services", "specialist-consultations", "preventive-care"]
    },
    {
      planName: "Daman Enhanced Health",
      provider: "Daman Health Insurance",
      premium: 5200,
      benefits: ["general-care", "emergency-services", "specialist-consultations", "diagnostic-tests", "dental-care", "vision-care", "wellness-programs"]
    }
  ];
} 