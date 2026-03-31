// Mock data for SymptoScan

export interface Symptom {
  id: string;
  name: string;
  category: string;
  value: string;
}

export interface Disease {
  name: string;
  confidence: number;
  description: string;
  precautions: string[];
  severity: 'low' | 'medium' | 'high';
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  experience: string;
  availability: 'Available' | 'Busy' | 'Offline';
  consultationFee: number;
  avatar: string;
  patients: number;
  education: string;
}

export interface ChatMessage {
  id: string;
  sender: 'patient' | 'doctor';
  message: string;
  timestamp: string;
}

export interface PredictionHistory {
  id: string;
  date: string;
  disease: string;
  confidence: number;
  status: 'Pending' | 'Consulted' | 'Resolved';
}

export interface ConsultationRequest {
  id: string;
  patientName: string;
  age: number;
  symptoms: string[];
  predictedDisease: string;
  urgency: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Accepted' | 'Completed';
  requestedAt: string;
}

// Symptoms database
export const symptoms: Symptom[] = [
  { id: '1', name: 'Abdominal Pain', category: 'Musculoskeletal', value: 'abdominal_pain' },
  { id: '2', name: 'Abnormal Menstruation', category: 'General', value: 'abnormal_menstruation' },
  { id: '3', name: 'Acidity', category: 'General', value: 'acidity' },
  { id: '4', name: 'Acute Liver Failure', category: 'General', value: 'acute_liver_failure' },
  { id: '5', name: 'Altered Sensorium', category: 'Neurological', value: 'altered_sensorium' },
  { id: '6', name: 'Anxiety', category: 'General', value: 'anxiety' },
  { id: '7', name: 'Back Pain', category: 'Musculoskeletal', value: 'back_pain' },
  { id: '8', name: 'Belly Pain', category: 'Musculoskeletal', value: 'belly_pain' },
  { id: '9', name: 'Blackheads', category: 'Neurological', value: 'blackheads' },
  { id: '10', name: 'Bladder Discomfort', category: 'General', value: 'bladder_discomfort' },
  { id: '11', name: 'Blister', category: 'General', value: 'blister' },
  { id: '12', name: 'Blood In Sputum', category: 'General', value: 'blood_in_sputum' },
  { id: '13', name: 'Bloody Stool', category: 'General', value: 'bloody_stool' },
  { id: '14', name: 'Blurred And Distorted Vision', category: 'General', value: 'blurred_and_distorted_vision' },
  { id: '15', name: 'Breathlessness', category: 'Respiratory', value: 'breathlessness' },
  { id: '16', name: 'Brittle Nails', category: 'General', value: 'brittle_nails' },
  { id: '17', name: 'Bruising', category: 'General', value: 'bruising' },
  { id: '18', name: 'Burning Micturition', category: 'General', value: 'burning_micturition' },
  { id: '19', name: 'Chest Pain', category: 'Musculoskeletal', value: 'chest_pain' },
  { id: '20', name: 'Chills', category: 'General', value: 'chills' },
  { id: '21', name: 'Cold Hands And Feets', category: 'General', value: 'cold_hands_and_feets' },
  { id: '22', name: 'Coma', category: 'General', value: 'coma' },
  { id: '23', name: 'Congestion', category: 'General', value: 'congestion' },
  { id: '24', name: 'Constipation', category: 'General', value: 'constipation' },
  { id: '25', name: 'Continuous Feel Of Urine', category: 'General', value: 'continuous_feel_of_urine' },
  { id: '26', name: 'Continuous Sneezing', category: 'General', value: 'continuous_sneezing' },
  { id: '27', name: 'Cough', category: 'Respiratory', value: 'cough' },
  { id: '28', name: 'Cramps', category: 'General', value: 'cramps' },
  { id: '29', name: 'Dark Urine', category: 'General', value: 'dark_urine' },
  { id: '30', name: 'Dehydration', category: 'General', value: 'dehydration' },
  { id: '31', name: 'Depression', category: 'General', value: 'depression' },
  { id: '32', name: 'Diarrhoea', category: 'General', value: 'diarrhoea' },
  { id: '33', name: 'Dischromic  Patches', category: 'General', value: 'dischromic _patches' },
  { id: '34', name: 'Distention Of Abdomen', category: 'Digestive', value: 'distention_of_abdomen' },
  { id: '35', name: 'Dizziness', category: 'Neurological', value: 'dizziness' },
  { id: '36', name: 'Drying And Tingling Lips', category: 'General', value: 'drying_and_tingling_lips' },
  { id: '37', name: 'Enlarged Thyroid', category: 'General', value: 'enlarged_thyroid' },
  { id: '38', name: 'Excessive Hunger', category: 'General', value: 'excessive_hunger' },
  { id: '39', name: 'Extra Marital Contacts', category: 'General', value: 'extra_marital_contacts' },
  { id: '40', name: 'Family History', category: 'General', value: 'family_history' },
  { id: '41', name: 'Fast Heart Rate', category: 'General', value: 'fast_heart_rate' },
  { id: '42', name: 'Fatigue', category: 'General', value: 'fatigue' },
  { id: '43', name: 'Fluid Overload', category: 'General', value: 'fluid_overload' },
  { id: '44', name: 'Foul Smell Of Urine', category: 'General', value: 'foul_smell_of_urine' },
  { id: '45', name: 'Headache', category: 'Musculoskeletal', value: 'headache' },
  { id: '46', name: 'High Fever', category: 'General', value: 'high_fever' },
  { id: '47', name: 'Hip Joint Pain', category: 'Musculoskeletal', value: 'hip_joint_pain' },
  { id: '48', name: 'History Of Alcohol Consumption', category: 'General', value: 'history_of_alcohol_consumption' },
  { id: '49', name: 'Increased Appetite', category: 'General', value: 'increased_appetite' },
  { id: '50', name: 'Indigestion', category: 'General', value: 'indigestion' },
  { id: '51', name: 'Inflammatory Nails', category: 'General', value: 'inflammatory_nails' },
  { id: '52', name: 'Internal Itching', category: 'General', value: 'internal_itching' },
  { id: '53', name: 'Irregular Sugar Level', category: 'General', value: 'irregular_sugar_level' },
  { id: '54', name: 'Irritability', category: 'General', value: 'irritability' },
  { id: '55', name: 'Irritation In Anus', category: 'General', value: 'irritation_in_anus' },
  { id: '56', name: 'Itching', category: 'General', value: 'itching' },
  { id: '57', name: 'Joint Pain', category: 'Musculoskeletal', value: 'joint_pain' },
  { id: '58', name: 'Knee Pain', category: 'Musculoskeletal', value: 'knee_pain' },
  { id: '59', name: 'Lack Of Concentration', category: 'General', value: 'lack_of_concentration' },
  { id: '60', name: 'Lethargy', category: 'General', value: 'lethargy' },
  { id: '61', name: 'Loss Of Appetite', category: 'General', value: 'loss_of_appetite' },
  { id: '62', name: 'Loss Of Balance', category: 'General', value: 'loss_of_balance' },
  { id: '63', name: 'Loss Of Smell', category: 'General', value: 'loss_of_smell' },
  { id: '64', name: 'Malaise', category: 'General', value: 'malaise' },
  { id: '65', name: 'Mild Fever', category: 'General', value: 'mild_fever' },
  { id: '66', name: 'Mood Swings', category: 'General', value: 'mood_swings' },
  { id: '67', name: 'Movement Stiffness', category: 'General', value: 'movement_stiffness' },
  { id: '68', name: 'Mucoid Sputum', category: 'General', value: 'mucoid_sputum' },
  { id: '69', name: 'Muscle Pain', category: 'Musculoskeletal', value: 'muscle_pain' },
  { id: '70', name: 'Muscle Wasting', category: 'General', value: 'muscle_wasting' },
  { id: '71', name: 'Muscle Weakness', category: 'General', value: 'muscle_weakness' },
  { id: '72', name: 'Nausea', category: 'Digestive', value: 'nausea' },
  { id: '73', name: 'Neck Pain', category: 'Musculoskeletal', value: 'neck_pain' },
  { id: '74', name: 'Nodal Skin Eruptions', category: 'Dermatological', value: 'nodal_skin_eruptions' },
  { id: '75', name: 'Obesity', category: 'General', value: 'obesity' },
  { id: '76', name: 'Pain Behind The Eyes', category: 'Musculoskeletal', value: 'pain_behind_the_eyes' },
  { id: '77', name: 'Pain During Bowel Movements', category: 'Musculoskeletal', value: 'pain_during_bowel_movements' },
  { id: '78', name: 'Pain In Anal Region', category: 'Musculoskeletal', value: 'pain_in_anal_region' },
  { id: '79', name: 'Painful Walking', category: 'Musculoskeletal', value: 'painful_walking' },
  { id: '80', name: 'Palpitations', category: 'General', value: 'palpitations' },
  { id: '81', name: 'Passage Of Gases', category: 'General', value: 'passage_of_gases' },
  { id: '82', name: 'Patches In Throat', category: 'General', value: 'patches_in_throat' },
  { id: '83', name: 'Phlegm', category: 'General', value: 'phlegm' },
  { id: '84', name: 'Polyuria', category: 'General', value: 'polyuria' },
  { id: '85', name: 'Prominent Veins On Calf', category: 'General', value: 'prominent_veins_on_calf' },
  { id: '86', name: 'Puffy Face And Eyes', category: 'General', value: 'puffy_face_and_eyes' },
  { id: '87', name: 'Pus Filled Pimples', category: 'General', value: 'pus_filled_pimples' },
  { id: '88', name: 'Receiving Blood Transfusion', category: 'General', value: 'receiving_blood_transfusion' },
  { id: '89', name: 'Receiving Unsterile Injections', category: 'General', value: 'receiving_unsterile_injections' },
  { id: '90', name: 'Red Sore Around Nose', category: 'General', value: 'red_sore_around_nose' },
  { id: '91', name: 'Red Spots Over Body', category: 'General', value: 'red_spots_over_body' },
  { id: '92', name: 'Redness Of Eyes', category: 'General', value: 'redness_of_eyes' },
  { id: '93', name: 'Restlessness', category: 'General', value: 'restlessness' },
  { id: '94', name: 'Runny Nose', category: 'General', value: 'runny_nose' },
  { id: '95', name: 'Rusty Sputum', category: 'General', value: 'rusty_sputum' },
  { id: '96', name: 'Scurring', category: 'General', value: 'scurring' },
  { id: '97', name: 'Shivering', category: 'General', value: 'shivering' },
  { id: '98', name: 'Silver Like Dusting', category: 'General', value: 'silver_like_dusting' },
  { id: '99', name: 'Sinus Pressure', category: 'General', value: 'sinus_pressure' },
  { id: '100', name: 'Skin Peeling', category: 'Dermatological', value: 'skin_peeling' },
  { id: '101', name: 'Skin Rash', category: 'Dermatological', value: 'skin_rash' },
  { id: '102', name: 'Slurred Speech', category: 'General', value: 'slurred_speech' },
  { id: '103', name: 'Small Dents In Nails', category: 'General', value: 'small_dents_in_nails' },
  { id: '104', name: 'Spinning Movements', category: 'General', value: 'spinning_movements' },
  { id: '105', name: 'Spotting  Urination', category: 'General', value: 'spotting_ urination' },
  { id: '106', name: 'Stiff Neck', category: 'General', value: 'stiff_neck' },
  { id: '107', name: 'Stomach Bleeding', category: 'Digestive', value: 'stomach_bleeding' },
  { id: '108', name: 'Stomach Pain', category: 'Musculoskeletal', value: 'stomach_pain' },
  { id: '109', name: 'Sunken Eyes', category: 'General', value: 'sunken_eyes' },
  { id: '110', name: 'Sweating', category: 'General', value: 'sweating' },
  { id: '111', name: 'Swelled Lymph Nodes', category: 'General', value: 'swelled_lymph_nodes' },
  { id: '112', name: 'Swelling Joints', category: 'General', value: 'swelling_joints' },
  { id: '113', name: 'Swelling Of Stomach', category: 'Digestive', value: 'swelling_of_stomach' },
  { id: '114', name: 'Swollen Blood Vessels', category: 'General', value: 'swollen_blood_vessels' },
  { id: '115', name: 'Swollen Extremeties', category: 'General', value: 'swollen_extremeties' },
  { id: '116', name: 'Swollen Legs', category: 'General', value: 'swollen_legs' },
  { id: '117', name: 'Throat Irritation', category: 'General', value: 'throat_irritation' },
  { id: '118', name: 'Toxic Look (Typhos)', category: 'General', value: 'toxic_look_(typhos)' },
  { id: '119', name: 'Ulcers On Tongue', category: 'General', value: 'ulcers_on_tongue' },
  { id: '120', name: 'Unsteadiness', category: 'General', value: 'unsteadiness' },
  { id: '121', name: 'Visual Disturbances', category: 'General', value: 'visual_disturbances' },
  { id: '122', name: 'Vomiting', category: 'Digestive', value: 'vomiting' },
  { id: '123', name: 'Watering From Eyes', category: 'General', value: 'watering_from_eyes' },
  { id: '124', name: 'Weakness In Limbs', category: 'General', value: 'weakness_in_limbs' },
  { id: '125', name: 'Weakness Of One Body Side', category: 'General', value: 'weakness_of_one_body_side' },
  { id: '126', name: 'Weight Gain', category: 'General', value: 'weight_gain' },
  { id: '127', name: 'Weight Loss', category: 'General', value: 'weight_loss' },
  { id: '128', name: 'Yellow Crust Ooze', category: 'General', value: 'yellow_crust_ooze' },
  { id: '129', name: 'Yellow Urine', category: 'General', value: 'yellow_urine' },
  { id: '130', name: 'Yellowing Of Eyes', category: 'General', value: 'yellowing_of_eyes' },
  { id: '131', name: 'Yellowish Skin', category: 'Dermatological', value: 'yellowish_skin' },
  { id: '132', name: 'Scurrying', category: 'General', value: 'scurrying' },
  { id: '133', name: 'Tiredness', category: 'General', value: 'tiredness' },
  { id: '134', name: 'Loss Of Taste', category: 'General', value: 'loss_of_taste' },
  { id: '135', name: 'Spotting Urination', category: 'General', value: 'spotting_urination' },
  { id: '136', name: 'Dyschromic Patches', category: 'General', value: 'dyschromic_patches' },
  { id: '137', name: 'Cold Hands And Feet', category: 'General', value: 'cold_hands_and_feet' },
  { id: '138', name: 'Swollen Extremities', category: 'General', value: 'swollen_extremities' },
  { id: '139', name: 'Toxic Look (Typhus)', category: 'General', value: 'toxic_look_(typhus)' },
];

// Doctors database
export const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'General Physician',
    rating: 4.8,
    experience: '12 years',
    availability: 'Available',
    consultationFee: 50,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    patients: 1240,
    education: 'MD, Harvard Medical School',
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Cardiologist',
    rating: 4.9,
    experience: '15 years',
    availability: 'Available',
    consultationFee: 75,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    patients: 980,
    education: 'MD, Johns Hopkins University',
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Neurologist',
    rating: 4.7,
    experience: '10 years',
    availability: 'Busy',
    consultationFee: 80,
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    patients: 750,
    education: 'MD, Stanford University',
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialization: 'Pulmonologist',
    rating: 4.6,
    experience: '8 years',
    availability: 'Available',
    consultationFee: 65,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
    patients: 620,
    education: 'MD, Yale School of Medicine',
  },
  {
    id: '5',
    name: 'Dr. Priya Sharma',
    specialization: 'Dermatologist',
    rating: 4.9,
    experience: '14 years',
    availability: 'Available',
    consultationFee: 60,
    avatar: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400',
    patients: 1150,
    education: 'MD, UCLA Medical Center',
  },
  {
    id: '6',
    name: 'Dr. Robert Martinez',
    specialization: 'Gastroenterologist',
    rating: 4.8,
    experience: '11 years',
    availability: 'Offline',
    consultationFee: 70,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
    patients: 890,
    education: 'MD, Mayo Clinic',
  },
];

// Sample prediction history
export const predictionHistory: PredictionHistory[] = [
  {
    id: '1',
    date: '2026-02-15',
    disease: 'Common Flu',
    confidence: 87,
    status: 'Consulted',
  },
  {
    id: '2',
    date: '2026-02-10',
    disease: 'Migraine',
    confidence: 92,
    status: 'Resolved',
  },
  {
    id: '3',
    date: '2026-01-28',
    disease: 'Allergic Rhinitis',
    confidence: 78,
    status: 'Resolved',
  },
  {
    id: '4',
    date: '2026-01-15',
    disease: 'Gastritis',
    confidence: 85,
    status: 'Consulted',
  },
];

// Sample consultation requests for doctors
export const consultationRequests: ConsultationRequest[] = [
  {
    id: '1',
    patientName: 'John Smith',
    age: 35,
    symptoms: ['Fever', 'Cough', 'Fatigue'],
    predictedDisease: 'Common Flu',
    urgency: 'Medium',
    status: 'Pending',
    requestedAt: '2026-02-17 10:30 AM',
  },
  {
    id: '2',
    patientName: 'Emma Davis',
    age: 28,
    symptoms: ['Headache', 'Nausea', 'Dizziness'],
    predictedDisease: 'Migraine',
    urgency: 'High',
    status: 'Pending',
    requestedAt: '2026-02-17 09:15 AM',
  },
  {
    id: '3',
    patientName: 'Michael Brown',
    age: 42,
    symptoms: ['Chest Pain', 'Shortness of Breath'],
    predictedDisease: 'Angina',
    urgency: 'High',
    status: 'Accepted',
    requestedAt: '2026-02-17 08:00 AM',
  },
  {
    id: '4',
    patientName: 'Lisa Anderson',
    age: 31,
    symptoms: ['Skin Rash', 'Itching'],
    predictedDisease: 'Eczema',
    urgency: 'Low',
    status: 'Completed',
    requestedAt: '2026-02-16 02:45 PM',
  },
];

// Disease prediction function (mock)
export function predictDisease(selectedSymptoms: string[]): Disease {
  const predictions: { [key: string]: Disease } = {
    'fever_cough': {
      name: 'Common Flu',
      confidence: 87,
      description: 'Influenza (flu) is a contagious respiratory illness caused by influenza viruses.',
      precautions: [
        'Rest and stay hydrated',
        'Take over-the-counter pain relievers',
        'Avoid contact with others',
        'Cover your mouth when coughing',
        'Wash hands frequently',
      ],
      severity: 'medium',
    },
    'headache_nausea': {
      name: 'Migraine',
      confidence: 92,
      description: 'A migraine is a headache that can cause severe throbbing pain or a pulsing sensation.',
      precautions: [
        'Rest in a quiet, dark room',
        'Apply cold or hot compress',
        'Avoid triggers like bright lights',
        'Stay hydrated',
        'Consider pain medication',
      ],
      severity: 'medium',
    },
    'chest_pain': {
      name: 'Angina',
      confidence: 78,
      description: 'Angina is chest pain or discomfort caused when your heart muscle doesn\'t get enough oxygen-rich blood.',
      precautions: [
        'Seek immediate medical attention',
        'Rest and avoid physical exertion',
        'Take prescribed medications',
        'Monitor symptoms closely',
        'Call emergency services if severe',
      ],
      severity: 'high',
    },
    'abdominal_pain': {
      name: 'Gastritis',
      confidence: 85,
      description: 'Gastritis is inflammation of the stomach lining, often caused by infection or irritation.',
      precautions: [
        'Eat smaller, more frequent meals',
        'Avoid spicy and acidic foods',
        'Limit alcohol consumption',
        'Take antacids if needed',
        'Reduce stress',
      ],
      severity: 'medium',
    },
    'default': {
      name: 'General Viral Infection',
      confidence: 75,
      description: 'Based on your symptoms, you may have a viral infection. Symptoms are common and usually resolve on their own.',
      precautions: [
        'Get plenty of rest',
        'Stay hydrated',
        'Monitor your temperature',
        'Eat nutritious foods',
        'Consult a doctor if symptoms worsen',
      ],
      severity: 'low',
    },
  };

  // Simple prediction logic based on symptoms
  const symptomSet = selectedSymptoms.map(s => s.toLowerCase()).join('_');

  if (symptomSet.includes('fever') && symptomSet.includes('cough')) {
    return predictions['fever_cough'];
  } else if (symptomSet.includes('headache') && symptomSet.includes('nausea')) {
    return predictions['headache_nausea'];
  } else if (symptomSet.includes('chest pain')) {
    return predictions['chest_pain'];
  } else if (symptomSet.includes('abdominal pain')) {
    return predictions['abdominal_pain'];
  }

  return predictions['default'];
}

// Sample chat messages
export const sampleChatMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'doctor',
    message: 'Hello! I\'ve reviewed your symptoms and prediction report. How are you feeling right now?',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    sender: 'patient',
    message: 'Hi Doctor, I\'m still experiencing fever and cough. It\'s been 3 days now.',
    timestamp: '10:32 AM',
  },
  {
    id: '3',
    sender: 'doctor',
    message: 'I understand. Have you been taking any medication? Also, is the fever continuous or intermittent?',
    timestamp: '10:33 AM',
  },
  {
    id: '4',
    sender: 'patient',
    message: 'I\'ve been taking paracetamol. The fever comes and goes, usually higher in the evening.',
    timestamp: '10:35 AM',
  },
  {
    id: '5',
    sender: 'doctor',
    message: 'That\'s typical for viral infections. Continue the paracetamol, stay hydrated, and rest. I\'ll prescribe some additional medication that should help. If fever persists beyond 5 days, we should do some tests.',
    timestamp: '10:37 AM',
  },
];

// Admin dashboard statistics
export const adminStats = {
  totalUsers: 12458,
  totalPredictions: 8934,
  totalConsultations: 3421,
  activeUsers: 2891,
  monthlyGrowth: 15.3,
  patientCount: 10234,
  doctorCount: 124,
  adminCount: 8,
};
