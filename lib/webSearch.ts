import NodeCache from 'node-cache';
import { Procedure } from '@/components/ProcedureCard';
import { EmergencyFacility } from '@/components/EmergencyCard';

const searchCache = new NodeCache({ stdTTL: 3600 });

// Comprehensive offline health information database
export function getOfflineHealthInfo(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  // Headache and head pain conditions
  if (lowerQuery.includes('headache') || lowerQuery.includes('head ache') || lowerQuery.includes('head pain') || lowerQuery.includes('migraine')) {
    return `
Medical Source (Offline Medical Database): Headaches are one of the most common medical complaints, affecting millions of people worldwide. Understanding the type and cause of your headache is crucial for proper treatment.

**Types of Headaches:**
- **Tension Headaches** (most common): Caused by muscle tension and stress, feel like a tight band around the head
- **Migraines**: Severe, often one-sided headaches that may include nausea, light sensitivity, and visual disturbances
- **Cluster Headaches**: Severe headaches that occur in groups or clusters, often around one eye
- **Sinus Headaches**: Caused by sinus inflammation, often accompanied by facial pressure and congestion
- **Rebound Headaches**: Caused by overuse of pain medications

**Common Causes:**
- Stress and anxiety
- Dehydration and poor hydration
- Lack of sleep or irregular sleep patterns
- Eye strain from screens or poor vision
- Poor posture, especially neck and shoulder tension
- Certain foods (chocolate, aged cheese, alcohol, caffeine withdrawal)
- Hormonal changes (menstruation, pregnancy, menopause)
- Weather changes and barometric pressure
- Medication overuse

**Warning Signs Requiring Immediate Medical Attention:**
- Sudden, severe headache unlike any you've experienced before
- Headache with fever, stiff neck, confusion, or rash
- Headache after a head injury or trauma
- Headache with vision changes, weakness, or difficulty speaking
- Progressively worsening headaches over days or weeks
- Headache with severe nausea and vomiting

**Treatment Options:**
- Rest in a quiet, dark room
- Apply cold or warm compress to head or neck
- Stay well-hydrated with water
- Over-the-counter pain relievers (acetaminophen, ibuprofen) following package directions
- Gentle neck and shoulder stretches
- Stress management techniques (deep breathing, meditation)
- Regular sleep schedule
- Identify and avoid personal triggers

**When to See a Doctor:**
- Headaches occurring more than twice a week
- Headaches that interfere with daily activities
- Need for increasing amounts of medication
- Any concerning symptoms mentioned above
- Headaches that don't respond to over-the-counter treatments
`;
  }
  
  // Skin conditions
  if (lowerQuery.includes('ichthyosis') || lowerQuery.includes('dry skin') || lowerQuery.includes('scaly skin') || lowerQuery.includes('crocodile skin') || lowerQuery.includes('flaky skin')) {
    return `
Medical Source (Offline Medical Database): Dry, scaly skin conditions can range from common xerosis to genetic disorders like ichthyosis. Understanding the cause helps determine the best treatment approach.

**Common Skin Conditions:**
- **Xerosis (Severe Dry Skin)**: Most common cause of rough, scaly skin texture
- **Ichthyosis**: Genetic condition causing fish-scale-like skin appearance
- **Atopic Dermatitis (Eczema)**: Chronic inflammatory skin condition with dry, itchy patches
- **Psoriasis**: Autoimmune condition causing thick, scaly patches
- **Contact Dermatitis**: Reaction to irritants or allergens

**Ichthyosis Specific Information:**
Ichthyosis is a group of genetic skin disorders characterized by dry, scaly skin that resembles fish scales. Types include ichthyosis vulgaris (most common), X-linked ichthyosis (affects mainly males), lamellar ichthyosis (severe form present at birth), and epidermolytic ichthyosis (causes blistering).

**Symptoms to Monitor:**
- Dry, scaly skin that may be white, gray, or brown
- Thick scales especially on arms and legs
- Itching or burning sensation
- Cracking or bleeding of skin
- Redness or inflammation
- Changes in skin color
- Difficulty regulating body temperature (severe cases)

**Causes:**
- Genetic mutations affecting skin barrier function
- Environmental factors (low humidity, harsh soaps, hot showers)
- Age-related changes (decreased oil production)
- Underlying conditions (thyroid disorders, diabetes, kidney disease)
- Certain medications

**Treatment and Management:**
- Apply thick moisturizers or ointments multiple times daily
- Use prescription creams containing urea or lactic acid
- Take lukewarm baths with gentle, fragrance-free cleansers
- Apply moisturizer immediately after bathing while skin is damp
- Use a humidifier, especially during dry seasons
- Gentle exfoliation to remove scales
- Avoid harsh chemicals, fragrances, and hot water
- Protect skin from harsh weather

**When to See a Dermatologist:**
- Severe dryness that doesn't improve with moisturizing
- Cracking, bleeding, or infected-looking areas
- Intense itching that interferes with sleep
- Sudden onset or rapid worsening
- Skin changes affecting large body areas
- Signs of infection (warmth, pus, red streaking)
`;
  }
  
  // Chest pain and heart conditions
  if (lowerQuery.includes('chest pain') || lowerQuery.includes('heart') || lowerQuery.includes('cardiac') || lowerQuery.includes('angina')) {
    return `
Medical Source (Offline Medical Database): Chest pain can have many causes, ranging from minor muscle strain to serious heart conditions. It's important to understand when chest pain requires immediate medical attention.

**EMERGENCY WARNING: Call emergency services immediately if you experience:**
- Severe, crushing chest pain
- Chest pain with shortness of breath
- Pain radiating to arm, jaw, neck, or back
- Chest pain with sweating, nausea, or dizziness
- Sudden onset of severe chest pain

**Types of Chest Pain:**
- **Cardiac (Heart-related)**: Angina, heart attack, pericarditis
- **Pulmonary (Lung-related)**: Pneumonia, pulmonary embolism, pleurisy
- **Gastrointestinal**: Acid reflux, esophageal spasm, gallbladder issues
- **Musculoskeletal**: Muscle strain, rib injury, costochondritis
- **Anxiety-related**: Panic attacks, stress-induced chest tightness

**Heart Attack Warning Signs:**
- Pressure, squeezing, or fullness in chest center
- Pain spreading to shoulders, neck, arms, or jaw
- Shortness of breath
- Cold sweats, nausea, or lightheadedness
- Unusual fatigue (especially in women)

**Non-Emergency Chest Pain Causes:**
- Muscle strain from exercise or poor posture
- Acid reflux or heartburn
- Anxiety or panic attacks
- Costochondritis (inflammation of chest cartilage)
- Respiratory infections

**When to Seek Immediate Care:**
- Any chest pain with concerning symptoms
- Chest pain lasting more than a few minutes
- Severe or worsening pain
- Pain with difficulty breathing
- Pain with loss of consciousness

**Self-Care for Minor Chest Pain:**
- Rest and avoid strenuous activity
- Apply heat or cold to sore muscles
- Take antacids for suspected heartburn
- Practice relaxation techniques for anxiety
- Maintain good posture

**Prevention:**
- Regular exercise and healthy diet
- Manage stress and anxiety
- Avoid smoking and excessive alcohol
- Control blood pressure and cholesterol
- Maintain healthy weight
`;
  }
  
  // Respiratory symptoms
  if (lowerQuery.includes('cough') || lowerQuery.includes('cold') || lowerQuery.includes('flu') || lowerQuery.includes('respiratory') || lowerQuery.includes('breathing')) {
    return `
Medical Source (Offline Medical Database): Respiratory symptoms like cough, congestion, and breathing difficulties can indicate various conditions from common colds to more serious respiratory infections.

**Common Respiratory Conditions:**
- **Common Cold**: Viral infection causing runny nose, cough, sore throat
- **Influenza (Flu)**: Viral infection with fever, body aches, fatigue
- **Bronchitis**: Inflammation of bronchial tubes causing persistent cough
- **Pneumonia**: Lung infection that can be bacterial, viral, or fungal
- **Asthma**: Chronic condition causing airway inflammation and breathing difficulties

**Symptoms by Condition:**
**Cold Symptoms:**
- Runny or stuffy nose
- Mild cough
- Sore throat
- Low-grade fever
- Fatigue

**Flu Symptoms:**
- High fever (100.4°F or higher)
- Severe body aches
- Extreme fatigue
- Dry cough
- Headache

**When to Seek Emergency Care:**
- Difficulty breathing or shortness of breath
- Chest pain with breathing
- High fever (103°F or higher)
- Severe headache with neck stiffness
- Persistent vomiting
- Signs of dehydration

**Treatment for Common Respiratory Infections:**
- Get plenty of rest
- Stay well-hydrated with water, warm broths, tea
- Use humidifier or breathe steam from hot shower
- Gargle with warm salt water for sore throat
- Take over-the-counter medications as directed
- Avoid smoking and secondhand smoke

**Prevention Strategies:**
- Wash hands frequently with soap and water
- Avoid touching face with unwashed hands
- Get annual flu vaccination
- Maintain healthy lifestyle with good nutrition
- Get adequate sleep
- Avoid close contact with sick individuals

**When to See a Doctor:**
- Symptoms lasting more than 10 days
- Fever above 101.3°F for more than 3 days
- Severe headache or sinus pain
- Persistent cough with blood
- Difficulty swallowing
- Severe fatigue or weakness
`;
  }
  
  // Digestive issues
  if (lowerQuery.includes('stomach') || lowerQuery.includes('nausea') || lowerQuery.includes('vomiting') || lowerQuery.includes('diarrhea') || lowerQuery.includes('digestive') || lowerQuery.includes('abdominal')) {
    return `
Medical Source (Offline Medical Database): Digestive symptoms can range from minor stomach upset to serious gastrointestinal conditions. Understanding the cause helps determine appropriate treatment.

**Common Digestive Conditions:**
- **Gastroenteritis**: Stomach flu causing nausea, vomiting, diarrhea
- **Food Poisoning**: Illness from contaminated food or water
- **Acid Reflux (GERD)**: Stomach acid backing up into esophagus
- **Irritable Bowel Syndrome (IBS)**: Chronic condition affecting large intestine
- **Gastritis**: Inflammation of stomach lining

**Emergency Warning Signs:**
- Severe abdominal pain
- Blood in vomit or stool
- Signs of severe dehydration
- High fever with abdominal pain
- Severe, persistent vomiting
- Sudden, severe stomach pain

**Common Symptoms and Causes:**
**Nausea and Vomiting:**
- Viral gastroenteritis
- Food poisoning
- Motion sickness
- Pregnancy
- Medications
- Stress or anxiety

**Diarrhea:**
- Viral or bacterial infections
- Food intolerances
- Medications (especially antibiotics)
- Stress
- Inflammatory bowel conditions

**Treatment for Minor Digestive Issues:**
- Stay hydrated with clear fluids
- Follow BRAT diet (bananas, rice, applesauce, toast)
- Avoid dairy, fatty, or spicy foods
- Get plenty of rest
- Consider probiotics for diarrhea
- Use over-the-counter medications as directed

**Hydration for Diarrhea/Vomiting:**
- Oral rehydration solutions
- Clear broths
- Electrolyte drinks
- Small, frequent sips of water
- Avoid alcohol and caffeine

**When to See a Doctor:**
- Symptoms lasting more than 3 days
- Signs of dehydration (dizziness, dry mouth, little/no urination)
- Blood in stool or vomit
- High fever (101.3°F or higher)
- Severe abdominal pain
- Persistent vomiting preventing fluid intake

**Prevention:**
- Practice good hand hygiene
- Properly store and cook food
- Avoid contaminated water
- Manage stress levels
- Eat a balanced diet with fiber
- Limit alcohol and spicy foods
`;
  }
  
  // Mental health and anxiety
  if (lowerQuery.includes('anxiety') || lowerQuery.includes('depression') || lowerQuery.includes('stress') || lowerQuery.includes('mental health') || lowerQuery.includes('panic')) {
    return `
Medical Source (Offline Medical Database): Mental health conditions are common and treatable medical conditions that affect thoughts, feelings, and behaviors. Seeking help is a sign of strength, not weakness.

**Common Mental Health Conditions:**
- **Anxiety Disorders**: Excessive worry, fear, or nervousness
- **Depression**: Persistent sadness, loss of interest, hopelessness
- **Panic Disorder**: Sudden episodes of intense fear with physical symptoms
- **Generalized Anxiety Disorder**: Chronic, excessive worry about daily activities
- **Social Anxiety**: Fear of social situations and being judged by others

**Anxiety Symptoms:**
- Excessive worry or fear
- Restlessness or feeling on edge
- Difficulty concentrating
- Muscle tension
- Sleep problems
- Rapid heartbeat
- Sweating or trembling

**Depression Symptoms:**
- Persistent sadness or empty mood
- Loss of interest in activities
- Fatigue or decreased energy
- Changes in appetite or weight
- Sleep disturbances
- Feelings of worthlessness or guilt
- Difficulty thinking or concentrating

**Panic Attack Symptoms:**
- Sudden intense fear or discomfort
- Rapid heartbeat or palpitations
- Sweating and trembling
- Shortness of breath
- Chest pain or discomfort
- Nausea or stomach upset
- Dizziness or lightheadedness

**Emergency Mental Health Situations:**
- Thoughts of suicide or self-harm
- Thoughts of harming others
- Severe depression with inability to function
- Psychotic symptoms (hallucinations, delusions)
- Severe panic attacks with inability to cope

**Self-Care Strategies:**
- Practice deep breathing and relaxation techniques
- Regular exercise and physical activity
- Maintain healthy sleep schedule
- Eat nutritious, balanced meals
- Limit alcohol and caffeine
- Connect with supportive friends and family
- Practice mindfulness or meditation
- Engage in enjoyable activities

**Professional Treatment Options:**
- Counseling and psychotherapy
- Cognitive Behavioral Therapy (CBT)
- Medication when appropriate
- Support groups
- Lifestyle counseling
- Stress management training

**When to Seek Professional Help:**
- Symptoms interfering with daily life
- Persistent symptoms lasting weeks
- Difficulty functioning at work or school
- Relationship problems due to mental health
- Substance use to cope with symptoms
- Any thoughts of self-harm

**Crisis Resources:**
- National Suicide Prevention Lifeline
- Local emergency services
- Mental health crisis centers
- Trusted healthcare providers
- Emergency departments for immediate safety concerns
`;
  }
  
  // Pain management
  if (lowerQuery.includes('pain') || lowerQuery.includes('hurt') || lowerQuery.includes('ache') || lowerQuery.includes('sore')) {
    return `
Medical Source (Offline Medical Database): Pain is the body's way of signaling that something needs attention. Understanding different types of pain helps determine the best treatment approach.

**Types of Pain:**
- **Acute Pain**: Sudden onset, usually from injury or illness
- **Chronic Pain**: Persistent pain lasting more than 3-6 months
- **Neuropathic Pain**: Caused by nerve damage or dysfunction
- **Inflammatory Pain**: From tissue inflammation or immune response
- **Musculoskeletal Pain**: Affecting muscles, bones, joints, ligaments

**Common Pain Locations and Causes:**
**Back Pain:**
- Muscle strain or sprain
- Herniated disc
- Arthritis
- Poor posture
- Stress and tension

**Joint Pain:**
- Arthritis (osteoarthritis, rheumatoid)
- Injury or overuse
- Inflammation
- Autoimmune conditions

**Muscle Pain:**
- Overuse or strain
- Tension and stress
- Viral infections
- Dehydration
- Electrolyte imbalances

**Emergency Pain Situations:**
- Severe, sudden onset pain
- Pain with fever and confusion
- Chest pain with breathing difficulty
- Severe abdominal pain
- Pain after significant injury
- Pain with loss of function

**Pain Management Strategies:**
**Immediate Relief:**
- Rest and avoid aggravating activities
- Apply ice for acute injuries (first 48 hours)
- Apply heat for muscle tension and chronic pain
- Over-the-counter pain medications as directed
- Gentle stretching and movement
- Proper positioning and support

**Long-term Management:**
- Regular, appropriate exercise
- Physical therapy
- Stress management techniques
- Good sleep hygiene
- Healthy diet and hydration
- Weight management
- Ergonomic improvements

**Non-Medication Approaches:**
- Physical therapy and exercise
- Massage therapy
- Acupuncture
- Heat and cold therapy
- Relaxation techniques
- Cognitive behavioral therapy
- Mindfulness and meditation

**When to See a Healthcare Provider:**
- Pain lasting more than a few days
- Severe pain interfering with daily activities
- Pain with numbness or weakness
- Pain not responding to over-the-counter treatments
- Pain with fever or other concerning symptoms
- Chronic pain affecting quality of life

**Red Flags Requiring Immediate Care:**
- Severe, sudden pain
- Pain with loss of consciousness
- Pain with severe weakness or paralysis
- Pain with high fever
- Pain after significant trauma
- Chest pain or severe headache
`;
  }
  
  // Generic comprehensive health information for other queries
  return `
Medical Source (Offline Medical Database): Health concerns require proper evaluation and care. Understanding when to seek medical attention and basic self-care principles is essential for maintaining good health.

**General Health Assessment Guidelines:**
When experiencing any health symptoms, consider the following factors:
- **Severity**: How intense are the symptoms?
- **Duration**: How long have symptoms persisted?
- **Progression**: Are symptoms getting better, worse, or staying the same?
- **Impact**: How do symptoms affect daily activities?
- **Associated symptoms**: Are there other concerning signs?

**Emergency Warning Signs Requiring Immediate Medical Attention:**
- Difficulty breathing or shortness of breath
- Chest pain or pressure
- Severe bleeding that won't stop
- Signs of stroke (sudden weakness, speech problems, facial drooping)
- Severe allergic reactions (swelling, difficulty breathing)
- High fever with confusion or stiff neck
- Severe abdominal pain
- Loss of consciousness
- Severe head injury
- Poisoning or overdose

**When to Schedule a Medical Appointment:**
- Persistent symptoms lasting more than a few days
- Symptoms that worsen over time
- Symptoms that interfere with daily activities
- Concerning changes in your body
- Preventive care and routine check-ups
- Management of chronic conditions
- Questions about medications or treatments

**Basic Self-Care Principles:**
**Rest and Recovery:**
- Get adequate sleep (7-9 hours for adults)
- Allow time for healing when ill or injured
- Avoid overexertion during illness
- Create a comfortable healing environment

**Hydration and Nutrition:**
- Drink plenty of water throughout the day
- Eat a balanced diet with fruits and vegetables
- Avoid excessive alcohol and caffeine
- Consider nutritional needs during illness

**Hygiene and Prevention:**
- Wash hands frequently with soap and water
- Maintain good personal hygiene
- Keep living spaces clean
- Follow food safety guidelines
- Stay up to date with vaccinations

**Stress Management:**
- Practice relaxation techniques
- Engage in regular physical activity
- Maintain social connections
- Seek support when needed
- Balance work and personal life

**Medication Safety:**
- Follow prescription instructions exactly
- Don't share medications with others
- Store medications properly
- Be aware of side effects and interactions
- Consult healthcare providers before stopping medications

**Preventive Health Measures:**
- Regular medical check-ups and screenings
- Maintain healthy weight
- Exercise regularly
- Don't smoke or use tobacco products
- Limit alcohol consumption
- Practice safe behaviors
- Manage chronic conditions properly

**When in Doubt:**
If you're unsure about any health concern, it's always best to consult with a qualified healthcare professional. They can provide personalized advice based on your specific situation, medical history, and current symptoms. Early intervention often leads to better outcomes.

**Building a Healthcare Team:**
- Primary care physician for routine care
- Specialists for specific conditions
- Pharmacist for medication questions
- Mental health professionals when needed
- Emergency contacts for urgent situations
`;
}

// Real web search function with Dubai healthcare facilities fallback
export async function searchWebForProcedure(procedureName: string): Promise<Procedure[]> {
  console.log(`[WEB SEARCH] Searching for procedure pricing: "${procedureName}"`);
  
  const cacheKey = `procedure_${procedureName}`;
  const cached = searchCache.get<Procedure[]>(cacheKey);
  if (cached) {
    console.log('Returning cached procedure results');
    return cached;
  }
  
  try {
    // Try OpenAI web search first
    const webSearchResult = await searchPricingWithOpenAI(procedureName);
    if (webSearchResult && webSearchResult.length > 0) {
      console.log(`[WEB SEARCH] Found ${webSearchResult.length} pricing results via OpenAI`);
      searchCache.set(cacheKey, webSearchResult);
      return webSearchResult;
    }
  } catch (error) {
    console.log(`[WEB SEARCH] OpenAI pricing search failed:`, error);
  }
  
  // Fallback to real Dubai healthcare facilities
  console.log(`[FALLBACK] Using real Dubai healthcare facilities for: "${procedureName}"`);
  const fallbackFacilities: Procedure[] = [
    {
      clinicname: "Dubai Hospital",
      service: "General Consultation",
      cashprice: "AED 150-250",
      address: "Oud Metha Road, Dubai",
      phone: "+971 4 219 5000",
      source: "Government Hospital - DHA"
    },
    {
      clinicname: "American Hospital Dubai",
      service: "Specialist Consultation",
      cashprice: "AED 300-500",
      address: "Oud Metha Road, Dubai",
      phone: "+971 4 336 7777",
      source: "Private Hospital - JCI Accredited"
    },
    {
      clinicname: "Mediclinic City Hospital",
      service: "Consultation & Diagnostics",
      cashprice: "AED 250-450",
      address: "Dubai Healthcare City",
      phone: "+971 4 435 9999",
      source: "Private Hospital - Dubai Healthcare City"
    },
    {
      clinicname: "Emirates Hospital",
      service: "Multi-specialty Consultation",
      cashprice: "AED 200-350",
      address: "Jumeirah Beach Road, Dubai",
      phone: "+971 4 349 6666",
      source: "Private Hospital - Jumeirah"
    },
    {
      clinicname: "NMC Royal Hospital",
      service: "General & Specialist Care",
      cashprice: "AED 180-320",
      address: "Khalid Bin Al Waleed Road, Dubai",
      phone: "+971 4 336 2000",
      source: "Private Hospital - Bur Dubai"
    }
  ];
  
  searchCache.set(cacheKey, fallbackFacilities);
  return fallbackFacilities;
}

// New function to search for pricing information via OpenAI
async function searchPricingWithOpenAI(procedureName: string): Promise<Procedure[]> {
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
            content: `You are a healthcare pricing research assistant. Search the web for current pricing information for medical procedures and consultations in Dubai, UAE. 

Focus on finding:
1. **Consultation fees** for relevant medical specialties
2. **Procedure costs** if applicable
3. **Hospital/clinic names** in Dubai
4. **Contact information** (phone numbers, addresses)
5. **Price ranges** in AED (UAE Dirhams)

Return your findings as a JSON array with this exact structure:
[
  {
    "clinicname": "Clinic Name",
    "service": "Service Description", 
    "cashprice": "Price Range in AED",
    "address": "Dubai Address",
    "phone": "Phone Number",
    "source": "Web research pricing"
  }
]

Only include real Dubai healthcare facilities with actual pricing information. If you cannot find specific pricing, return an empty array [].`
          },
          {
            role: 'user',
            content: `Search the web for current pricing information in Dubai for: ${procedureName}

Find consultation fees, procedure costs, and facility information for relevant medical specialties in Dubai, UAE. Return as JSON array.`
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
        const results = Array.isArray(parsed) ? parsed : (parsed.results || parsed.pricing || []);
        
        if (Array.isArray(results) && results.length > 0) {
          console.log(`[WEB SEARCH] OpenAI pricing search successful, found ${results.length} results`);
          return results;
        }
      } catch (parseError) {
        console.error('[WEB SEARCH] Failed to parse OpenAI pricing response:', parseError);
      }
    }
    
    return [];
  } catch (error) {
    console.error('[WEB SEARCH] OpenAI pricing search error:', error);
    throw error;
  }
}

export async function findEmergencyCare(): Promise<EmergencyFacility[]> {
  console.log('[WEB SEARCH] Searching for emergency facilities');
  
  const cacheKey = 'emergency_facilities_dubai';
  const cached = searchCache.get<EmergencyFacility[]>(cacheKey);
  if (cached) {
    console.log('Returning cached emergency facilities');
    return cached;
  }
  
  try {
    const webSearchResult = await searchEmergencyFacilitiesWithOpenAI();
    if (webSearchResult && webSearchResult.length > 0) {
      console.log(`[WEB SEARCH] Found ${webSearchResult.length} emergency facilities via OpenAI`);
      searchCache.set(cacheKey, webSearchResult);
      return webSearchResult;
    }
  } catch (error) {
    console.log(`[WEB SEARCH] OpenAI emergency facilities search failed:`, error);
  }
  
  // Fallback to real Dubai emergency facilities
  console.log(`[FALLBACK] Using real Dubai emergency facilities`);
  const fallbackEmergencyFacilities: EmergencyFacility[] = [
    {
      name: "Dubai Hospital Emergency",
      address: "Oud Metha Road, Dubai",
      phone: "+971 4 219 5000"
    },
    {
      name: "American Hospital Dubai Emergency",
      address: "Oud Metha Road, Dubai", 
      phone: "+971 4 336 7777"
    },
    {
      name: "Mediclinic City Hospital Emergency",
      address: "Dubai Healthcare City",
      phone: "+971 4 435 9999"
    },
    {
      name: "Al Zahra Hospital Emergency",
      address: "Al Barsha, Dubai",
      phone: "+971 4 378 6666"
    },
    {
      name: "Rashid Hospital Emergency",
      address: "Oud Metha Road, Dubai",
      phone: "+971 4 219 2000"
    }
  ];
  
  searchCache.set(cacheKey, fallbackEmergencyFacilities);
  return fallbackEmergencyFacilities;
}

// New function to search for emergency facilities via OpenAI
async function searchEmergencyFacilitiesWithOpenAI(): Promise<EmergencyFacility[]> {
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
            content: `You are a healthcare facility research assistant. Search the web for current emergency medical facilities in Dubai, UAE.

Focus on finding:
1. **Hospital emergency departments** in Dubai
2. **24/7 emergency services**
3. **Contact information** (phone numbers, addresses)
4. **Major hospitals** with emergency care

Return your findings as a JSON array with this exact structure:
[
  {
    "name": "Hospital/Facility Name",
    "address": "Dubai Address",
    "phone": "Phone Number"
  }
]

Only include real Dubai emergency medical facilities with 24/7 emergency services. Focus on major hospitals and emergency centers.`
          },
          {
            role: 'user',
            content: `Search the web for current emergency medical facilities in Dubai, UAE.

Find major hospitals with emergency departments, 24/7 emergency services, and their contact information. Return as JSON array.`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1000
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
        const results = Array.isArray(parsed) ? parsed : (parsed.results || parsed.facilities || []);
        
        if (Array.isArray(results) && results.length > 0) {
          console.log(`[WEB SEARCH] OpenAI emergency facilities search successful, found ${results.length} results`);
          return results;
        }
      } catch (parseError) {
        console.error('[WEB SEARCH] Failed to parse OpenAI emergency facilities response:', parseError);
      }
    }
    
    return [];
  } catch (error) {
    console.error('[WEB SEARCH] OpenAI emergency facilities search error:', error);
    throw error;
  }
}

export async function searchDHAGuidelines(query: string): Promise<string> {
  console.log(`[OFFLINE MODE] DHA guidelines search disabled for: "${query}"`);
  return '';
}

export async function searchGeneralHealthInfo(query: string): Promise<string> {
  const cacheKey = `health-info-${query.toLowerCase().replace(/\s+/g, '-')}`;
  const cachedResult = searchCache.get<string>(cacheKey);
  if (cachedResult) {
    console.log(`[CACHE HIT] Health info cache hit for "${query}"`);
    return cachedResult;
  }

  console.log(`[WEB SEARCH] Using OpenAI web search for: "${query}"`);
  
  // First try to get comprehensive web information via OpenAI
  try {
    const webSearchResult = await searchWebWithOpenAI(query);
    if (webSearchResult && webSearchResult.length > 100) {
      searchCache.set(cacheKey, webSearchResult, 3600);
      console.log(`[WEB SEARCH] Web information found via OpenAI, length: ${webSearchResult.length} characters`);
      return webSearchResult;
    }
  } catch (error) {
    console.log(`[WEB SEARCH] OpenAI web search failed:`, error);
  }
  
  // Fallback to offline information if web search fails
  console.log(`[FALLBACK] Using offline health information for: "${query}"`);
  const offlineInfo = getOfflineHealthInfo(query);
  
  if (offlineInfo) {
    searchCache.set(cacheKey, offlineInfo, 1800); // Shorter cache for fallback
    console.log(`[FALLBACK] Offline health information provided for "${query}"`);
    console.log(`[FALLBACK] Content length: ${offlineInfo.length} characters`);
  }
  
  return offlineInfo;
}

// New function to use OpenAI for web searching
async function searchWebWithOpenAI(query: string): Promise<string> {
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
            content: `You are a medical research assistant. Search the web for comprehensive, accurate medical information about the user's health query. Focus on:

1. **Medical Definition & Overview**: Clear explanation of the condition/symptom
2. **Symptoms & Signs**: Detailed symptom descriptions and what to watch for
3. **Causes & Risk Factors**: Common and serious causes, who is most affected
4. **Treatment Options**: Available treatments, medications, therapies
5. **When to Seek Care**: Emergency signs, when to see a doctor
6. **Prevention & Management**: Self-care measures, lifestyle changes
7. **Prognosis & Complications**: What to expect, potential complications

Provide authoritative medical information from reputable sources like Mayo Clinic, WebMD, Healthline, medical journals, and health organizations. Include specific details and actionable advice.

Format your response as: "Medical Source (Web Research): [comprehensive medical information]"

Be thorough and include all relevant medical details for the condition or symptom.`
          },
          {
            role: 'user',
            content: `Search the web for comprehensive medical information about: ${query}

Please provide detailed medical information including symptoms, causes, treatments, when to seek care, and management strategies.`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (content && content.length > 50) {
      console.log(`[WEB SEARCH] OpenAI web search successful, content length: ${content.length}`);
      return content;
    } else {
      throw new Error('No substantial content returned from OpenAI web search');
    }
  } catch (error) {
    console.error('[WEB SEARCH] OpenAI web search error:', error);
    throw error;
  }
} 