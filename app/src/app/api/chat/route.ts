import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { searchWebForProcedure, findEmergencyCare, searchGeneralHealthInfo } from '@/lib/webSearch';
import { getInsuranceInfo } from '@/lib/insurance';
import type { InsurancePlan } from '@/lib/insurance';
import type { EmergencyFacility } from '@/components/EmergencyCard';
import type { Procedure } from '@/components/ProcedureCard';
// import { getSheetData } from '@/lib/googleSheets'; // Temporarily disabled

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Context-aware facilities based on health queries
const getContextualFacilities = (query: string, isEmergency: boolean): EmergencyFacility[] => {
  const lowerQuery = query.toLowerCase();
  
  if (isEmergency) {
    return [
      {
        name: "Dubai Hospital Emergency Department",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 219 5000"
      },
      {
        name: "American Hospital Dubai Emergency",
        address: "Oud Metha Road, Dubai", 
        phone: "+971 4 336 7777"
      },
      {
        name: "NMC Royal Hospital Emergency",
        address: "Al Garhoud, Dubai",
        phone: "+971 4 267 0000"
      }
    ];
  }
  
  // Cosmetic/Aesthetic procedures
  if (lowerQuery.includes('boob') || lowerQuery.includes('breast') || lowerQuery.includes('plastic') || 
      lowerQuery.includes('cosmetic') || lowerQuery.includes('aesthetic') || lowerQuery.includes('botox') ||
      lowerQuery.includes('filler') || lowerQuery.includes('liposuction')) {
    return [
      {
        name: "Dubai Cosmetic Surgery Clinic",
        address: "Jumeirah Beach Road, Dubai",
        phone: "+971 4 348 8262"
      },
      {
        name: "American Academy of Cosmetic Surgery",
        address: "Dubai Healthcare City",
        phone: "+971 4 429 8136"
      },
      {
        name: "Bizrahmed Aesthetic Clinic",
        address: "Multiple locations in Dubai",
        phone: "+971 4 348 5575"
      }
    ];
  }
  
  // IV therapy, hydration, wellness
  if (lowerQuery.includes('iv') || lowerQuery.includes('drip') || lowerQuery.includes('hydration') || 
      lowerQuery.includes('vitamin') || lowerQuery.includes('wellness') || lowerQuery.includes('hangover') || lowerQuery.includes('nutrition')) {
    return [
      {
        name: "IV Therapy Dubai",
        address: "DIFC, Dubai",
        phone: "+971 50 123 4567"
      },
      {
        name: "Restore Hydration Therapy",
        address: "JLT, Dubai", 
        phone: "+971 4 567 8910"
      },
      {
        name: "Revive IV Wellness",
        address: "Downtown Dubai",
        phone: "+971 55 987 6543"
      }
    ];
  }
  
  // Dental procedures
  if (lowerQuery.includes('dental') || lowerQuery.includes('tooth') || lowerQuery.includes('teeth') ||
      lowerQuery.includes('dentist') || lowerQuery.includes('oral')) {
    return [
      {
        name: "Dr. Michael's Dental Clinic",
        address: "Jumeirah Beach Road, Dubai",
        phone: "+971 4 344 1800"
      },
      {
        name: "Dubai Dental Hospital",
        address: "Oud Metha, Dubai",
        phone: "+971 4 337 7766"
      },
      {
        name: "German Dental Oasis",
        address: "Dubai Healthcare City",
        phone: "+971 4 429 9989"
      }
    ];
  }
  
  // Mental health/therapy
  if (lowerQuery.includes('mental') || lowerQuery.includes('therapy') || lowerQuery.includes('depression') ||
      lowerQuery.includes('anxiety') || lowerQuery.includes('stress') || lowerQuery.includes('counseling')) {
    return [
      {
        name: "German Neuroscience Center",
        address: "Dubai Healthcare City",
        phone: "+971 4 429 8989"
      },
      {
        name: "Priory Wellbeing Centre",
        address: "Al Wasl Road, Dubai",
        phone: "+971 4 245 3800"
      },
      {
        name: "Light House Arabia",
        address: "Umm Suqeim, Dubai",
        phone: "+971 4 380 9944"
      }
    ];
  }
  
  // Dermatology/Skin conditions
  if (lowerQuery.includes('skin') || lowerQuery.includes('dermat') || lowerQuery.includes('acne') ||
      lowerQuery.includes('rash') || lowerQuery.includes('eczema') || lowerQuery.includes('psoriasis') ||
      lowerQuery.includes('dry') || lowerQuery.includes('itchy') || lowerQuery.includes('texture') ||
      lowerQuery.includes('crocodile') || lowerQuery.includes('scaly') || lowerQuery.includes('flaky') ||
      lowerQuery.includes('mole') || lowerQuery.includes('wart') || lowerQuery.includes('fungal') ||
      lowerQuery.includes('hives') || lowerQuery.includes('allergy') || lowerQuery.includes('sunburn') ||
      lowerQuery.includes('ichthyosis') || lowerQuery.includes('ichtyosis')) {
    return [
      {
        name: "Dubai Dermatology Clinic",
        address: "Jumeirah Beach Road, Dubai",
        phone: "+971 4 394 7777"
      },
      {
        name: "German Dermatology Center",
        address: "Dubai Healthcare City",
        phone: "+971 4 429 8450"
      },
      {
        name: "Dermacare Skin Clinic",
        address: "Al Wasl Road, Dubai",
        phone: "+971 4 344 4004"
      }
    ];
  }

  // Cardiology & Heart conditions
  if (lowerQuery.includes('heart') || lowerQuery.includes('chest') || lowerQuery.includes('cardiac') ||
      lowerQuery.includes('blood pressure') || lowerQuery.includes('cholesterol') || lowerQuery.includes('palpitation') ||
      lowerQuery.includes('arrhythmia') || lowerQuery.includes('hypertension') || lowerQuery.includes('angina')) {
    return [
      {
        name: "American Hospital Dubai - Cardiology",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777"
      },
      {
        name: "Mediclinic City Hospital - Heart Center",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999"
      },
      {
        name: "Dubai Heart Center",
        address: "Al Garhoud, Dubai",
        phone: "+971 4 294 7777"
      }
    ];
  }

  // Orthopedics/Sports medicine/Musculoskeletal
  if (lowerQuery.includes('bone') || lowerQuery.includes('joint') || lowerQuery.includes('muscle') ||
      lowerQuery.includes('back') || lowerQuery.includes('knee') || lowerQuery.includes('shoulder') ||
      lowerQuery.includes('sports') || lowerQuery.includes('injury') || lowerQuery.includes('fracture') ||
      lowerQuery.includes('arthritis') || lowerQuery.includes('spine') || lowerQuery.includes('hip') ||
      lowerQuery.includes('ankle') || lowerQuery.includes('wrist') || lowerQuery.includes('neck') ||
      lowerQuery.includes('ligament') || lowerQuery.includes('tendon') || lowerQuery.includes('sprain')) {
    return [
      {
        name: "Dubai Bone & Joint Center",
        address: "Al Wasl Road, Dubai",
        phone: "+971 4 349 6666"
      },
      {
        name: "American Hospital - Orthopedics",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777"
      },
      {
        name: "Mediclinic Parkview Hospital",
        address: "Al Barsha, Dubai",
        phone: "+971 4 375 5500"
      }
    ];
  }

  // Women's health/Gynecology/Obstetrics
  if (lowerQuery.includes('women') || lowerQuery.includes('gynec') || lowerQuery.includes('pregnancy') ||
      lowerQuery.includes('period') || lowerQuery.includes('menstrual') || lowerQuery.includes('fertility') ||
      lowerQuery.includes('breast') || lowerQuery.includes('ovarian') || lowerQuery.includes('cervical') ||
      lowerQuery.includes('pap smear') || lowerQuery.includes('mammogram') || lowerQuery.includes('prenatal') ||
      lowerQuery.includes('postpartum') || lowerQuery.includes('contraception') || lowerQuery.includes('menopause')) {
    return [
      {
        name: "Mediclinic City Hospital - Women's Health",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999"
      },
      {
        name: "American Hospital - Women's Center",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777"
      },
      {
        name: "Welcare Hospital",
        address: "Al Garhoud, Dubai",
        phone: "+971 4 282 7788"
      }
    ];
  }

  // Pediatrics/Children's health
  if (lowerQuery.includes('child') || lowerQuery.includes('baby') || lowerQuery.includes('infant') ||
      lowerQuery.includes('pediatric') || lowerQuery.includes('kid') || lowerQuery.includes('toddler') ||
      lowerQuery.includes('vaccination') || lowerQuery.includes('immunization') || lowerQuery.includes('growth') ||
      lowerQuery.includes('development') || lowerQuery.includes('newborn') || lowerQuery.includes('adolescent')) {
    return [
      {
        name: "Dubai Hospital - Pediatrics",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 219 5000"
      },
      {
        name: "Mediclinic City Hospital - Children's Clinic",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999"
      },
      {
        name: "Al Jalila Children's Specialty Hospital",
        address: "Al Jaddaf, Dubai",
        phone: "+971 4 837 0000"
      }
    ];
  }

  // Eye care/Ophthalmology/Vision
  if (lowerQuery.includes('eye') || lowerQuery.includes('vision') || lowerQuery.includes('sight') ||
      lowerQuery.includes('ophthalmology') || lowerQuery.includes('glasses') || lowerQuery.includes('contact') ||
      lowerQuery.includes('cataract') || lowerQuery.includes('glaucoma') || lowerQuery.includes('retina') ||
      lowerQuery.includes('blind') || lowerQuery.includes('blurry') || lowerQuery.includes('double vision')) {
    return [
      {
        name: "Moorfields Eye Hospital Dubai",
        address: "Dubai Healthcare City",
        phone: "+971 4 429 7888"
      },
      {
        name: "American Hospital - Eye Center",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777"
      },
      {
        name: "Dubai Eye Clinic",
        address: "Jumeirah Beach Road, Dubai",
        phone: "+971 4 394 7979"
      }
    ];
  }

  // ENT (Ear, Nose, Throat)
  if (lowerQuery.includes('ear') || lowerQuery.includes('nose') || lowerQuery.includes('throat') ||
      lowerQuery.includes('sinus') || lowerQuery.includes('hearing') || lowerQuery.includes('tonsil') ||
      lowerQuery.includes('voice') || lowerQuery.includes('snoring') || lowerQuery.includes('allergy') ||
      lowerQuery.includes('congestion') || lowerQuery.includes('vertigo') || lowerQuery.includes('tinnitus')) {
    return [
      {
        name: "American Hospital - ENT Department",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777"
      },
      {
        name: "Mediclinic City Hospital - ENT",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999"
      },
      {
        name: "Dubai ENT Clinic",
        address: "Jumeirah Beach Road, Dubai",
        phone: "+971 4 394 8888"
      }
    ];
  }

  // Gastroenterology/Digestive health
  if (lowerQuery.includes('stomach') || lowerQuery.includes('digestive') || lowerQuery.includes('gastro') ||
      lowerQuery.includes('liver') || lowerQuery.includes('intestine') || lowerQuery.includes('colon') ||
      lowerQuery.includes('acid reflux') || lowerQuery.includes('ulcer') || lowerQuery.includes('ibs') ||
      lowerQuery.includes('crohn') || lowerQuery.includes('hepatitis') || lowerQuery.includes('gallbladder') ||
      lowerQuery.includes('nausea') || lowerQuery.includes('vomiting') || lowerQuery.includes('diarrhea') ||
      lowerQuery.includes('constipation') || lowerQuery.includes('abdominal') || lowerQuery.includes('bloating')) {
    return [
      {
        name: "American Hospital - Gastroenterology",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777"
      },
      {
        name: "Mediclinic City Hospital - GI Center",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999"
      },
      {
        name: "Dubai Gastroenterology Clinic",
        address: "Al Wasl Road, Dubai",
        phone: "+971 4 349 7777"
      }
    ];
  }

  // Neurology/Neurological conditions
  if (lowerQuery.includes('brain') || lowerQuery.includes('neuro') || lowerQuery.includes('headache') ||
      lowerQuery.includes('migraine') || lowerQuery.includes('seizure') || lowerQuery.includes('stroke') ||
      lowerQuery.includes('epilepsy') || lowerQuery.includes('parkinson') || lowerQuery.includes('alzheimer') ||
      lowerQuery.includes('memory') || lowerQuery.includes('tremor') || lowerQuery.includes('numbness') ||
      lowerQuery.includes('tingling') || lowerQuery.includes('dizziness') || lowerQuery.includes('balance')) {
    return [
      {
        name: "German Neuroscience Center",
        address: "Dubai Healthcare City",
        phone: "+971 4 429 8989"
      },
      {
        name: "American Hospital - Neurology",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777"
      },
      {
        name: "Mediclinic City Hospital - Neurology",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999"
      }
    ];
  }

  // Urology/Kidney/Bladder
  if (lowerQuery.includes('kidney') || lowerQuery.includes('bladder') || lowerQuery.includes('urology') ||
      lowerQuery.includes('urinary') || lowerQuery.includes('prostate') || lowerQuery.includes('stone') ||
      lowerQuery.includes('incontinence') || lowerQuery.includes('uti') || lowerQuery.includes('erectile') ||
      lowerQuery.includes('fertility') || lowerQuery.includes('testosterone') || lowerQuery.includes('dialysis')) {
    return [
      {
        name: "American Hospital - Urology",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777"
      },
      {
        name: "Mediclinic City Hospital - Urology",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999"
      },
      {
        name: "Dubai Urology Center",
        address: "Al Wasl Road, Dubai",
        phone: "+971 4 349 8888"
      }
    ];
  }

  // Endocrinology/Diabetes/Hormones
  if (lowerQuery.includes('diabetes') || lowerQuery.includes('thyroid') || lowerQuery.includes('hormone') ||
      lowerQuery.includes('endocrine') || lowerQuery.includes('insulin') || lowerQuery.includes('glucose') ||
      lowerQuery.includes('metabolism') || lowerQuery.includes('weight') || lowerQuery.includes('obesity') ||
      lowerQuery.includes('pcos') || lowerQuery.includes('adrenal') || lowerQuery.includes('growth hormone')) {
    return [
      {
        name: "American Hospital - Endocrinology",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777"
      },
      {
        name: "Mediclinic City Hospital - Diabetes Center",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999"
      },
      {
        name: "Dubai Diabetes Center",
        address: "Al Garhoud, Dubai",
        phone: "+971 4 294 8888"
      }
    ];
  }

  // Oncology/Cancer
  if (lowerQuery.includes('cancer') || lowerQuery.includes('oncology') || lowerQuery.includes('tumor') ||
      lowerQuery.includes('chemotherapy') || lowerQuery.includes('radiation') || lowerQuery.includes('biopsy') ||
      lowerQuery.includes('lymphoma') || lowerQuery.includes('leukemia') || lowerQuery.includes('metastasis') ||
      lowerQuery.includes('malignant') || lowerQuery.includes('benign') || lowerQuery.includes('screening')) {
    return [
      {
        name: "American Hospital - Oncology Center",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777"
      },
      {
        name: "Mediclinic City Hospital - Cancer Center",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999"
      },
      {
        name: "Dubai Cancer Center",
        address: "Al Barsha, Dubai",
        phone: "+971 4 375 8888"
      }
    ];
  }

  // Pulmonology/Respiratory/Lung
  if (lowerQuery.includes('lung') || lowerQuery.includes('breathing') || lowerQuery.includes('respiratory') ||
      lowerQuery.includes('asthma') || lowerQuery.includes('copd') || lowerQuery.includes('pneumonia') ||
      lowerQuery.includes('bronchitis') || lowerQuery.includes('cough') || lowerQuery.includes('shortness') ||
      lowerQuery.includes('wheezing') || lowerQuery.includes('tuberculosis') || lowerQuery.includes('sleep apnea')) {
    return [
      {
        name: "American Hospital - Pulmonology",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777"
      },
      {
        name: "Mediclinic City Hospital - Respiratory Center",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999"
      },
      {
        name: "Dubai Chest Disease Hospital",
        address: "Al Qusais, Dubai",
        phone: "+971 4 271 0000"
      }
    ];
  }

  // Rheumatology/Autoimmune
  if (lowerQuery.includes('rheumatology') || lowerQuery.includes('arthritis') || lowerQuery.includes('lupus') ||
      lowerQuery.includes('autoimmune') || lowerQuery.includes('fibromyalgia') || lowerQuery.includes('gout') ||
      lowerQuery.includes('inflammatory') || lowerQuery.includes('connective tissue') || lowerQuery.includes('vasculitis')) {
    return [
      {
        name: "American Hospital - Rheumatology",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777"
      },
      {
        name: "Mediclinic City Hospital - Rheumatology",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999"
      },
      {
        name: "Dubai Rheumatology Center",
        address: "Al Wasl Road, Dubai",
        phone: "+971 4 349 9999"
      }
    ];
  }

  // Infectious Diseases/Travel Medicine
  if (lowerQuery.includes('infection') || lowerQuery.includes('fever') || lowerQuery.includes('travel') ||
      lowerQuery.includes('vaccination') || lowerQuery.includes('malaria') || lowerQuery.includes('hepatitis') ||
      lowerQuery.includes('hiv') || lowerQuery.includes('std') || lowerQuery.includes('tropical') ||
      lowerQuery.includes('food poisoning') || lowerQuery.includes('antibiotic') || lowerQuery.includes('sepsis')) {
    return [
      {
        name: "Dubai Hospital - Infectious Diseases",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 219 5000"
      },
      {
        name: "American Hospital - Travel Medicine",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777"
      },
      {
        name: "Mediclinic City Hospital - Internal Medicine",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999"
      }
    ];
  }
  
  // Default general healthcare facilities
  return [
    {
      name: "Mediclinic City Hospital",
      address: "Dubai Healthcare City",
      phone: "+971 4 435 9999"
    },
    {
      name: "Dubai Hospital",
      address: "Oud Metha Road, Dubai",
      phone: "+971 4 219 5000"
    },
    {
      name: "American Hospital Dubai",
      address: "Oud Metha Road, Dubai",
      phone: "+971 4 336 7777"
    }
  ];
};

// Context-aware pricing based on health queries
const getContextualPricing = (query: string): Procedure[] => {
  const lowerQuery = query.toLowerCase();
  
  // Emergency procedures
  if (lowerQuery.includes('cut') || lowerQuery.includes('wound') || lowerQuery.includes('bleeding') ||
      lowerQuery.includes('injury') || lowerQuery.includes('accident')) {
    return [
      {
        clinicname: "Dubai Hospital Emergency",
        service: "Emergency Wound Treatment",
        cashprice: "500-1,500 AED",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 219 5000",
        source: "Emergency care pricing"
      },
      {
        clinicname: "American Hospital Emergency", 
        service: "Emergency Consultation & Suturing",
        cashprice: "800-2,000 AED",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777",
        source: "Emergency care pricing"
      }
    ];
  }
  
  // Cosmetic procedures
  if (lowerQuery.includes('boob') || lowerQuery.includes('breast') || lowerQuery.includes('cosmetic')) {
    return [
      {
        clinicname: "Dubai Cosmetic Surgery Clinic",
        service: "Breast Augmentation Consultation",
        cashprice: "300-500 AED (consultation)",
        address: "Jumeirah Beach Road, Dubai",
        phone: "+971 4 348 8262",
        source: "Cosmetic surgery pricing"
      },
      {
        clinicname: "American Academy of Cosmetic Surgery",
        service: "Breast Enhancement Procedure",
        cashprice: "15,000-25,000 AED (full procedure)",
        address: "Dubai Healthcare City",
        phone: "+971 4 429 8136",
        source: "Cosmetic surgery pricing"
      }
    ];
  }
  
  // IV therapy
  if (lowerQuery.includes('iv') || lowerQuery.includes('drip') || lowerQuery.includes('hydration') || lowerQuery.includes('wellness') || lowerQuery.includes('nutrition')) {
    return [
      {
        clinicname: "IV Therapy Dubai",
        service: "Hydration IV Drip",
        cashprice: "350-600 AED",
        address: "DIFC, Dubai",
        phone: "+971 50 123 4567",
        source: "IV therapy pricing"
      },
      {
        clinicname: "Restore Hydration Therapy",
        service: "Vitamin B12 IV Treatment",
        cashprice: "400-700 AED",
        address: "JLT, Dubai",
        phone: "+971 4 567 8910",
        source: "IV therapy pricing"
      }
    ];
  }
  
  // Dental procedures
  if (lowerQuery.includes('dental') || lowerQuery.includes('tooth') || lowerQuery.includes('teeth')) {
    return [
      {
        clinicname: "Dr. Michael's Dental Clinic",
        service: "Dental Consultation & Cleaning",
        cashprice: "200-400 AED",
        address: "Jumeirah Beach Road, Dubai",
        phone: "+971 4 344 1800",
        source: "Dental care pricing"
      },
      {
        clinicname: "Dubai Dental Hospital",
        service: "Comprehensive Dental Examination",
        cashprice: "300-500 AED",
        address: "Oud Metha, Dubai",
        phone: "+971 4 337 7766",
        source: "Dental care pricing"
      }
    ];
  }
  
  // Dermatology procedures
  if (lowerQuery.includes('skin') || lowerQuery.includes('dermat') || lowerQuery.includes('acne') ||
      lowerQuery.includes('rash') || lowerQuery.includes('eczema') || lowerQuery.includes('psoriasis') ||
      lowerQuery.includes('dry') || lowerQuery.includes('itchy') || lowerQuery.includes('texture') ||
      lowerQuery.includes('crocodile') || lowerQuery.includes('scaly') || lowerQuery.includes('flaky') ||
      lowerQuery.includes('mole') || lowerQuery.includes('wart') || lowerQuery.includes('fungal') ||
      lowerQuery.includes('hives') || lowerQuery.includes('allergy') || lowerQuery.includes('sunburn') ||
      lowerQuery.includes('ichthyosis') || lowerQuery.includes('ichtyosis')) {
    return [
      {
        clinicname: "Dubai Dermatology Clinic",
        service: "Dermatology Consultation",
        cashprice: "300-500 AED",
        address: "Jumeirah Beach Road, Dubai",
        phone: "+971 4 394 7777",
        source: "Dermatology pricing"
      },
      {
        clinicname: "German Dermatology Center",
        service: "Skin Condition Assessment",
        cashprice: "400-600 AED",
        address: "Dubai Healthcare City",
        phone: "+971 4 429 8450",
        source: "Dermatology pricing"
      },
      {
        clinicname: "Dermacare Skin Clinic",
        service: "Comprehensive Skin Examination",
        cashprice: "250-450 AED",
        address: "Al Wasl Road, Dubai",
        phone: "+971 4 344 4004",
        source: "Dermatology pricing"
      }
    ];
  }

  // Cardiology procedures
  if (lowerQuery.includes('heart') || lowerQuery.includes('chest') || lowerQuery.includes('cardiac') ||
      lowerQuery.includes('blood pressure') || lowerQuery.includes('cholesterol') || lowerQuery.includes('palpitation') ||
      lowerQuery.includes('arrhythmia') || lowerQuery.includes('hypertension') || lowerQuery.includes('angina')) {
    return [
      {
        clinicname: "American Hospital Dubai - Cardiology",
        service: "Cardiology Consultation",
        cashprice: "400-700 AED",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777",
        source: "Cardiology pricing"
      },
      {
        clinicname: "Mediclinic City Hospital - Heart Center",
        service: "ECG & Heart Assessment",
        cashprice: "350-600 AED",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999",
        source: "Cardiology pricing"
      },
      {
        clinicname: "Dubai Heart Center",
        service: "Comprehensive Cardiac Evaluation",
        cashprice: "500-800 AED",
        address: "Al Garhoud, Dubai",
        phone: "+971 4 294 7777",
        source: "Cardiology pricing"
      }
    ];
  }

  // Orthopedics/Sports medicine
  if (lowerQuery.includes('bone') || lowerQuery.includes('joint') || lowerQuery.includes('muscle') ||
      lowerQuery.includes('back') || lowerQuery.includes('knee') || lowerQuery.includes('shoulder') ||
      lowerQuery.includes('sports') || lowerQuery.includes('injury') || lowerQuery.includes('fracture') ||
      lowerQuery.includes('arthritis') || lowerQuery.includes('spine') || lowerQuery.includes('hip') ||
      lowerQuery.includes('ankle') || lowerQuery.includes('wrist') || lowerQuery.includes('neck') ||
      lowerQuery.includes('ligament') || lowerQuery.includes('tendon') || lowerQuery.includes('sprain')) {
    return [
      {
        clinicname: "Dubai Bone & Joint Center",
        service: "Orthopedic Consultation",
        cashprice: "350-600 AED",
        address: "Al Wasl Road, Dubai",
        phone: "+971 4 349 6666",
        source: "Orthopedic pricing"
      },
      {
        clinicname: "American Hospital - Orthopedics",
        service: "Sports Medicine Consultation",
        cashprice: "400-700 AED",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777",
        source: "Orthopedic pricing"
      },
      {
        clinicname: "Mediclinic Parkview Hospital",
        service: "Joint & Bone Assessment",
        cashprice: "300-550 AED",
        address: "Al Barsha, Dubai",
        phone: "+971 4 375 5500",
        source: "Orthopedic pricing"
      }
    ];
  }

  // Women's health/Gynecology
  if (lowerQuery.includes('women') || lowerQuery.includes('gynec') || lowerQuery.includes('pregnancy') ||
      lowerQuery.includes('period') || lowerQuery.includes('menstrual') || lowerQuery.includes('fertility') ||
      lowerQuery.includes('breast') || lowerQuery.includes('ovarian') || lowerQuery.includes('cervical') ||
      lowerQuery.includes('pap smear') || lowerQuery.includes('mammogram') || lowerQuery.includes('prenatal') ||
      lowerQuery.includes('postpartum') || lowerQuery.includes('contraception') || lowerQuery.includes('menopause')) {
    return [
      {
        clinicname: "Mediclinic City Hospital - Women's Health",
        service: "Gynecology Consultation",
        cashprice: "350-600 AED",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999",
        source: "Women's health pricing"
      },
      {
        clinicname: "American Hospital - Women's Center",
        service: "Obstetrics & Gynecology",
        cashprice: "400-700 AED",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777",
        source: "Women's health pricing"
      },
      {
        clinicname: "Welcare Hospital",
        service: "Prenatal Care & Women's Health",
        cashprice: "300-550 AED",
        address: "Al Garhoud, Dubai",
        phone: "+971 4 282 7788",
        source: "Women's health pricing"
      }
    ];
  }

  // Pediatrics/Children's health
  if (lowerQuery.includes('child') || lowerQuery.includes('baby') || lowerQuery.includes('infant') ||
      lowerQuery.includes('pediatric') || lowerQuery.includes('kid') || lowerQuery.includes('toddler') ||
      lowerQuery.includes('vaccination') || lowerQuery.includes('immunization') || lowerQuery.includes('growth') ||
      lowerQuery.includes('development') || lowerQuery.includes('newborn') || lowerQuery.includes('adolescent')) {
    return [
      {
        clinicname: "Dubai Hospital - Pediatrics",
        service: "Pediatric Consultation",
        cashprice: "250-450 AED",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 219 5000",
        source: "Pediatric pricing"
      },
      {
        clinicname: "Mediclinic City Hospital - Children's Clinic",
        service: "Child Health Assessment",
        cashprice: "300-500 AED",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999",
        source: "Pediatric pricing"
      },
      {
        clinicname: "Al Jalila Children's Specialty Hospital",
        service: "Specialized Pediatric Care",
        cashprice: "400-650 AED",
        address: "Al Jaddaf, Dubai",
        phone: "+971 4 837 0000",
        source: "Pediatric pricing"
      }
    ];
  }

  // Eye care/Ophthalmology
  if (lowerQuery.includes('eye') || lowerQuery.includes('vision') || lowerQuery.includes('sight') ||
      lowerQuery.includes('ophthalmology') || lowerQuery.includes('glasses') || lowerQuery.includes('contact') ||
      lowerQuery.includes('cataract') || lowerQuery.includes('glaucoma') || lowerQuery.includes('retina') ||
      lowerQuery.includes('blind') || lowerQuery.includes('blurry') || lowerQuery.includes('double vision')) {
    return [
      {
        clinicname: "Moorfields Eye Hospital Dubai",
        service: "Comprehensive Eye Examination",
        cashprice: "400-700 AED",
        address: "Dubai Healthcare City",
        phone: "+971 4 429 7888",
        source: "Ophthalmology pricing"
      },
      {
        clinicname: "American Hospital - Eye Center",
        service: "Vision Assessment & Eye Care",
        cashprice: "350-600 AED",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777",
        source: "Ophthalmology pricing"
      },
      {
        clinicname: "Dubai Eye Clinic",
        service: "Eye Consultation & Treatment",
        cashprice: "300-550 AED",
        address: "Jumeirah Beach Road, Dubai",
        phone: "+971 4 394 7979",
        source: "Ophthalmology pricing"
      }
    ];
  }

  // ENT (Ear, Nose, Throat)
  if (lowerQuery.includes('ear') || lowerQuery.includes('nose') || lowerQuery.includes('throat') ||
      lowerQuery.includes('sinus') || lowerQuery.includes('hearing') || lowerQuery.includes('tonsil') ||
      lowerQuery.includes('voice') || lowerQuery.includes('snoring') || lowerQuery.includes('allergy') ||
      lowerQuery.includes('congestion') || lowerQuery.includes('vertigo') || lowerQuery.includes('tinnitus')) {
    return [
      {
        clinicname: "American Hospital - ENT Department",
        service: "ENT Consultation",
        cashprice: "350-600 AED",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777",
        source: "ENT pricing"
      },
      {
        clinicname: "Mediclinic City Hospital - ENT",
        service: "Ear, Nose & Throat Assessment",
        cashprice: "300-550 AED",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999",
        source: "ENT pricing"
      },
      {
        clinicname: "Dubai ENT Clinic",
        service: "Specialized ENT Care",
        cashprice: "280-500 AED",
        address: "Jumeirah Beach Road, Dubai",
        phone: "+971 4 394 8888",
        source: "ENT pricing"
      }
    ];
  }

  // Gastroenterology/Digestive health
  if (lowerQuery.includes('stomach') || lowerQuery.includes('digestive') || lowerQuery.includes('gastro') ||
      lowerQuery.includes('liver') || lowerQuery.includes('intestine') || lowerQuery.includes('colon') ||
      lowerQuery.includes('acid reflux') || lowerQuery.includes('ulcer') || lowerQuery.includes('ibs') ||
      lowerQuery.includes('crohn') || lowerQuery.includes('hepatitis') || lowerQuery.includes('gallbladder') ||
      lowerQuery.includes('nausea') || lowerQuery.includes('vomiting') || lowerQuery.includes('diarrhea') ||
      lowerQuery.includes('constipation') || lowerQuery.includes('abdominal') || lowerQuery.includes('bloating')) {
    return [
      {
        clinicname: "American Hospital - Gastroenterology",
        service: "Gastroenterology Consultation",
        cashprice: "400-700 AED",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777",
        source: "Gastroenterology pricing"
      },
      {
        clinicname: "Mediclinic City Hospital - GI Center",
        service: "Digestive Health Assessment",
        cashprice: "350-650 AED",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999",
        source: "Gastroenterology pricing"
      },
      {
        clinicname: "Dubai Gastroenterology Clinic",
        service: "GI Consultation & Treatment",
        cashprice: "300-600 AED",
        address: "Al Wasl Road, Dubai",
        phone: "+971 4 349 7777",
        source: "Gastroenterology pricing"
      }
    ];
  }

  // Neurology/Neurological conditions & Headaches
  if (lowerQuery.includes('brain') || lowerQuery.includes('neuro') || lowerQuery.includes('headache') ||
      lowerQuery.includes('head ache') || lowerQuery.includes('head pain') || lowerQuery.includes('head hurt') ||
      lowerQuery.includes('migraine') || lowerQuery.includes('seizure') || lowerQuery.includes('stroke') ||
      lowerQuery.includes('epilepsy') || lowerQuery.includes('parkinson') || lowerQuery.includes('alzheimer') ||
      lowerQuery.includes('memory') || lowerQuery.includes('tremor') || lowerQuery.includes('numbness') ||
      lowerQuery.includes('tingling') || lowerQuery.includes('dizziness') || lowerQuery.includes('balance')) {
    return [
      {
        clinicname: "German Neuroscience Center",
        service: "Neurology Consultation & Headache Treatment",
        cashprice: "450-800 AED",
        address: "Dubai Healthcare City",
        phone: "+971 4 429 8989",
        source: "Neurology pricing"
      },
      {
        clinicname: "American Hospital - Neurology",
        service: "Headache & Neurological Assessment",
        cashprice: "400-750 AED",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777",
        source: "Neurology pricing"
      },
      {
        clinicname: "Mediclinic City Hospital - Neurology",
        service: "Brain & Nervous System Care",
        cashprice: "350-700 AED",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999",
        source: "Neurology pricing"
      }
    ];
  }

  // Urology/Kidney/Bladder
  if (lowerQuery.includes('kidney') || lowerQuery.includes('bladder') || lowerQuery.includes('urology') ||
      lowerQuery.includes('urinary') || lowerQuery.includes('prostate') || lowerQuery.includes('stone') ||
      lowerQuery.includes('incontinence') || lowerQuery.includes('uti') || lowerQuery.includes('erectile') ||
      lowerQuery.includes('fertility') || lowerQuery.includes('testosterone') || lowerQuery.includes('dialysis')) {
    return [
      {
        clinicname: "American Hospital - Urology",
        service: "Urology Consultation",
        cashprice: "400-700 AED",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777",
        source: "Urology pricing"
      },
      {
        clinicname: "Mediclinic City Hospital - Urology",
        service: "Urological Assessment",
        cashprice: "350-650 AED",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999",
        source: "Urology pricing"
      },
      {
        clinicname: "Dubai Urology Center",
        service: "Kidney & Bladder Care",
        cashprice: "300-600 AED",
        address: "Al Wasl Road, Dubai",
        phone: "+971 4 349 8888",
        source: "Urology pricing"
      }
    ];
  }

  // Endocrinology/Diabetes/Hormones
  if (lowerQuery.includes('diabetes') || lowerQuery.includes('thyroid') || lowerQuery.includes('hormone') ||
      lowerQuery.includes('endocrine') || lowerQuery.includes('insulin') || lowerQuery.includes('glucose') ||
      lowerQuery.includes('metabolism') || lowerQuery.includes('weight') || lowerQuery.includes('obesity') ||
      lowerQuery.includes('pcos') || lowerQuery.includes('adrenal') || lowerQuery.includes('growth hormone')) {
    return [
      {
        clinicname: "American Hospital - Endocrinology",
        service: "Endocrinology Consultation",
        cashprice: "400-700 AED",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777",
        source: "Endocrinology pricing"
      },
      {
        clinicname: "Mediclinic City Hospital - Diabetes Center",
        service: "Diabetes & Hormone Assessment",
        cashprice: "350-650 AED",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999",
        source: "Endocrinology pricing"
      },
      {
        clinicname: "Dubai Diabetes Center",
        service: "Comprehensive Diabetes Care",
        cashprice: "300-600 AED",
        address: "Al Garhoud, Dubai",
        phone: "+971 4 294 8888",
        source: "Endocrinology pricing"
      }
    ];
  }

  // Oncology/Cancer
  if (lowerQuery.includes('cancer') || lowerQuery.includes('oncology') || lowerQuery.includes('tumor') ||
      lowerQuery.includes('chemotherapy') || lowerQuery.includes('radiation') || lowerQuery.includes('biopsy') ||
      lowerQuery.includes('lymphoma') || lowerQuery.includes('leukemia') || lowerQuery.includes('metastasis') ||
      lowerQuery.includes('malignant') || lowerQuery.includes('benign') || lowerQuery.includes('screening')) {
    return [
      {
        clinicname: "American Hospital - Oncology Center",
        service: "Oncology Consultation",
        cashprice: "500-900 AED",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777",
        source: "Oncology pricing"
      },
      {
        clinicname: "Mediclinic City Hospital - Cancer Center",
        service: "Cancer Screening & Assessment",
        cashprice: "450-850 AED",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999",
        source: "Oncology pricing"
      },
      {
        clinicname: "Dubai Cancer Center",
        service: "Comprehensive Cancer Care",
        cashprice: "400-800 AED",
        address: "Al Barsha, Dubai",
        phone: "+971 4 375 8888",
        source: "Oncology pricing"
      }
    ];
  }

  // Pulmonology/Respiratory/Lung
  if (lowerQuery.includes('lung') || lowerQuery.includes('breathing') || lowerQuery.includes('respiratory') ||
      lowerQuery.includes('asthma') || lowerQuery.includes('copd') || lowerQuery.includes('pneumonia') ||
      lowerQuery.includes('bronchitis') || lowerQuery.includes('cough') || lowerQuery.includes('shortness') ||
      lowerQuery.includes('wheezing') || lowerQuery.includes('tuberculosis') || lowerQuery.includes('sleep apnea')) {
    return [
      {
        clinicname: "American Hospital - Pulmonology",
        service: "Pulmonology Consultation",
        cashprice: "400-700 AED",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777",
        source: "Pulmonology pricing"
      },
      {
        clinicname: "Mediclinic City Hospital - Respiratory Center",
        service: "Respiratory Assessment",
        cashprice: "350-650 AED",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999",
        source: "Pulmonology pricing"
      },
      {
        clinicname: "Dubai Chest Disease Hospital",
        service: "Lung & Breathing Care",
        cashprice: "250-500 AED",
        address: "Al Qusais, Dubai",
        phone: "+971 4 271 0000",
        source: "Pulmonology pricing"
      }
    ];
  }

  // Rheumatology/Autoimmune
  if (lowerQuery.includes('rheumatology') || lowerQuery.includes('arthritis') || lowerQuery.includes('lupus') ||
      lowerQuery.includes('autoimmune') || lowerQuery.includes('fibromyalgia') || lowerQuery.includes('gout') ||
      lowerQuery.includes('inflammatory') || lowerQuery.includes('connective tissue') || lowerQuery.includes('vasculitis')) {
    return [
      {
        clinicname: "American Hospital - Rheumatology",
        service: "Rheumatology Consultation",
        cashprice: "400-700 AED",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777",
        source: "Rheumatology pricing"
      },
      {
        clinicname: "Mediclinic City Hospital - Rheumatology",
        service: "Autoimmune Disease Assessment",
        cashprice: "350-650 AED",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999",
        source: "Rheumatology pricing"
      },
      {
        clinicname: "Dubai Rheumatology Center",
        service: "Joint & Autoimmune Care",
        cashprice: "300-600 AED",
        address: "Al Wasl Road, Dubai",
        phone: "+971 4 349 9999",
        source: "Rheumatology pricing"
      }
    ];
  }

  // Infectious Diseases/Travel Medicine
  if (lowerQuery.includes('infection') || lowerQuery.includes('fever') || lowerQuery.includes('travel') ||
      lowerQuery.includes('vaccination') || lowerQuery.includes('malaria') || lowerQuery.includes('hepatitis') ||
      lowerQuery.includes('hiv') || lowerQuery.includes('std') || lowerQuery.includes('tropical') ||
      lowerQuery.includes('food poisoning') || lowerQuery.includes('antibiotic') || lowerQuery.includes('sepsis')) {
    return [
      {
        clinicname: "Dubai Hospital - Infectious Diseases",
        service: "Infectious Disease Consultation",
        cashprice: "350-600 AED",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 219 5000",
        source: "Infectious disease pricing"
      },
      {
        clinicname: "American Hospital - Travel Medicine",
        service: "Travel Medicine & Vaccination",
        cashprice: "300-550 AED",
        address: "Oud Metha Road, Dubai",
        phone: "+971 4 336 7777",
        source: "Travel medicine pricing"
      },
      {
        clinicname: "Mediclinic City Hospital - Internal Medicine",
        service: "Internal Medicine Consultation",
        cashprice: "300-500 AED",
        address: "Dubai Healthcare City",
        phone: "+971 4 435 9999",
        source: "Internal medicine pricing"
      }
    ];
  }

  // Diagnostic Tests & Imaging
  if (lowerQuery.includes('test') || lowerQuery.includes('blood') || lowerQuery.includes('scan') ||
      lowerQuery.includes('x-ray') || lowerQuery.includes('mri') || lowerQuery.includes('ct') ||
      lowerQuery.includes('ultrasound') || lowerQuery.includes('mammogram') || lowerQuery.includes('biopsy') ||
      lowerQuery.includes('lab') || lowerQuery.includes('screening') || lowerQuery.includes('check-up')) {
    return [
      {
        clinicname: "Dubai Diagnostic Center",
        service: "Blood Tests & Lab Work",
        cashprice: "150-800 AED",
        address: "Multiple locations",
        phone: "+971 4 567 8901",
        source: "Diagnostic pricing"
      },
      {
        clinicname: "Advanced Imaging Center",
        service: "MRI/CT Scans",
        cashprice: "1,200-3,500 AED",
        address: "Healthcare City",
        phone: "+971 4 678 9012",
        source: "Imaging pricing"
      },
      {
        clinicname: "Dubai Radiology Center",
        service: "X-Ray & Ultrasound",
        cashprice: "200-600 AED",
        address: "Al Wasl Road",
        phone: "+971 4 789 0123",
        source: "Radiology pricing"
      }
    ];
  }

  // Physical Therapy & Rehabilitation
  if (lowerQuery.includes('physical therapy') || lowerQuery.includes('physiotherapy') || lowerQuery.includes('rehab') ||
      lowerQuery.includes('massage') || lowerQuery.includes('chiropractic') || lowerQuery.includes('osteopathy') ||
      lowerQuery.includes('recovery') || lowerQuery.includes('exercise') || lowerQuery.includes('mobility')) {
    return [
      {
        clinicname: "Dubai Physiotherapy Center",
        service: "Physical Therapy Session",
        cashprice: "200-400 AED per session",
        address: "Jumeirah Beach Road",
        phone: "+971 4 890 1234",
        source: "Physical therapy pricing"
      },
      {
        clinicname: "Rehab Plus Center",
        service: "Rehabilitation & Recovery",
        cashprice: "250-500 AED per session",
        address: "Dubai Healthcare City",
        phone: "+971 4 901 2345",
        source: "Rehabilitation pricing"
      },
      {
        clinicname: "Sports Recovery Clinic",
        service: "Sports Massage & Therapy",
        cashprice: "300-600 AED per session",
        address: "DIFC",
        phone: "+971 4 012 3456",
        source: "Sports therapy pricing"
      }
    ];
  }

  // Vaccinations & Immunizations
  if (lowerQuery.includes('vaccine') || lowerQuery.includes('vaccination') || lowerQuery.includes('immunization') ||
      lowerQuery.includes('flu shot') || lowerQuery.includes('covid') || lowerQuery.includes('hepatitis') ||
      lowerQuery.includes('travel vaccine') || lowerQuery.includes('booster')) {
    return [
      {
        clinicname: "Dubai Vaccination Center",
        service: "Standard Vaccinations",
        cashprice: "150-400 AED per vaccine",
        address: "Multiple locations",
        phone: "+971 4 123 4567",
        source: "Vaccination pricing"
      },
      {
        clinicname: "Travel Health Clinic",
        service: "Travel Vaccinations",
        cashprice: "200-600 AED per vaccine",
        address: "Healthcare City",
        phone: "+971 4 234 5678",
        source: "Travel vaccine pricing"
      },
      {
        clinicname: "Corporate Health Services",
        service: "Corporate Vaccination Programs",
        cashprice: "100-300 AED per person",
        address: "Business Bay",
        phone: "+971 4 345 6789",
        source: "Corporate vaccine pricing"
      }
    ];
  }

  // Surgical Procedures
  if (lowerQuery.includes('surgery') || lowerQuery.includes('operation') || lowerQuery.includes('procedure') ||
      lowerQuery.includes('removal') || lowerQuery.includes('repair') || lowerQuery.includes('replacement') ||
      lowerQuery.includes('laparoscopic') || lowerQuery.includes('minimally invasive')) {
    return [
      {
        clinicname: "Dubai Surgery Center",
        service: "Minor Surgical Procedures",
        cashprice: "2,000-8,000 AED",
        address: "Healthcare City",
        phone: "+971 4 456 7890",
        source: "Surgery pricing"
      },
      {
        clinicname: "Advanced Surgical Hospital",
        service: "Major Surgical Procedures",
        cashprice: "15,000-50,000 AED",
        address: "Al Barsha",
        phone: "+971 4 567 8901",
        source: "Major surgery pricing"
      },
      {
        clinicname: "Day Surgery Clinic",
        service: "Outpatient Procedures",
        cashprice: "1,500-6,000 AED",
        address: "Jumeirah",
        phone: "+971 4 678 9012",
        source: "Outpatient surgery pricing"
      }
    ];
  }

  // Alternative Medicine & Wellness
  if (lowerQuery.includes('acupuncture') || lowerQuery.includes('homeopathy') || lowerQuery.includes('ayurveda') ||
      lowerQuery.includes('naturopathy') || lowerQuery.includes('herbal') || lowerQuery.includes('alternative') ||
      lowerQuery.includes('holistic') || lowerQuery.includes('wellness') || lowerQuery.includes('detox')) {
    return [
      {
        clinicname: "Dubai Wellness Center",
        service: "Acupuncture & Alternative Medicine",
        cashprice: "250-500 AED per session",
        address: "Jumeirah Beach Road",
        phone: "+971 4 789 0123",
        source: "Alternative medicine pricing"
      },
      {
        clinicname: "Holistic Health Clinic",
        service: "Naturopathy & Herbal Medicine",
        cashprice: "300-600 AED per consultation",
        address: "Al Wasl Road",
        phone: "+971 4 890 1234",
        source: "Holistic health pricing"
      },
      {
        clinicname: "Ayurveda Center Dubai",
        service: "Ayurvedic Treatments",
        cashprice: "200-800 AED per session",
        address: "Karama",
        phone: "+971 4 901 2345",
        source: "Ayurveda pricing"
      }
    ];
  }

  // Home Healthcare Services
  if (lowerQuery.includes('home') || lowerQuery.includes('house call') || lowerQuery.includes('home visit') ||
      lowerQuery.includes('mobile') || lowerQuery.includes('bedside') || lowerQuery.includes('elderly care') ||
      lowerQuery.includes('nursing') || lowerQuery.includes('caregiver')) {
    return [
      {
        clinicname: "Dubai Home Healthcare",
        service: "Home Doctor Visits",
        cashprice: "400-800 AED per visit",
        address: "Service across Dubai",
        phone: "+971 4 012 3456",
        source: "Home healthcare pricing"
      },
      {
        clinicname: "Mobile Medical Services",
        service: "Home Nursing Care",
        cashprice: "200-500 AED per visit",
        address: "Dubai-wide service",
        phone: "+971 4 123 4567",
        source: "Home nursing pricing"
      },
      {
        clinicname: "Elder Care Dubai",
        service: "Elderly Home Care Services",
        cashprice: "300-700 AED per day",
        address: "All Emirates",
        phone: "+971 4 234 5678",
        source: "Elder care pricing"
      }
    ];
  }

  // Telemedicine & Online Consultations
  if (lowerQuery.includes('online') || lowerQuery.includes('telemedicine') || lowerQuery.includes('virtual') ||
      lowerQuery.includes('video call') || lowerQuery.includes('remote') || lowerQuery.includes('teleconsultation')) {
    return [
      {
        clinicname: "Dubai Telemedicine",
        service: "Online Doctor Consultation",
        cashprice: "150-350 AED per session",
        address: "Virtual service",
        phone: "+971 4 345 6789",
        source: "Telemedicine pricing"
      },
      {
        clinicname: "Virtual Health Dubai",
        service: "Specialist Video Consultations",
        cashprice: "200-500 AED per session",
        address: "Online platform",
        phone: "+971 4 456 7890",
        source: "Virtual consultation pricing"
      },
      {
        clinicname: "Remote Care Services",
        service: "Follow-up & Monitoring",
        cashprice: "100-250 AED per session",
        address: "Digital service",
        phone: "+971 4 567 8901",
        source: "Remote care pricing"
      }
    ];
  }

  // Nutrition & Dietitian Services
  if (lowerQuery.includes('nutrition') || lowerQuery.includes('diet') || lowerQuery.includes('nutritionist') ||
      lowerQuery.includes('dietitian') || lowerQuery.includes('weight loss') || lowerQuery.includes('meal plan') ||
      lowerQuery.includes('eating') || lowerQuery.includes('food') || lowerQuery.includes('obesity')) {
    return [
      {
        clinicname: "Dubai Nutrition Center",
        service: "Nutritionist Consultation",
        cashprice: "250-450 AED per session",
        address: "Healthcare City",
        phone: "+971 4 678 9012",
        source: "Nutrition pricing"
      },
      {
        clinicname: "Weight Management Clinic",
        service: "Weight Loss Program",
        cashprice: "1,500-3,000 AED per month",
        address: "Jumeirah",
        phone: "+971 4 789 0123",
        source: "Weight management pricing"
      },
      {
        clinicname: "Sports Nutrition Dubai",
        service: "Sports Nutrition Consultation",
        cashprice: "300-500 AED per session",
        address: "DIFC",
        phone: "+971 4 890 1234",
        source: "Sports nutrition pricing"
      }
    ];
  }

  // Fitness & Exercise Medicine
  if (lowerQuery.includes('fitness') || lowerQuery.includes('exercise') || lowerQuery.includes('personal trainer') ||
      lowerQuery.includes('gym') || lowerQuery.includes('workout') || lowerQuery.includes('sports medicine') ||
      lowerQuery.includes('athletic') || lowerQuery.includes('performance')) {
    return [
      {
        clinicname: "Dubai Sports Medicine Center",
        service: "Sports Medicine Consultation",
        cashprice: "400-700 AED",
        address: "Sports City",
        phone: "+971 4 901 2345",
        source: "Sports medicine pricing"
      },
      {
        clinicname: "Fitness Assessment Clinic",
        service: "Fitness & Health Assessment",
        cashprice: "300-600 AED",
        address: "JLT",
        phone: "+971 4 012 3456",
        source: "Fitness assessment pricing"
      },
      {
        clinicname: "Performance Health Center",
        service: "Athletic Performance Testing",
        cashprice: "500-1,000 AED",
        address: "Al Wasl Road",
        phone: "+971 4 123 4567",
        source: "Performance testing pricing"
      }
    ];
  }

  // Sleep Medicine & Sleep Studies
  if (lowerQuery.includes('sleep') || lowerQuery.includes('insomnia') || lowerQuery.includes('sleep study') ||
      lowerQuery.includes('sleep apnea') || lowerQuery.includes('snoring') || lowerQuery.includes('sleep disorder') ||
      lowerQuery.includes('tired') || lowerQuery.includes('fatigue')) {
    return [
      {
        clinicname: "Dubai Sleep Center",
        service: "Sleep Study & Assessment",
        cashprice: "1,500-3,000 AED",
        address: "Healthcare City",
        phone: "+971 4 234 5678",
        source: "Sleep study pricing"
      },
      {
        clinicname: "Sleep Medicine Clinic",
        service: "Sleep Disorder Consultation",
        cashprice: "400-700 AED",
        address: "Al Barsha",
        phone: "+971 4 345 6789",
        source: "Sleep medicine pricing"
      },
      {
        clinicname: "Insomnia Treatment Center",
        service: "Sleep Therapy & Treatment",
        cashprice: "300-600 AED per session",
        address: "Jumeirah Beach Road",
        phone: "+971 4 456 7890",
        source: "Sleep therapy pricing"
      }
    ];
  }

  // Allergy Testing & Treatment
  if (lowerQuery.includes('allergy') || lowerQuery.includes('allergic') || lowerQuery.includes('allergy test') ||
      lowerQuery.includes('food allergy') || lowerQuery.includes('skin allergy') || lowerQuery.includes('hay fever') ||
      lowerQuery.includes('asthma') || lowerQuery.includes('immunology')) {
    return [
      {
        clinicname: "Dubai Allergy Center",
        service: "Comprehensive Allergy Testing",
        cashprice: "800-1,500 AED",
        address: "Healthcare City",
        phone: "+971 4 567 8901",
        source: "Allergy testing pricing"
      },
      {
        clinicname: "Immunology & Allergy Clinic",
        service: "Allergy Consultation & Treatment",
        cashprice: "350-650 AED",
        address: "Al Wasl Road",
        phone: "+971 4 678 9012",
        source: "Allergy treatment pricing"
      },
      {
        clinicname: "Food Allergy Specialists",
        service: "Food Allergy Testing",
        cashprice: "600-1,200 AED",
        address: "Jumeirah",
        phone: "+971 4 789 0123",
        source: "Food allergy pricing"
      }
    ];
  }

  // Pain Management & General Pain
  if (lowerQuery.includes('pain') || lowerQuery.includes('hurt') || lowerQuery.includes('ache') || 
      lowerQuery.includes('sore') || lowerQuery.includes('pain management') || lowerQuery.includes('chronic pain') || 
      lowerQuery.includes('back pain') || lowerQuery.includes('neck pain') || lowerQuery.includes('joint pain') || 
      lowerQuery.includes('arthritis pain') || lowerQuery.includes('fibromyalgia') || lowerQuery.includes('nerve pain')) {
    return [
      {
        clinicname: "Dubai Pain Management Center",
        service: "Pain Management Consultation",
        cashprice: "400-800 AED",
        address: "Healthcare City",
        phone: "+971 4 890 1234",
        source: "Pain management pricing"
      },
      {
        clinicname: "Chronic Pain Clinic",
        service: "Chronic Pain Treatment",
        cashprice: "500-1,000 AED per session",
        address: "Al Barsha",
        phone: "+971 4 901 2345",
        source: "Chronic pain pricing"
      },
      {
        clinicname: "Interventional Pain Center",
        service: "Pain Injection Therapy",
        cashprice: "1,000-2,500 AED per procedure",
        address: "DIFC",
        phone: "+971 4 012 3456",
        source: "Pain injection pricing"
      }
    ];
  }

  // Occupational Health & Work-Related
  if (lowerQuery.includes('occupational') || lowerQuery.includes('work') || lowerQuery.includes('workplace') ||
      lowerQuery.includes('employment') || lowerQuery.includes('pre-employment') || lowerQuery.includes('medical certificate') ||
      lowerQuery.includes('fit to work') || lowerQuery.includes('work injury')) {
    return [
      {
        clinicname: "Dubai Occupational Health",
        service: "Pre-Employment Medical",
        cashprice: "200-500 AED",
        address: "Multiple locations",
        phone: "+971 4 123 4567",
        source: "Occupational health pricing"
      },
      {
        clinicname: "Corporate Health Services",
        service: "Workplace Health Assessment",
        cashprice: "300-600 AED",
        address: "Business Bay",
        phone: "+971 4 234 5678",
        source: "Corporate health pricing"
      },
      {
        clinicname: "Work Injury Clinic",
        service: "Work-Related Injury Treatment",
        cashprice: "400-800 AED",
        address: "Al Wasl Road",
        phone: "+971 4 345 6789",
        source: "Work injury pricing"
      }
    ];
  }

  // Preventive Care & Health Screenings
  if (lowerQuery.includes('preventive') || lowerQuery.includes('screening') || lowerQuery.includes('check-up') ||
      lowerQuery.includes('health check') || lowerQuery.includes('annual') || lowerQuery.includes('executive') ||
      lowerQuery.includes('comprehensive') || lowerQuery.includes('wellness check')) {
    return [
      {
        clinicname: "Dubai Preventive Medicine",
        service: "Comprehensive Health Screening",
        cashprice: "1,500-3,500 AED",
        address: "Healthcare City",
        phone: "+971 4 456 7890",
        source: "Health screening pricing"
      },
      {
        clinicname: "Executive Health Center",
        service: "Executive Health Package",
        cashprice: "2,500-5,000 AED",
        address: "DIFC",
        phone: "+971 4 567 8901",
        source: "Executive health pricing"
      },
      {
        clinicname: "Wellness Screening Clinic",
        service: "Annual Wellness Check",
        cashprice: "800-1,800 AED",
        address: "Jumeirah",
        phone: "+971 4 678 9012",
        source: "Wellness screening pricing"
      }
    ];
  }
  
  // Default general consultation
  return [
    {
      clinicname: "Mediclinic City Hospital",
      service: "General Consultation",
      cashprice: "250-400 AED",
      address: "Dubai Healthcare City",
      phone: "+971 4 435 9999",
      source: "General medical pricing"
    },
    {
      clinicname: "Dubai Hospital",
      service: "Specialist Consultation",
      cashprice: "300-500 AED",
      address: "Oud Metha Road, Dubai", 
      phone: "+971 4 219 5000",
      source: "General medical pricing"
    }
  ];
};

  // Comprehensive pharmacy and medication pricing
const getPharmacyRecommendations = (query: string) => {
  const lowerQuery = query.toLowerCase();
  const needsMedication = lowerQuery.includes('medication') || lowerQuery.includes('prescription') ||
                         lowerQuery.includes('medicine') || lowerQuery.includes('pill') || lowerQuery.includes('drug') ||
                         lowerQuery.includes('antibiotic') || lowerQuery.includes('pain') || lowerQuery.includes('fever') ||
                         lowerQuery.includes('vitamin') || lowerQuery.includes('supplement') || lowerQuery.includes('cream') ||
                         lowerQuery.includes('ointment') || lowerQuery.includes('drops') || lowerQuery.includes('inhaler');
                           
  if (!needsMedication) return [];
  
  const pharmacyOptions = [
    {
      clinicname: "Aster Pharmacy",
      service: "Prescription Medications",
      cashprice: "50-300 AED (varies by medication)",
      address: "Multiple locations across Dubai",
      phone: "+971 600 522 567",
      source: "Pharmacy pricing"
    },
    {
      clinicname: "Life Pharmacy",
      service: "Prescription & OTC Medications",
      cashprice: "40-250 AED (varies by medication)",
      address: "Over 200 locations in Dubai",
      phone: "+971 4 336 6633",
      source: "Pharmacy pricing"
    },
    {
      clinicname: "Boots Pharmacy",
      service: "Prescription Services",
      cashprice: "60-350 AED (varies by medication)",
      address: "Major malls and communities",
      phone: "+971 800 2668",
      source: "Pharmacy pricing"
    }
  ];

  // Add specific medication pricing based on query
  if (lowerQuery.includes('pain') || lowerQuery.includes('headache') || lowerQuery.includes('migraine')) {
    pharmacyOptions.push({
      clinicname: "Dubai Pharmacy",
      service: "Pain Relief Medications (Paracetamol, Ibuprofen)",
      cashprice: "15-80 AED",
      address: "Multiple locations",
      phone: "+971 4 123 4567",
      source: "Pain medication pricing"
    });
  }

  if (lowerQuery.includes('antibiotic') || lowerQuery.includes('infection')) {
    pharmacyOptions.push({
      clinicname: "Al Manara Pharmacy",
      service: "Antibiotic Medications",
      cashprice: "80-250 AED (prescription required)",
      address: "Various Dubai locations",
      phone: "+971 4 234 5678",
      source: "Antibiotic pricing"
    });
  }

  if (lowerQuery.includes('vitamin') || lowerQuery.includes('supplement')) {
    pharmacyOptions.push({
      clinicname: "Health Plus Pharmacy",
      service: "Vitamins & Supplements",
      cashprice: "25-150 AED",
      address: "Dubai Mall, MOE, other locations",
      phone: "+971 4 345 6789",
      source: "Supplement pricing"
    });
  }

  if (lowerQuery.includes('skin') || lowerQuery.includes('cream') || lowerQuery.includes('ointment')) {
    pharmacyOptions.push({
      clinicname: "Skin Care Pharmacy",
      service: "Dermatological Creams & Ointments",
      cashprice: "35-200 AED",
      address: "Healthcare City, JLT",
      phone: "+971 4 456 7890",
      source: "Skin medication pricing"
    });
  }

  return pharmacyOptions;
};

// Comprehensive insurance plans covering all medical specialties
const getFallbackInsurance = (): InsurancePlan[] => [
  {
    planName: "Essential Health Plan",
    provider: "UAE Insurance Group",
    premium: 450,
    benefits: [
      "Outpatient consultations (all specialties)",
      "Emergency care coverage",
      "Prescription medications",
      "Basic diagnostic tests",
      "Preventive care services",
      "Dermatology consultations",
      "ENT specialist visits"
    ]
  },
  {
    planName: "Comprehensive Care Plus",
    provider: "Dubai Health Insurance",
    premium: 850,
    benefits: [
      "Full hospitalization coverage",
      "All specialist consultations (cardiology, neurology, oncology)",
      "Advanced diagnostics & imaging",
      "Dental and vision care",
      "Maternity & women's health benefits",
      "Mental health & therapy coverage",
      "Orthopedic & sports medicine",
      "Gastroenterology & endocrinology",
      "International coverage"
    ]
  },
  {
    planName: "Family Protection Plan",
    provider: "Emirates Health Shield",
    premium: 1200,
    benefits: [
      "Family coverage for up to 4 members",
      "Comprehensive medical care (all specialties)",
      "Pediatric & children's health",
      "Emergency evacuation",
      "Mental health & counseling support",
      "Cancer screening & oncology care",
      "Respiratory & pulmonology services",
      "Rheumatology & autoimmune care",
      "Wellness & preventive programs",
      "No waiting period for most services"
    ]
  },
  {
    planName: "Premium Specialist Plan",
    provider: "Dubai Medical Insurance",
    premium: 1500,
    benefits: [
      "Unlimited specialist consultations",
      "Advanced cancer treatment coverage",
      "Neurological & brain disorder care",
      "Heart surgery & cardiac procedures",
      "Organ transplant coverage",
      "Fertility & reproductive health",
      "Plastic & reconstructive surgery",
      "Travel medicine & vaccinations",
      "Home healthcare services",
      "VIP hospital room upgrades"
    ]
  },
  {
    planName: "Senior Care Plan",
    provider: "Emirates Senior Health",
    premium: 950,
    benefits: [
      "Age 50+ specialized coverage",
      "Chronic disease management",
      "Diabetes & endocrine care",
      "Cardiology & heart monitoring",
      "Orthopedic & joint replacement",
      "Memory care & neurology",
      "Regular health screenings",
      "Medication management",
      "Physical therapy coverage",
      "24/7 medical helpline"
    ]
  },
  {
    planName: "Young Professional Plan",
    provider: "Dubai Youth Insurance",
    premium: 350,
    benefits: [
      "Basic outpatient care",
      "Sports injury coverage",
      "Mental health & stress management",
      "Dermatology & skin care",
      "Reproductive health services",
      "Travel medicine",
      "Preventive screenings",
      "Telemedicine consultations",
      "Wellness programs",
      "Emergency care"
    ]
  }
];

// Main function to handle the chat logic
export async function POST(req: NextRequest) {
  let message = '';
  try {
    const body = await req.json();
    message = body.message;
    
    if (!message) {
      return new NextResponse(JSON.stringify({ message: 'Message is required' }), { status: 400 });
    }

    // Step 1: Comprehensive intent analysis with better error handling
    let intentData;
    try {
    const intentAnalysis = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
                      content: `You are an expert healthcare intent analyzer for a Dubai-based health assistant. Analyze the user's message and respond with a comprehensive JSON object.

CRITICAL ANALYSIS REQUIREMENTS:
1. **Emergency Detection**: Set "isEmergency": true for any life-threatening situations, severe injuries, or urgent medical conditions requiring immediate care.

2. **Service Classification**: Identify the most specific medical service from these categories:
   • Skin/Dermatology: rashes, acne, eczema, psoriasis, moles, dry skin, itching, burns, allergic reactions
   • Heart/Cardiology: chest pain, palpitations, blood pressure, cholesterol, heart disease, shortness of breath
   • Bone/Orthopedics: fractures, joint pain, back pain, sports injuries, arthritis, muscle strains
   • Eye/Ophthalmology: vision problems, eye pain, cataracts, glaucoma, eye infections, blindness
   • ENT: ear infections, hearing loss, sinus problems, throat pain, voice issues, tinnitus
   • Digestive/Gastroenterology: stomach pain, nausea, diarrhea, constipation, acid reflux, liver issues
   • Brain/Neurology: headaches, migraines, seizures, memory problems, dizziness, numbness
   • Kidney/Urology: urinary problems, kidney stones, bladder issues, prostate problems
   • Hormones/Endocrinology: diabetes, thyroid issues, weight problems, hormone imbalances
   • Cancer/Oncology: lumps, unusual growths, cancer concerns, screening questions
   • Lung/Pulmonology: breathing problems, asthma, cough, pneumonia, sleep apnea
   • Women's Health/Gynecology: menstrual issues, pregnancy, fertility, breast health
   • Children/Pediatrics: child health, growth concerns, developmental issues, vaccinations
   • Mental Health/Psychiatry: depression, anxiety, stress, sleep disorders, behavioral issues
   • General Medicine: fever, fatigue, general wellness, preventive care

3. **Query Type Detection**: Identify the primary intent:
   • "health-advice": Medical information, symptoms, conditions, treatments
   • "pricing-inquiry": Cost questions, procedure prices, consultation fees
   • "facility-search": Hospital/clinic locations, services, appointments
   • "insurance-coverage": Insurance questions, coverage, claims, benefits
   • "emergency-care": Urgent medical situations requiring immediate attention

4. **Insurance Keywords**: Generate 3-5 relevant keywords for insurance matching based on the medical service and condition.

5. **Pricing Keywords**: Generate 3-5 relevant keywords for pricing searches.

6. **Facility Keywords**: Generate 3-5 relevant keywords for facility searches.

RESPONSE FORMAT:
{
  "isEmergency": boolean,
  "serviceQuery": "specific medical service consultation",
  "queryType": "health-advice|pricing-inquiry|facility-search|insurance-coverage|emergency-care",
  "medicalSpecialty": "specific specialty name",
  "insuranceKeywords": ["keyword1", "keyword2", "keyword3"],
  "pricingKeywords": ["keyword1", "keyword2", "keyword3"],
  "facilityKeywords": ["keyword1", "keyword2", "keyword3"],
  "urgencyLevel": "low|medium|high|critical",
  "expectedResponseSections": ["symptoms", "causes", "treatment", "pricing", "facilities"]
}

EXAMPLES:
- "I have a severe headache" → {"isEmergency": false, "serviceQuery": "neurology consultation", "queryType": "health-advice", "medicalSpecialty": "neurology", "urgencyLevel": "medium"}
- "How much does an MRI cost?" → {"isEmergency": false, "serviceQuery": "MRI scan", "queryType": "pricing-inquiry", "medicalSpecialty": "radiology", "urgencyLevel": "low"}
- "Chest pain and shortness of breath" → {"isEmergency": true, "serviceQuery": "emergency cardiology", "queryType": "emergency-care", "medicalSpecialty": "cardiology", "urgencyLevel": "critical"}`,
        },
        { role: 'user', content: message },
      ],
      response_format: { type: "json_object" },
        temperature: 0.3,
      });

      intentData = JSON.parse(intentAnalysis.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Intent analysis error:', error);
      // Fallback intent analysis
      const lowerMessage = message.toLowerCase();
      intentData = {
        isEmergency: lowerMessage.includes('emergency') || lowerMessage.includes('cut') || lowerMessage.includes('bleeding') || lowerMessage.includes('accident'),
        serviceQuery: message,
        insuranceKeywords: ['general-care']
      };
    }
    
    // Step 2: Get contextual data with improved fallbacks
    let emergencyFacilities: EmergencyFacility[] = [];
    let regularFacilities: EmergencyFacility[] = [];
    let pricingResults: Procedure[] = [];
    let insuranceResults: InsurancePlan[] = [];
    let dhaGuidelines = '';
    
    // Get contextual facilities (emergency or regular)
    try {
      if (intentData.isEmergency) {
        emergencyFacilities = await findEmergencyCare();
        if (emergencyFacilities.length === 0) {
          emergencyFacilities = getContextualFacilities(message, true);
        }
      } else {
        // For non-emergency queries, get regular facilities
        regularFacilities = getContextualFacilities(message, false);
      }
    } catch (error) {
      console.error('Facility search error:', error);
      // Fallback to contextual facilities on error
    if (intentData.isEmergency) {
        emergencyFacilities = getContextualFacilities(message, true);
      } else {
        regularFacilities = getContextualFacilities(message, false);
      }
    }
    
    // Get contextual pricing (including pharmacies if needed)
    try {
    if (intentData.serviceQuery) {
        console.log('Searching for pricing with query:', intentData.serviceQuery);
        
        // Try web search with timeout protection
        const searchPromise = searchWebForProcedure(intentData.serviceQuery);
        const timeoutPromise = new Promise<Procedure[]>((_, reject) => 
          setTimeout(() => reject(new Error('Search timeout')), 15000)
        );
        
        try {
          pricingResults = await Promise.race([searchPromise, timeoutPromise]);
          console.log('Web search pricing results:', pricingResults.length);
        } catch (searchError) {
          console.log('Web search failed, using fallback:', searchError);
          pricingResults = [];
        }
      }
      
      // Always ensure we have pricing data
      if (pricingResults.length === 0) {
        console.log('Using contextual pricing for:', message);
        pricingResults = getContextualPricing(message);
        // Add pharmacy recommendations if relevant
        const pharmacyRecs = getPharmacyRecommendations(message);
        pricingResults = [...pricingResults, ...pharmacyRecs];
        console.log('Final pricing results:', pricingResults.length);
      }
    } catch (error) {
      console.error('Pricing search error:', error);
      // Ensure we always have fallback data
      pricingResults = getContextualPricing(message);
      const pharmacyRecs = getPharmacyRecommendations(message);
      pricingResults = [...pricingResults, ...pharmacyRecs];
      console.log('Error fallback pricing results:', pricingResults.length);
    }
    
    // Get insurance recommendations
    try {
      if (intentData.insuranceKeywords && intentData.insuranceKeywords.length > 0) {
        insuranceResults = await getInsuranceInfo(intentData.insuranceKeywords);
      }
      if (insuranceResults.length === 0) {
        insuranceResults = getFallbackInsurance();
      }
    } catch (error) {
      console.error('Insurance search error:', error);
      insuranceResults = getFallbackInsurance();
    }

    // Search for health information - OFFLINE MODE ONLY
    try {
      console.log('=== STARTING OFFLINE HEALTH INFORMATION SEARCH ===');
      console.log('Original message:', message);
      console.log('Service query:', intentData.serviceQuery);
      
      // Use offline health information only
      console.log('Using offline health information search...');
      const offlineHealthInfo = await searchGeneralHealthInfo(message);
      
      if (offlineHealthInfo) {
        dhaGuidelines = offlineHealthInfo;
        console.log('Offline health information found, length:', dhaGuidelines.length);
        console.log('Offline health content preview:', dhaGuidelines.substring(0, 300));
      } else {
        console.log('No offline health information found');
        // Provide basic fallback
        dhaGuidelines = `
Medical Information: For any health concern, it's important to consult with a qualified healthcare professional for proper evaluation and treatment.

If you have urgent medical concerns, please contact emergency services or visit the nearest healthcare facility.
`;
      }
    } catch (error) {
      console.error('Health information search error:', error);
      dhaGuidelines = `
Medical Information: For any health concern, please consult with a qualified healthcare professional for proper evaluation and treatment.

If you have urgent medical concerns, please contact emergency services or visit the nearest healthcare facility.
`;
    }



    // Step 3: Generate the final, synthesized response with better error handling
    let finalResponseText = '';
    try {
      // Prepare pricing context for the AI
      const pricingContext = pricingResults.length > 0 
        ? `Available pricing information: ${pricingResults.map(p => `${p.service} at ${p.clinicname}: ${p.cashprice}`).join('; ')}`
        : '';

      // Prepare DHA guidelines context
      const dhaContext = dhaGuidelines 
        ? `Health Information: ${dhaGuidelines}`
        : '';

      console.log('=== FINAL AI RESPONSE PREPARATION ===');
      console.log('DHA/Health context length:', dhaContext.length);
      console.log('DHA/Health context preview:', dhaContext.substring(0, 200));
      console.log('Intent data:', JSON.stringify(intentData));
      console.log('Service query for search:', intentData.serviceQuery);
      console.log('Final dhaGuidelines length:', dhaGuidelines.length);
      console.log('Has health content for AI:', dhaGuidelines.length > 20 ? 'YES' : 'NO');
      console.log('Full dhaGuidelines content:', dhaGuidelines);
      console.log('Will use medical knowledge base:', dhaContext && dhaContext.length > 20 ? 'YES' : 'NO');

            const systemPrompt = `You are an expert AI Health Concierge for Dubai Healthcare Services. Your mission is to provide comprehensive, accurate, and helpful healthcare guidance covering medical advice, pricing information, facility details, and insurance guidance.

MANDATORY RESPONSE STRUCTURE:
⚠️ **Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.

CORE RESPONSE PRINCIPLES:
1. **Medical Accuracy**: Base all medical information on established medical knowledge and best practices. ALWAYS prioritize any provided medical knowledge base content.
2. **Dubai Context**: All recommendations must be relevant to Dubai's healthcare system and regulations
3. **Comprehensive Coverage**: Address health advice, pricing, facilities, and insurance in every response
4. **Cultural Sensitivity**: Respect UAE cultural norms and Islamic healthcare principles
5. **Emergency Awareness**: Always prioritize urgent medical situations
6. **Source Priority**: When medical knowledge base content is provided, use it as your PRIMARY source and reference it explicitly

RESPONSE SECTIONS (Include ALL relevant sections):

## 🏥 **Medical Information**
- **Condition Overview**: Clear explanation of the health issue
- **Symptoms**: Detailed symptom description and what to watch for
- **Possible Causes**: Common and serious causes to consider
- **Risk Factors**: Who is most likely to be affected
- **Complications**: What could happen if untreated

## 🚨 **Urgency Assessment**
- **Immediate Care Needed**: When to seek emergency care
- **Routine Appointment**: When a regular doctor visit is appropriate
- **Self-Care**: Safe measures that can be taken at home
- **Red Flags**: Warning signs that require immediate medical attention

## 💰 **Pricing Information**
- **Consultation Costs**: Expected fees for doctor visits
- **Diagnostic Tests**: Costs for relevant tests and procedures
- **Treatment Expenses**: Estimated costs for common treatments
- **Insurance Coverage**: What insurance typically covers
- **Payment Options**: Available payment methods and plans

## 🏥 **Healthcare Facilities**
- **Recommended Hospitals**: Top facilities for this condition in Dubai
- **Specialist Clinics**: Specialized centers for specific treatments
- **Emergency Services**: Nearest emergency facilities if urgent
- **Appointment Booking**: How to schedule consultations
- **Location Details**: Areas and accessibility information

## 🛡️ **Insurance Guidance**
- **Coverage Types**: Which insurance plans typically cover this
- **Pre-Authorization**: If approval is needed before treatment
- **Claim Process**: How to file insurance claims
- **Out-of-Pocket**: Expected costs not covered by insurance
- **Alternative Options**: Other financial assistance available

## 📋 **Next Steps**
- **Immediate Actions**: What to do right now
- **Follow-up Care**: Ongoing monitoring and care needed
- **Prevention**: How to prevent recurrence or complications
- **Lifestyle Changes**: Recommended modifications for better health

SPECIAL INSTRUCTIONS:
- For EMERGENCY queries: Emphasize immediate medical attention and provide emergency contact information
- For PRICING queries: Include detailed cost breakdowns and insurance information
- For FACILITY queries: Provide specific hospital/clinic recommendations with contact details
- For INSURANCE queries: Explain coverage options and claim procedures in detail
- For GENERAL HEALTH: Provide comprehensive medical information with all supporting sections

DUBAI-SPECIFIC REQUIREMENTS:
- Reference DHA (Dubai Health Authority) guidelines when applicable
- Include both public and private healthcare options
- Mention SEHA, Emirates Health Services, and major private hospitals
- Consider expatriate and local population needs
- Include Arabic and English language service availability

QUALITY STANDARDS:
- Use clear, non-technical language while maintaining medical accuracy
- Provide specific, actionable advice
- Include relevant statistics and success rates when available
- Reference authoritative medical sources
- Maintain empathetic and supportive tone

Return response as JSON: {"responseText": "comprehensive markdown response"}`;
    
    const finalResponse = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
            { role: 'system', content: systemPrompt },
              { role: 'user', content: `
HEALTH QUERY: "${message}"

QUERY ANALYSIS:
- Type: ${intentData.queryType || 'health-advice'}
- Medical Specialty: ${intentData.medicalSpecialty || 'general medicine'}
- Urgency Level: ${intentData.urgencyLevel || 'medium'}
- Emergency Status: ${intentData.isEmergency ? 'YES - URGENT' : 'No'}

AVAILABLE INFORMATION:
${dhaContext && dhaContext.length > 20 ? `
MEDICAL KNOWLEDGE BASE:
${dhaContext}

CRITICAL INSTRUCTION: You MUST use the medical information provided above as your PRIMARY source. This is authoritative medical content that should form the foundation of your response. Extract and incorporate specific facts, symptoms, causes, treatments, and recommendations directly from this source material. Do not ignore this information - it is specifically provided to enhance your response quality.` : `
INSTRUCTION: No specific medical database content available. Use your comprehensive medical knowledge to provide accurate healthcare information while emphasizing the need for professional medical consultation.`}

${pricingContext ? `
PRICING DATA AVAILABLE:
${pricingContext}

INSTRUCTION: Include this specific pricing information in your response and expand with general Dubai healthcare pricing context.` : `
INSTRUCTION: Provide general Dubai healthcare pricing estimates based on typical market rates.`}

RESPONSE REQUIREMENTS:
1. **Comprehensive Coverage**: Address ALL aspects - medical advice, pricing, facilities, insurance
2. **Dubai Focus**: All recommendations must be specific to Dubai healthcare system
3. **Emergency Priority**: ${intentData.isEmergency ? 'CRITICAL - Emphasize immediate emergency care and provide emergency contact information' : 'Standard care pathway with appropriate urgency level'}
4. **Cultural Sensitivity**: Consider UAE cultural norms and Islamic healthcare principles
5. **Practical Guidance**: Include specific next steps and actionable advice

EXPECTED SECTIONS: ${intentData.expectedResponseSections ? intentData.expectedResponseSections.join(', ') : 'symptoms, causes, treatment, pricing, facilities, insurance, next steps'}

Generate a comprehensive response that addresses the user's ${intentData.queryType || 'health'} query with complete medical, pricing, facility, and insurance information relevant to Dubai healthcare.` }
        ],
        response_format: { type: "json_object" },
          temperature: 0.5,
      });

      const responseContent = finalResponse.choices[0]?.message.content;
      console.log('Raw AI response:', responseContent);
      
      if (responseContent) {
        try {
          const finalData = JSON.parse(responseContent);
          finalResponseText = finalData.responseText || 'I understand your health concern. Please consult with a healthcare professional for proper evaluation and treatment.';
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          // If JSON parsing fails, treat the content as plain text
          finalResponseText = responseContent.includes('responseText') 
            ? responseContent.split('responseText":"')[1]?.split('"}')[0] || responseContent
            : responseContent;
        }
      } else {
        finalResponseText = 'I understand your health concern. Please consult with a healthcare professional for proper evaluation and treatment.';
      }
    } catch (error) {
      console.error('Response generation error:', error);
      // Provide contextual fallback response based on query
      const lowerMessage = message.toLowerCase();
      const pricingInfo = pricingResults.length > 0 
        ? `\n\n**Cost Information:**\n${pricingResults.map(p => `- ${p.service}: ${p.cashprice} (${p.clinicname})`).join('\n')}`
        : '';

      if (lowerMessage.includes('cut') || lowerMessage.includes('bleeding') || lowerMessage.includes('wound')) {
        finalResponseText = `⚠️ **Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.

## Immediate Care for Cuts/Wounds

If you have a cut on your leg, here's what you should do:

**Immediate Steps:**
1. **Stop the bleeding** - Apply direct pressure with a clean cloth
2. **Clean the wound** - Rinse gently with clean water if possible
3. **Assess severity** - Deep cuts, excessive bleeding, or cuts that won't stop bleeding need immediate medical attention

**Seek Emergency Care If:**
- The cut is deep (you can see fat, muscle, or bone)
- Bleeding won't stop after 10-15 minutes of direct pressure
- The cut is longer than 1/2 inch
- You can't clean debris from the wound
- Signs of infection develop (redness, warmth, swelling, pus)

**Follow-up Care:**
- Keep the wound clean and dry
- Change bandages regularly
- Watch for signs of infection
- Consider a tetanus shot if you're not up to date${pricingInfo}

Please visit one of the recommended emergency facilities if you're concerned about the severity of your injury.`;
      } else if (lowerMessage.includes('iv') || lowerMessage.includes('nutrition') || lowerMessage.includes('drip') || lowerMessage.includes('hydration')) {
        finalResponseText = `⚠️ **Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.

## IV Therapy & Nutrition Services

IV therapy is a popular wellness treatment in Dubai that delivers vitamins, minerals, and hydration directly into your bloodstream.

**What to Expect:**
- **During the procedure**: You'll feel a small pinch when the needle is inserted, similar to a blood draw
- **Sensation**: Cool feeling as the IV fluid enters your arm, completely painless after insertion
- **Duration**: Most sessions take 30-60 minutes depending on the treatment
- **Comfort**: You can relax, read, or use your phone during the session

**Common Benefits:**
- Immediate hydration (you may feel more energized within hours)
- Better nutrient absorption than oral supplements
- Potential improvement in energy levels and skin appearance
- Hangover relief (if applicable)

**After Treatment:**
- Mild soreness at injection site is normal for 24-48 hours
- Increased urination is common as your body processes the extra fluids
- Most people feel effects within 2-4 hours${pricingInfo}

**When to Choose IV Therapy:**
- Dehydration from travel, exercise, or illness
- Vitamin deficiencies confirmed by blood tests
- Wellness maintenance and energy boost
- Recovery support after intense physical activity`;
      } else if (lowerMessage.includes('yellow') && lowerMessage.includes('eyes')) {
        finalResponseText = `⚠️ **Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.

## Yellow Eyes (Jaundice) - Important Information

Yellow discoloration of the eyes (scleral icterus) can indicate several medical conditions and should be evaluated by a healthcare professional.

**Possible Causes:**
- **Liver conditions**: Hepatitis, cirrhosis, liver dysfunction
- **Gallbladder issues**: Gallstones, bile duct obstruction
- **Blood disorders**: Hemolytic anemia, sickle cell disease
- **Medications**: Certain antibiotics, pain relievers, or supplements
- **Infections**: Viral hepatitis, malaria (in endemic areas)
- **Genetic conditions**: Gilbert's syndrome, other inherited disorders

**Associated Symptoms to Watch For:**
- Dark urine or pale stools
- Abdominal pain (especially upper right side)
- Nausea, vomiting, or loss of appetite
- Fatigue or weakness
- Fever or chills
- Skin itching
- Swelling in legs or abdomen

**When to Seek Immediate Medical Care:**
- Severe abdominal pain
- High fever (over 38.5°C/101.3°F)
- Confusion or altered mental state
- Difficulty breathing
- Rapid worsening of yellow color
- Vomiting blood or black stools

**What to Do:**
1. **Schedule a medical appointment promptly** - Yellow eyes warrant professional evaluation
2. **Avoid alcohol** completely until you see a doctor
3. **Stay hydrated** with water
4. **List your medications** and supplements to discuss with your doctor
5. **Monitor symptoms** and note any changes${pricingInfo}

**Important**: Yellow eyes can indicate serious liver or blood conditions. Please see a DHA-licensed healthcare provider in Dubai as soon as possible for proper diagnosis and treatment according to Dubai Health Authority protocols.${dhaGuidelines ? `\n\n**DHA Guidelines Reference**: This advice follows Dubai Health Authority medical standards.` : ''}`;
      } else if (lowerMessage.includes('skin') || lowerMessage.includes('dry') || lowerMessage.includes('texture') || lowerMessage.includes('crocodile') || lowerMessage.includes('scaly') || lowerMessage.includes('flaky') || lowerMessage.includes('dermat')) {
        finalResponseText = `⚠️ **Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.

## Dry, Textured Skin - Dermatological Information

Dry skin with a rough, "crocodile-like" texture can indicate several skin conditions that benefit from professional dermatological evaluation.

**Possible Causes:**
- **Xerosis (severe dry skin)**: Most common cause of rough, scaly skin texture
- **Atopic dermatitis (eczema)**: Chronic inflammatory skin condition
- **Ichthyosis**: Genetic condition causing fish-scale-like skin
- **Psoriasis**: Autoimmune condition causing thick, scaly patches
- **Environmental factors**: Low humidity, harsh soaps, hot showers
- **Age-related changes**: Decreased oil production with aging
- **Underlying conditions**: Thyroid disorders, diabetes, kidney disease

**Associated Symptoms to Monitor:**
- Itching or burning sensation
- Cracking or bleeding of skin
- Redness or inflammation
- Thick, scaly patches
- Changes in skin color
- Spreading to other body areas

**When to See a Dermatologist:**
- Severe dryness that doesn't improve with moisturizing
- Cracking, bleeding, or infected-looking areas
- Intense itching that interferes with sleep
- Sudden onset or rapid worsening
- Skin changes affecting large body areas
- Signs of infection (warmth, pus, red streaking)

**Immediate Care Measures:**
1. **Gentle cleansing** - Use mild, fragrance-free cleansers
2. **Moisturize immediately** after bathing while skin is damp
3. **Use thick moisturizers** or ointments rather than lotions
4. **Avoid hot water** - use lukewarm water for bathing
5. **Humidify your environment** especially during dry seasons
6. **Protect your skin** from harsh weather and chemicals${pricingInfo}

**Important**: Persistent skin texture changes warrant dermatological evaluation to rule out underlying conditions and receive appropriate treatment.${dhaGuidelines ? `\n\n**Medical Information Reference**: This advice is based on current dermatological standards.` : ''}`;
      } else {
        finalResponseText = `⚠️ **Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.

## Health Guidance

I understand you have a health concern. While I can provide general information, it's important to consult with a qualified healthcare professional for proper evaluation, diagnosis, and treatment.

**General Recommendations:**
- Schedule a consultation with an appropriate healthcare provider
- Be prepared to describe your symptoms in detail
- Bring any relevant medical history or current medications
- Don't hesitate to ask questions during your appointment${pricingInfo}

The facilities and pricing information in the other tabs can help you find appropriate care in Dubai. If this is urgent, please don't delay in seeking medical attention.`;
      }
    }
    
    return NextResponse.json({ 
      response: finalResponseText,
      // Pass the data to the frontend - always include all sections
      emergencyFacilities: emergencyFacilities,
      regularFacilities: regularFacilities,
      pricing: pricingResults,
      insurancePlans: insuranceResults,
    });

  } catch (error) {
    const err = error as Error;
    console.error('[API_CHAT_ERROR]', err.message, err.stack);
    console.error('[API_CHAT_ERROR_DETAILS]', {
      message: message,
      errorName: err.name,
      errorMessage: err.message
    });
    
    // Provide contextual error fallback - ensure we always return valid data
    const lowerMessage = (message || '').toLowerCase();
    const isEmergencyQuery = lowerMessage.includes('emergency') || lowerMessage.includes('cut') || lowerMessage.includes('bleeding');
    const contextualEmergencyFacilities = isEmergencyQuery ? getContextualFacilities(message || '', true) : [];
    const contextualRegularFacilities = !isEmergencyQuery ? getContextualFacilities(message || '', false) : [];
    const contextualPricing = getContextualPricing(message || '');
    const pharmacyRecs = getPharmacyRecommendations(message || '');
    
    return NextResponse.json({ 
      response: `⚠️ **Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.

## Health Information Available

I can provide you with healthcare information and resources for Dubai. Please check the Facilities & Pricing and Insurance tabs for relevant healthcare options.

${message && message.toLowerCase().includes('iv') ? `
## IV Therapy Information

IV therapy services are available at several clinics in Dubai. These treatments can help with hydration, vitamin supplementation, and wellness support.` : ''}

If you have an urgent medical concern, please contact one of the emergency facilities directly or call Dubai Emergency Services at 999.`,
      emergencyFacilities: contextualEmergencyFacilities,
      regularFacilities: contextualRegularFacilities,
      pricing: [...contextualPricing, ...pharmacyRecs],
      insurancePlans: getFallbackInsurance(),
    });
  }
} 