import React from 'react';

export interface DiagnosisResult {
  problem: string;
  possibleCauses: Array<{
    cause: string;
    probability: number;
    solution: string;
    urgency: 'low' | 'medium' | 'high';
    estimatedCost: string;
  }>;
  overallUrgency: 'low' | 'medium' | 'high';
  estimatedCostRange: string;
  recommendations: string[];
}

export interface Symptom {
  id: number;
  symptom: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  keywords: string[];
}

// Enhanced diagnosis database
const DIAGNOSIS_DATABASE: Record<string, DiagnosisResult> = {
  'mesin_tidak_hidup': {
    problem: 'Mesin tidak mau hidup',
    possibleCauses: [
      {
        cause: 'Aki lemah atau habis',
        probability: 40,
        solution: 'Charge aki atau ganti aki baru. Periksa terminal aki dari korosi.',
        urgency: 'high',
        estimatedCost: 'Rp 300,000 - 800,000'
      },
      {
        cause: 'Sistem bahan bakar tersumbat',
        probability: 25,
        solution: 'Bersihkan filter bahan bakar dan injector. Periksa pompa bensin.',
        urgency: 'medium',
        estimatedCost: 'Rp 150,000 - 500,000'
      },
      {
        cause: 'Busi rusak atau kotor',
        probability: 20,
        solution: 'Ganti busi baru sesuai spesifikasi kendaraan.',
        urgency: 'medium',
        estimatedCost: 'Rp 50,000 - 200,000'
      },
      {
        cause: 'Starter motor rusak',
        probability: 15,
        solution: 'Service atau ganti starter motor. Periksa relay starter.',
        urgency: 'high',
        estimatedCost: 'Rp 400,000 - 1,200,000'
      }
    ],
    overallUrgency: 'high',
    estimatedCostRange: 'Rp 50,000 - 1,200,000',
    recommendations: [
      'Periksa aki terlebih dahulu karena paling umum',
      'Jangan paksa starter berulang kali',
      'Segera bawa ke bengkel jika masalah berlanjut'
    ]
  },
  'suara_mesin_kasar': {
    problem: 'Suara mesin kasar dan tidak normal',
    possibleCauses: [
      {
        cause: 'Oli mesin kotor atau habis',
        probability: 35,
        solution: 'Ganti oli mesin dan filter oli sesuai jadwal. Gunakan oli berkualitas.',
        urgency: 'high',
        estimatedCost: 'Rp 100,000 - 300,000'
      },
      {
        cause: 'Timing belt kendor atau aus',
        probability: 25,
        solution: 'Setel atau ganti timing belt. Periksa tensioner.',
        urgency: 'high',
        estimatedCost: 'Rp 300,000 - 800,000'
      },
      {
        cause: 'Carbon build-up di mesin',
        probability: 20,
        solution: 'Lakukan carbon cleaning atau engine flush.',
        urgency: 'medium',
        estimatedCost: 'Rp 200,000 - 500,000'
      },
      {
        cause: 'Knocking sensor rusak',
        probability: 20,
        solution: 'Ganti knocking sensor dan reset ECU.',
        urgency: 'medium',
        estimatedCost: 'Rp 250,000 - 600,000'
      }
    ],
    overallUrgency: 'high',
    estimatedCostRange: 'Rp 100,000 - 800,000',
    recommendations: [
      'Jangan abaikan suara mesin yang tidak normal',
      'Periksa level oli secara rutin',
      'Gunakan bahan bakar berkualitas baik'
    ]
  },
  'overheat': {
    problem: 'Mesin overheat/panas berlebihan',
    possibleCauses: [
      {
        cause: 'Radiator tersumbat atau bocor',
        probability: 40,
        solution: 'Kuras dan isi coolant baru. Perbaiki kebocoran radiator.',
        urgency: 'high',
        estimatedCost: 'Rp 200,000 - 1,500,000'
      },
      {
        cause: 'Kipas radiator tidak berfungsi',
        probability: 25,
        solution: 'Ganti kipas radiator atau relay kipas.',
        urgency: 'high',
        estimatedCost: 'Rp 300,000 - 800,000'
      },
      {
        cause: 'Thermostat rusak',
        probability: 20,
        solution: 'Ganti thermostat baru sesuai spesifikasi.',
        urgency: 'high',
        estimatedCost: 'Rp 150,000 - 400,000'
      },
      {
        cause: 'Water pump rusak',
        probability: 15,
        solution: 'Ganti water pump dan periksa sistem pendingin.',
        urgency: 'high',
        estimatedCost: 'Rp 500,000 - 1,200,000'
      }
    ],
    overallUrgency: 'high',
    estimatedCostRange: 'Rp 150,000 - 1,500,000',
    recommendations: [
      'Segera matikan mesin jika overheat',
      'Jangan buka tutup radiator saat panas',
      'Periksa level coolant secara rutin'
    ]
  },
  'rem_blong': {
    problem: 'Rem blong atau tidak pakem',
    possibleCauses: [
      {
        cause: 'Minyak rem habis atau bocor',
        probability: 45,
        solution: 'Isi minyak rem dan perbaiki kebocoran. Bleeding sistem rem.',
        urgency: 'high',
        estimatedCost: 'Rp 100,000 - 500,000'
      },
      {
        cause: 'Kampas rem habis',
        probability: 30,
        solution: 'Ganti kampas rem depan dan belakang.',
        urgency: 'high',
        estimatedCost: 'Rp 200,000 - 600,000'
      },
      {
        cause: 'Master rem rusak',
        probability: 15,
        solution: 'Ganti master rem dan bleeding sistem.',
        urgency: 'high',
        estimatedCost: 'Rp 300,000 - 800,000'
      },
      {
        cause: 'Udara dalam sistem rem',
        probability: 10,
        solution: 'Bleeding sistem rem untuk mengeluarkan udara.',
        urgency: 'high',
        estimatedCost: 'Rp 50,000 - 150,000'
      }
    ],
    overallUrgency: 'high',
    estimatedCostRange: 'Rp 50,000 - 800,000',
    recommendations: [
      'BAHAYA! Segera perbaiki sistem rem',
      'Jangan berkendara jika rem bermasalah',
      'Periksa minyak rem secara rutin'
    ]
  },
  'ac_tidak_dingin': {
    problem: 'AC tidak dingin',
    possibleCauses: [
      {
        cause: 'Freon habis atau bocor',
        probability: 50,
        solution: 'Isi freon dan perbaiki kebocoran sistem AC.',
        urgency: 'low',
        estimatedCost: 'Rp 150,000 - 500,000'
      },
      {
        cause: 'Filter AC kotor',
        probability: 25,
        solution: 'Ganti atau bersihkan filter AC (cabin filter).',
        urgency: 'low',
        estimatedCost: 'Rp 50,000 - 150,000'
      },
      {
        cause: 'Kompresor AC rusak',
        probability: 15,
        solution: 'Service atau ganti kompresor AC.',
        urgency: 'medium',
        estimatedCost: 'Rp 800,000 - 2,500,000'
      },
      {
        cause: 'Kondensor kotor',
        probability: 10,
        solution: 'Bersihkan kondensor AC dari kotoran.',
        urgency: 'low',
        estimatedCost: 'Rp 100,000 - 200,000'
      }
    ],
    overallUrgency: 'low',
    estimatedCostRange: 'Rp 50,000 - 2,500,000',
    recommendations: [
      'Periksa filter AC secara rutin',
      'Nyalakan AC minimal 10 menit setiap minggu',
      'Service AC setiap 6 bulan'
    ]
  }
};

// Enhanced symptom database with keywords for better matching
export const SYMPTOMS_DATABASE: Symptom[] = [
  {
    id: 1,
    symptom: 'Mesin tidak mau hidup',
    category: 'Sistem Start',
    severity: 'high',
    keywords: ['mesin', 'tidak', 'hidup', 'mati', 'start', 'starter', 'nyala']
  },
  {
    id: 2,
    symptom: 'Suara mesin kasar',
    category: 'Mesin',
    severity: 'medium',
    keywords: ['suara', 'kasar', 'berisik', 'noise', 'mesin', 'rough']
  },
  {
    id: 3,
    symptom: 'Overheat/panas berlebihan',
    category: 'Sistem Pendingin',
    severity: 'high',
    keywords: ['overheat', 'panas', 'temperature', 'radiator', 'coolant']
  },
  {
    id: 4,
    symptom: 'Rem blong/tidak pakem',
    category: 'Sistem Rem',
    severity: 'high',
    keywords: ['rem', 'blong', 'tidak', 'pakem', 'brake', 'pedal']
  },
  {
    id: 5,
    symptom: 'AC tidak dingin',
    category: 'AC',
    severity: 'low',
    keywords: ['ac', 'tidak', 'dingin', 'panas', 'freon', 'cooling']
  },
  {
    id: 6,
    symptom: 'Lampu dashboard menyala',
    category: 'Kelistrikan',
    severity: 'medium',
    keywords: ['lampu', 'dashboard', 'warning', 'indikator', 'check', 'engine']
  },
  {
    id: 7,
    symptom: 'Konsumsi BBM boros',
    category: 'Sistem Bahan Bakar',
    severity: 'medium',
    keywords: ['bbm', 'boros', 'bensin', 'fuel', 'consumption', 'irit']
  },
  {
    id: 8,
    symptom: 'Getaran pada stir',
    category: 'Sistem Kemudi',
    severity: 'medium',
    keywords: ['getaran', 'stir', 'steering', 'vibration', 'goyang']
  },
  {
    id: 9,
    symptom: 'Asap hitam dari knalpot',
    category: 'Sistem Exhaust',
    severity: 'medium',
    keywords: ['asap', 'hitam', 'knalpot', 'exhaust', 'smoke']
  },
  {
    id: 10,
    symptom: 'Susah distarter',
    category: 'Sistem Start',
    severity: 'medium',
    keywords: ['susah', 'starter', 'start', 'hard', 'difficult']
  }
];

export class DiagnosisEngine {
  static diagnose(symptoms: number[]): DiagnosisResult | null {
    if (symptoms.length === 0) return null;

    // Map symptom IDs to diagnosis keys
    const symptomToDiagnosis: Record<number, string> = {
      1: 'mesin_tidak_hidup',
      2: 'suara_mesin_kasar',
      3: 'overheat',
      4: 'rem_blong',
      5: 'ac_tidak_dingin',
      10: 'mesin_tidak_hidup' // Susah distarter -> similar to mesin tidak hidup
    };

    // Get primary symptom
    const primarySymptom = symptoms[0];
    const diagnosisKey = symptomToDiagnosis[primarySymptom];
    
    if (!diagnosisKey || !DIAGNOSIS_DATABASE[diagnosisKey]) {
      return this.generateGenericDiagnosis(primarySymptom);
    }

    return DIAGNOSIS_DATABASE[diagnosisKey];
  }

  static diagnoseByText(text: string): DiagnosisResult | null {
    const lowerText = text.toLowerCase();
    
    // Find matching symptoms based on keywords
    const matchingSymptoms = SYMPTOMS_DATABASE.filter(symptom =>
      symptom.keywords.some(keyword => lowerText.includes(keyword))
    );

    if (matchingSymptoms.length === 0) {
      return this.generateGenericDiagnosis(0, text);
    }

    // Use the first matching symptom for diagnosis
    return this.diagnose([matchingSymptoms[0].id]);
  }

  private static generateGenericDiagnosis(symptomId: number, text?: string): DiagnosisResult {
    return {
      problem: text || 'Masalah tidak teridentifikasi',
      possibleCauses: [
        {
          cause: 'Perlu pemeriksaan lebih lanjut',
          probability: 80,
          solution: 'Bawa kendaraan ke bengkel untuk diagnosis yang lebih akurat',
          urgency: 'medium',
          estimatedCost: 'Rp 100,000 - 500,000'
        },
        {
          cause: 'Perawatan rutin diperlukan',
          probability: 20,
          solution: 'Lakukan service berkala sesuai jadwal',
          urgency: 'low',
          estimatedCost: 'Rp 200,000 - 800,000'
        }
      ],
      overallUrgency: 'medium',
      estimatedCostRange: 'Rp 100,000 - 800,000',
      recommendations: [
        'Konsultasikan dengan mekanik berpengalaman',
        'Jangan abaikan gejala yang muncul',
        'Lakukan perawatan rutin untuk mencegah kerusakan'
      ]
    };
  }

  static searchSymptoms(query: string): Symptom[] {
    const lowerQuery = query.toLowerCase();
    return SYMPTOMS_DATABASE.filter(symptom =>
      symptom.symptom.toLowerCase().includes(lowerQuery) ||
      symptom.category.toLowerCase().includes(lowerQuery) ||
      symptom.keywords.some(keyword => keyword.includes(lowerQuery))
    );
  }

  static getSymptomById(id: number): Symptom | undefined {
    return SYMPTOMS_DATABASE.find(symptom => symptom.id === id);
  }

  static getAllSymptoms(): Symptom[] {
    return SYMPTOMS_DATABASE;
  }
}