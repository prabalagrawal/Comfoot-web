import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  RotateCcw, 
  Activity, 
  Clock, 
  MapPin, 
  Footprints, 
  Zap,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Info,
  Sparkles,
  Stethoscope,
  ShieldAlert,
  Plus
} from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// --- Types ---

interface Option {
  id: string;
  text: string;
  scores: Record<string, number>;
}

interface Question {
  id: number;
  text: string;
  icon: React.ReactNode;
  options: Option[];
}

interface Result {
  id: string;
  title: string;
  explanation: string;
  causes: string[];
  tips: string[];
  products: Product[];
}

interface Product {
  name: string;
  description: string;
  bestFor: string;
  link: string;
}

// --- Data ---

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Where is your primary point of discomfort?",
    icon: <MapPin className="w-6 h-6" />,
    options: [
      { id: 'q1-1', text: "Heel (Bottom or back)", scores: { heel: 4, achilles: 1 } },
      { id: 'q1-2', text: "Arch (Middle of the foot)", scores: { flat: 4, fatigue: 1 } },
      { id: 'q1-3', text: "Big Toe Base (Bunion area)", scores: { bunion: 5 } },
      { id: 'q1-4', text: "Ball of the Foot (Forefoot)", scores: { fatigue: 2, flat: 1 } },
      { id: 'q1-5', text: "Numbness/Tingling throughout", scores: { diabetic: 5, fatigue: 1 } },
    ]
  },
  {
    id: 2,
    text: "When is the pain most intense?",
    icon: <Clock className="w-6 h-6" />,
    options: [
      { id: 'q2-1', text: "First steps after waking up", scores: { heel: 5, achilles: 2 } },
      { id: 'q2-2', text: "After standing for several hours", scores: { fatigue: 5, flat: 1 } },
      { id: 'q2-3', text: "During or immediately after exercise", scores: { achilles: 5, flat: 2 } },
      { id: 'q2-4', text: "While resting or at night", scores: { diabetic: 5, fatigue: 1 } },
      { id: 'q2-5', text: "Only when wearing specific shoes", scores: { bunion: 4, flat: 1 } },
    ]
  },
  {
    id: 3,
    text: "How would you describe the sensation?",
    icon: <Zap className="w-6 h-6" />,
    options: [
      { id: 'q3-1', text: "Sharp, stabbing pain", scores: { heel: 4, achilles: 1 } },
      { id: 'q3-2', text: "Dull, heavy ache", scores: { fatigue: 4, flat: 2 } },
      { id: 'q3-3', text: "Burning or electric-like", scores: { diabetic: 5 } },
      { id: 'q3-4', text: "Tightness or stiffness", scores: { achilles: 4, heel: 1 } },
      { id: 'q3-5', text: "Skin cracking or peeling", scores: { dry_cracked: 6 } },
    ]
  },
  {
    id: 4,
    text: "How do your shoes typically wear out?",
    icon: <Footprints className="w-6 h-6" />,
    options: [
      { id: 'q4-1', text: "Leaning inward (Inside edge)", scores: { flat: 5, fatigue: 1 } },
      { id: 'q4-2', text: "Leaning outward (Outside edge)", scores: { neutral: 2, heel: 1 } },
      { id: 'q4-3', text: "Heel area is completely worn", scores: { heel: 4, fatigue: 1 } },
      { id: 'q4-4', text: "Even wear across the sole", scores: { neutral: 5 } },
    ]
  },
  {
    id: 5,
    text: "How many hours do you spend on your feet daily?",
    icon: <Activity className="w-6 h-6" />,
    options: [
      { id: 'q5-1', text: "Less than 2 hours", scores: { neutral: 4 } },
      { id: 'q5-2', text: "2–5 hours", scores: { neutral: 1, fatigue: 3 } },
      { id: 'q5-3', text: "5–8 hours", scores: { fatigue: 4, heel: 1, flat: 1 } },
      { id: 'q5-4', text: "More than 8 hours", scores: { fatigue: 5, heel: 2, flat: 2 } },
    ]
  },
  {
    id: 6,
    text: "Do you notice any visible swelling?",
    icon: <ShieldAlert className="w-6 h-6" />,
    options: [
      { id: 'q6-1', text: "Yes, around the ankles", scores: { diabetic: 2, fatigue: 4 } },
      { id: 'q6-2', text: "Yes, at the back of the heel", scores: { achilles: 5 } },
      { id: 'q6-3', text: "Yes, at the big toe joint", scores: { bunion: 5 } },
      { id: 'q6-4', text: "No, but skin looks hard/cracked", scores: { dry_cracked: 5 } },
      { id: 'q6-5', text: "No visible swelling", scores: { neutral: 3 } },
    ]
  },
  {
    id: 7,
    text: "Do you have any of these conditions?",
    icon: <Stethoscope className="w-6 h-6" />,
    options: [
      { id: 'q7-1', text: "Diabetes or High Blood Sugar", scores: { diabetic: 6 } },
      { id: 'q7-2', text: "Arthritis or Joint Pain", scores: { bunion: 3, fatigue: 3 } },
      { id: 'q7-3', text: "Poor Circulation (Cold feet)", scores: { diabetic: 4, fatigue: 3 } },
      { id: 'q7-4', text: "None of the above", scores: { neutral: 3 } },
    ]
  },
  {
    id: 8,
    text: "What surface do you walk on most often?",
    icon: <MapPin className="w-6 h-6" />,
    options: [
      { id: 'q8-1', text: "Concrete or Hard Tiled Floors", scores: { fatigue: 5, heel: 2 } },
      { id: 'q8-2', text: "Carpet or Soft Office Floors", scores: { neutral: 3 } },
      { id: 'q8-3', text: "Uneven Outdoor Terrain", scores: { achilles: 4, flat: 1 } },
      { id: 'q8-4', text: "A mix of various surfaces", scores: { fatigue: 3 } },
    ]
  },
  {
    id: 9,
    text: "Have you had a foot injury in the last year?",
    icon: <ShieldAlert className="w-6 h-6" />,
    options: [
      { id: 'q9-1', text: "Yes, a recent sprain or strain", scores: { complex: 5, achilles: 1 } },
      { id: 'q9-2', text: "Yes, a fracture or surgery", scores: { complex: 6 } },
      { id: 'q9-3', text: "No significant injuries", scores: { neutral: 3 } },
    ]
  },
  {
    id: 10,
    text: "What does your foot arch look like?",
    icon: <Footprints className="w-6 h-6" />,
    options: [
      { id: 'q10-1', text: "High Arch (Visible gap)", scores: { neutral: 3, achilles: 1 } },
      { id: 'q10-2', text: "Low/Flat Arch (Touches floor)", scores: { flat: 6, fatigue: 3 } },
      { id: 'q10-3', text: "Normal/Neutral Arch", scores: { neutral: 5 } },
      { id: 'q10-4', text: "I'm not sure", scores: { neutral: 1 } },
    ]
  },
  {
    id: 11,
    text: "What is your primary footwear?",
    icon: <Zap className="w-6 h-6" />,
    options: [
      { id: 'q11-1', text: "Supportive Sneakers", scores: { neutral: 4 } },
      { id: 'q11-2', text: "Flat Shoes (Flats, Vans, etc.)", scores: { flat: 4, heel: 3, dry_cracked: 1 } },
      { id: 'q11-3', text: "Heels or Narrow Dress Shoes", scores: { bunion: 5, fatigue: 3 } },
      { id: 'q11-4', text: "Open-backed sandals or slippers", scores: { dry_cracked: 5, neutral: 1 } },
      { id: 'q11-5', text: "Safety Boots or Heavy Shoes", scores: { fatigue: 5, heel: 1 } },
    ]
  },
  {
    id: 12,
    text: "Does the pain improve with rest?",
    icon: <Clock className="w-6 h-6" />,
    options: [
      { id: 'q12-1', text: "Yes, almost immediately", scores: { fatigue: 5 } },
      { id: 'q12-2', text: "Yes, but takes several hours", scores: { heel: 3, achilles: 3 } },
      { id: 'q12-3', text: "No, the pain persists", scores: { diabetic: 4, complex: 3 } },
      { id: 'q12-4', text: "It actually feels worse after rest", scores: { heel: 5, achilles: 3 } },
    ]
  }
];

const RESULTS: Record<string, Result> = {
  flat: {
    id: 'flat',
    title: "Flat Feet / Overpronation Risk",
    explanation: "Your answers suggest that your arches may not be getting enough support, causing the foot to roll inward (overpronation). This can lead to strain in the ankles, knees, and even the lower back as your body compensates for the lack of a stable base. This is particularly common in individuals who stand for long hours or have a genetic predisposition.",
    causes: [
      "Genetic foot structure (inherited flat feet)",
      "Weakened tendons due to age or repetitive strain",
      "Prolonged standing on hard, unyielding surfaces",
      "Improper footwear lacking structural arch support",
      "Recent weight gain or pregnancy increasing pressure"
    ],
    tips: [
      "Try arch strengthening exercises like towel curls and marble pickups",
      "Avoid extremely flat footwear like flip-flops or worn-out sneakers",
      "Use proper arch support when standing long hours at work",
      "Choose shoes with firm mid-soles and a supportive heel counter",
      "Incorporate calf stretches to reduce tension on the plantar fascia"
    ],
    products: [
      {
        name: "Frido Rigid Arch Support Insole",
        description: "Rigid orthotic insoles designed to provide maximum support for collapsed arches and prevent overpronation.",
        bestFor: "Flat Feet & Severe Overpronation",
        link: "https://amzn.in/d/066diPwp"
      },
      {
        name: "Boldfit Arch Support Inserts",
        description: "Comfortable and durable arch support inserts that help reduce foot fatigue and maintain alignment.",
        bestFor: "Arch Strain & Daily Comfort",
        link: "https://amzn.in/d/0bgzXhjD"
      }
    ]
  },
  heel: {
    id: 'heel',
    title: "Heel Pain / Plantar Fasciitis Risk",
    explanation: "Your answers suggest that the heel area of your foot may be experiencing significant strain. This is commonly associated with irritation of the plantar fascia, a thick band of tissue that supports the arch. The sharp pain in the morning is a classic indicator of this condition.",
    causes: [
      "Long hours of static standing or walking on hard floors",
      "Tight calf muscles pulling on the heel bone",
      "Lack of adequate arch support in primary footwear",
      "Sudden increase in physical activity or high-impact exercise",
      "Inappropriate footwear for your specific foot type"
    ],
    tips: [
      "Stretching the calf and plantar fascia before getting out of bed",
      "Rolling a frozen water bottle under the foot for 15 minutes daily",
      "Using supportive footwear with deep heel cups",
      "Taking short 'movement breaks' if standing for long hours",
      "Applying ice to the heel area after a long day"
    ],
    products: [
      {
        name: "Frido Plantar Insole",
        description: "Premium orthotic insoles designed specifically for plantar fasciitis relief with targeted heel cushioning.",
        bestFor: "Heel Spurs & Plantar Fasciitis",
        link: "https://amzn.to/4rZCbsz"
      },
      {
        name: "Plantar Fasciitis Night Splint",
        description: "Soft, comfortable compression sock that keeps the foot in a gentle stretch overnight to reduce morning pain.",
        bestFor: "Chronic Heel Pain & Morning Stiffness",
        link: "https://amzn.to/4b0AXHN"
      }
    ]
  },
  fatigue: {
    id: 'fatigue',
    title: "Standing Job Foot Fatigue",
    explanation: "Long hours on your feet can lead to muscle exhaustion and poor circulation. Even with healthy feet, static standing puts constant pressure on the same points, leading to that 'heavy' or aching feeling. Your symptoms are typical for those in retail, healthcare, or hospitality.",
    causes: [
      "Static standing for over 4-6 hours daily",
      "Hard, unyielding floor surfaces like concrete or tile",
      "Poorly fitted or heavy work boots/shoes",
      "Lack of movement or weight shifting during the day",
      "Inadequate cushioning in current footwear"
    ],
    tips: [
      "Shift your weight frequently from one foot to the other",
      "Elevate your feet above heart level at the end of the day",
      "Use anti-fatigue mats at your primary workstation if possible",
      "Perform simple ankle circles and toe wiggles during breaks",
      "Consider compression socks to improve blood flow"
    ],
    products: [
      {
        name: "Anti-Fatigue Comfort Insoles",
        description: "Dual-layer foam technology that returns energy and reduces muscle vibration during long shifts.",
        bestFor: "Long Work Shifts & Standing Jobs",
        link: "https://amzn.to/4rZCbsz"
      },
      {
        name: "Graduated Compression Socks",
        description: "Improves blood flow and prevents swelling during long hours of standing or sitting.",
        bestFor: "Circulation & Leg Fatigue",
        link: "https://amzn.to/4b0AXHN"
      }
    ]
  },
  neutral: {
    id: 'neutral',
    title: "Neutral / Low Risk",
    explanation: "Your feet seem to be in good health! You likely have a neutral gait, which means your weight is distributed evenly across the foot. Maintaining this balance is key to long-term mobility and preventing future issues.",
    causes: [
      "Balanced foot structure and mechanics",
      "Proper footwear choices for your activity level",
      "Good muscle flexibility and strength",
      "Appropriate activity levels without excessive strain"
    ],
    tips: [
      "Continue wearing supportive shoes for high-impact activities",
      "Replace athletic shoes every 300-500 miles or 6 months",
      "Maintain a consistent stretching routine for lower limbs",
      "Stay hydrated to maintain healthy connective tissues",
      "Listen to your body and rest if you feel unusual discomfort"
    ],
    products: [
      {
        name: "Daily Wellness Insoles",
        description: "Lightweight cushioning to maintain comfort and prevent future issues during daily activities.",
        bestFor: "General Comfort & Maintenance",
        link: "https://amzn.in/d/0gh0wRDf"
      },
      {
        name: "Foot Massage Roller",
        description: "A simple tool to release tension and maintain flexibility in the foot muscles after a long day.",
        bestFor: "Recovery & Wellness",
        link: "https://amzn.to/4aFri8e"
      }
    ]
  },
  mixed: {
    id: 'mixed',
    title: "Overlapping Foot Concerns",
    explanation: "Your results indicate a combination of symptoms. You may be experiencing both arch strain and general fatigue, or a mix of heel sensitivity and structural misalignment. This is common when one issue leads to compensatory movements that strain other areas.",
    causes: [
      "Multiple contributing factors (e.g., flat feet + long standing hours)",
      "Compensatory movements due to initial discomfort",
      "Lack of specialized support for complex foot mechanics",
      "Transitioning to new activity levels without proper gear"
    ],
    tips: [
      "Focus on versatile support options that address both arch and heel",
      "Rotate your footwear daily to change pressure points",
      "Incorporate full-foot stretching and strengthening exercises",
      "Consult a specialist for a professional gait assessment"
    ],
    products: [
      {
        name: "All-Day Performance Insoles",
        description: "A hybrid design combining high-impact heel cushioning with adaptive arch support for mixed symptoms.",
        bestFor: "Mixed Symptoms & Versatile Daily Use",
        link: "https://amzn.to/4rZCbsz"
      },
      {
        name: "Foot Recovery Kit",
        description: "Includes a massage ball, resistance band, and compression sleeves for total foot care and recovery.",
        bestFor: "Comprehensive Recovery & Relief",
        link: "https://amzn.to/4aFri8e"
      }
    ]
  },
  bunion: {
    id: 'bunion',
    title: "Bunion / Hallux Valgus Risk",
    explanation: "Your answers suggest a high likelihood of bunion formation or aggravation. This is often caused by the big toe joint being pushed out of alignment, frequently due to narrow footwear or inherited foot structure.",
    causes: [
      "Narrow or tight-fitting shoes (especially high heels)",
      "Genetic predisposition to joint misalignment",
      "Foot stress or repetitive injuries to the toe joint",
      "Arthritis in the big toe joint"
    ],
    tips: [
      "Switch to shoes with a wide toe box to allow toes to spread",
      "Use bunion pads to reduce friction and pressure on the joint",
      "Try toe spacers during rest periods to encourage alignment",
      "Apply ice to the joint after long periods of standing or walking"
    ],
    products: [
      {
        name: "Frido Orthotics Bunion Corrector",
        description: "Advanced bunion corrector designed for effective toe realignment and pressure relief.",
        bestFor: "Hallux Valgus correction and pain relief",
        link: "https://amzn.to/4sW7nZN"
      },
      {
        name: "AGEasy Antara Bunion Corrector",
        description: "Comfortable bunion aid that helps in toe separation and alignment.",
        bestFor: "Daily wear and gradual correction",
        link: "https://amzn.to/4eHwhc4"
      }
    ]
  },
  diabetic: {
    id: 'diabetic',
    title: "Diabetic Foot Sensitivity",
    explanation: "Your symptoms of numbness or tingling are common indicators of diabetic neuropathy or circulation issues. This requires specialized care to prevent injuries that you might not feel due to reduced sensation.",
    causes: [
      "High blood sugar levels affecting nerve health",
      "Peripheral neuropathy (nerve damage)",
      "Poor circulation (peripheral artery disease)",
      "Pressure points in standard shoes causing undetected sores"
    ],
    tips: [
      "Perform daily foot inspections with a mirror to check for cuts or sores",
      "Never walk barefoot, even indoors, to avoid accidental injury",
      "Use seamless, non-binding socks designed for sensitive feet",
      "Keep skin moisturized but ensure the area between toes stays dry",
      "Schedule regular check-ups with a podiatrist for professional screening"
    ],
    products: [
      {
        name: "Kitcoz Foot Cream Roll on",
        description: "Convenient roll-on foot cream specifically formulated for intensive moisturizing of diabetic feet.",
        bestFor: "Moisturizing and skin integrity maintenance",
        link: "https://amzn.to/4mSq9zN"
      },
      {
        name: "Fixderma Foobetik Cream",
        description: "Expertly formulated cream for diabetic foot care, preventing dryness and infection.",
        bestFor: "Comprehensive diabetic foot skin health",
        link: "https://amzn.to/4cNsg3o"
      }
    ]
  },
  achilles: {
    id: 'achilles',
    title: "Achilles Tendinitis Risk",
    explanation: "The pain at the back of your heel suggests strain on the Achilles tendon. This is often an overuse injury from sudden increases in activity or tight calf muscles pulling on the tendon.",
    causes: [
      "Sudden increase in exercise intensity or duration",
      "Tight calf muscles putting excessive strain on the tendon",
      "Improper or worn-out footwear lacking heel stability",
      "Bone spurs on the heel bone (Haglund's deformity)"
    ],
    tips: [
      "Rest and avoid high-impact activities like running or jumping",
      "Perform gentle eccentric calf stretches (heel drops)",
      "Use heel lifts in your shoes to reduce tension on the tendon",
      "Apply ice to the back of the heel for 15-20 minutes after activity",
      "Consider a supportive sleeve to stabilize the tendon area"
    ],
    products: [
      {
        name: "Powerstep UltraFlexx Foot Rocker",
        description: "Ergonomic foot rocker that helps stretch the Achilles tendon and calf muscles effectively.",
        bestFor: "Tendon stretching and flexibility",
        link: "https://amzn.to/3ODWFsW"
      },
      {
        name: "FOVERA Foot & Calf Stretcher Belt",
        description: "Designed for safe and controlled stretching of the lower leg muscles and Achilles tendon.",
        bestFor: "Relieving tendon tightness",
        link: "https://amzn.to/4cuNSCK"
      }
    ]
  },
  dry_cracked: {
    id: 'dry_cracked',
    title: "Dry & Cracked Heels",
    explanation: "Your assessment suggests that the skin around your heels has become severely dry and thickened, leading to painful cracks or fissures. This is often caused by a combination of friction, pressure, and lack of adequate moisture.",
    causes: [
      "Prolonged standing on hard floors without cushioned socks",
      "Wearing open-backed shoes like sandals or flip-flops",
      "Low moisture levels in the skin due to environment or metabolic factors",
      "Cold, dry weather depleting natural skin oils",
      "Frequent use of harsh soaps that strip moisture"
    ],
    tips: [
      "Apply a thick, urea-based heel balm twice daily",
      "Wear moisturizing gel-lined heel socks overnight to lock in cream",
      "After soaking feet, gently use a pumice stone to remove dead skin",
      "Drink plenty of water to support skin hydration from within",
      "Choose closed-back shoes to reduce friction and skin hardening"
    ],
    products: [
      {
        name: "Bodywise Urea Foot Cream Roll",
        description: "Targeted roll-on application that softens hard calluses and repairs deep heel fissures.",
        bestFor: "Cracked Heel Repair & Softening",
        link: "https://amzn.to/3OMQ5jH"
      },
      {
        name: "Tifanso Moisturizing Heel Socks",
        description: "Comfortable socks with therapy gel linings that soften hard, dry, and cracked heels while you sleep.",
        bestFor: "Overnight Intensive Hydration",
        link: "https://amzn.to/4t1fFQ9"
      }
    ]
  },
  complex: {
    id: 'complex',
    title: "Complex Foot Patterns Detected",
    explanation: "Your assessment shows significant indicators for multiple foot conditions. When symptoms overlap this strongly, it often indicates complex biomechanical factors that require a professional evaluation to address the root cause.",
    causes: [
      "Interconnected structural issues (e.g., high arches + Achilles strain)",
      "Advanced compensatory strain from long-term misalignment",
      "Chronic inflammation in multiple zones of the foot",
      "Complex gait abnormalities requiring professional analysis"
    ],
    tips: [
      "Schedule a consultation with a Podiatrist for a full assessment",
      "Bring your most-worn shoes to your appointment for wear pattern analysis",
      "Avoid self-diagnosing complex overlaps which can lead to improper care",
      "Limit high-impact activities until you have a professional evaluation"
    ],
    products: [
      {
        name: "Custom Orthotic Consultation",
        description: "Professional gait analysis and custom-molded inserts tailored to your unique foot structure.",
        bestFor: "Complex & Multiple Conditions",
        link: "https://www.apma.org/findapodiatrist"
      },
      {
        name: "Frido Ultimate Support Bundle",
        description: "A comprehensive set including high-stability insoles and recovery tools for multi-zone relief.",
        bestFor: "Total Foot Support & Recovery",
        link: "https://amzn.to/4rZCbsz"
      }
    ]
  }
};

// --- Component ---

export const FootProblemQuiz: React.FC = () => {
  const [step, setStep] = useState<number>(0); // 0: Start, 1-12: Questions, 13: Result
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [scores, setScores] = useState<Record<string, number>>({
    heel: 0,
    flat: 0,
    fatigue: 0,
    neutral: 0,
    bunion: 0,
    diabetic: 0,
    achilles: 0,
    dry_cracked: 0,
    complex: 0
  });
  const [email, setEmail] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [contactInfo, setContactInfo] = useState('');
  const [formSubmitted, setFormSubmitted] = useState({ email: false, contact: false });

  const handleStart = () => setStep(1);

  const handleAnswer = (option: Option) => {
    const newAnswers = { ...answers, [step]: option.text };
    setAnswers(newAnswers);

    const newScores = {
      heel: scores.heel + (option.scores.heel || 0),
      flat: scores.flat + (option.scores.flat || 0),
      fatigue: scores.fatigue + (option.scores.fatigue || 0),
      neutral: scores.neutral + (option.scores.neutral || 0),
      bunion: scores.bunion + (option.scores.bunion || 0),
      diabetic: scores.diabetic + (option.scores.diabetic || 0),
      achilles: scores.achilles + (option.scores.achilles || 0),
      dry_cracked: scores.dry_cracked + (option.scores.dry_cracked || 0),
      complex: scores.complex + (option.scores.complex || 0)
    };
    setScores(newScores);

    if (step < 12) {
      setStep(step + 1);
    } else {
      setStep(13);
      saveResultToFirebase(newScores, newAnswers);
      saveResultToPostgres(newScores, newAnswers);
    }
  };

  const saveResultToFirebase = async (finalScores: Record<string, number>, finalAnswers: Record<number, string>) => {
    if (!auth.currentUser) return;

    setIsSaving(true);
    try {
      const result = getResultForSaving(finalScores);
      await addDoc(collection(db, 'users', auth.currentUser.uid, 'quizResults'), {
        scores: finalScores,
        answers: finalAnswers,
        resultId: result.id,
        resultTitle: result.title,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error saving quiz result to Firebase:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const saveResultToPostgres = async (finalScores: Record<string, number>, finalAnswers: Record<number, string>) => {
    try {
      const result = getResultForSaving(finalScores);
      await fetch('/api/quiz-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: auth.currentUser?.uid,
          scores: finalScores,
          resultId: result.id,
          resultTitle: result.title,
          answers: finalAnswers
        })
      });
    } catch (error) {
      console.error("Error saving quiz result to Postgres:", error);
    }
  };

  const sendEmailResults = async () => {
    if (!email || !email.includes('@')) return;
    
    setIsSendingEmail(true);
    const result = getResult();
    try {
      const response = await fetch('/api/send-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          resultTitle: result.title,
          explanation: result.explanation,
          tips: result.tips,
          products: result.products
        })
      });
      if (response.ok) {
        setEmailSent(true);
      }
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const getResultForSaving = (finalScores: Record<string, number>): Result => {
    const sortedScores = (Object.entries(finalScores) as [string, number][]).sort(([, a], [, b]) => b - a);
    const [topCategory] = sortedScores[0];
    return RESULTS[topCategory] || RESULTS.neutral;
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers({});
    setScores({
      heel: 0,
      flat: 0,
      fatigue: 0,
      neutral: 0,
      bunion: 0,
      diabetic: 0,
      achilles: 0,
      dry_cracked: 0,
      complex: 0
    });
    setEmailSent(false);
    setEmail('');
  };

  const findNearbyPodiatrists = () => {
    const query = "podiatrist near me";
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  const getResult = (): Result => {
    const sortedScores = (Object.entries(scores) as [string, number][]).sort(([, a], [, b]) => b - a);
    const [topCategory, topScore] = sortedScores[0];
    const [secondCategory, secondScore] = sortedScores[1];

    // Threshold for "High Score" - if two categories score 7 or more, it's complex
    const HIGH_SCORE_THRESHOLD = 7;

    if (topCategory === 'complex' || (topScore >= HIGH_SCORE_THRESHOLD && secondScore >= HIGH_SCORE_THRESHOLD && topCategory !== 'neutral' && secondCategory !== 'neutral')) {
      const complexResult = { ...RESULTS.complex };
      const topTitle = RESULTS[topCategory]?.title.split(' / ')[0] || topCategory;
      const secondTitle = RESULTS[secondCategory]?.title.split(' / ')[0] || secondCategory;
      complexResult.explanation = `Your assessment shows significant indicators for both ${topTitle} and ${secondTitle}. When symptoms overlap this strongly, it often indicates complex biomechanical factors that require a professional evaluation by a podiatrist.`;
      return complexResult;
    }

    if (topScore > 0 && (topScore - secondScore) <= 2 && topCategory !== 'neutral') {
      return RESULTS.mixed;
    }

    return RESULTS[topCategory] || RESULTS.neutral;
  };

  const handleShare = () => {
    const text = "I just checked my foot health on Comfoot.";
    const url = window.location.origin;
    if (navigator.share) {
      navigator.share({ title: 'Comfoot Quiz', text, url });
    } else {
      alert("Copy this to share: " + text + " " + url);
    }
  };

  const currentQuestion = QUESTIONS[step - 1];
  const progress = (step / 12) * 100;

  return (
    <section id="quiz" className="bg-brand-beige py-24 px-6" aria-labelledby="quiz-title">
      <div className="max-w-4xl mx-auto">
        <div className="sr-only" id="quiz-title">Foot Problem Finder Quiz</div>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center px-4"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-brand-orange/10 rounded-[2rem] mb-8">
                <Footprints className="w-8 h-8 md:w-10 md:h-10 text-brand-orange" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-brand-brown mb-6 md:mb-8 leading-[1.1] tracking-tight">
                Find Your Foot Problem in 60 Seconds
              </h2>
              <p className="text-lg md:text-xl text-brand-taupe/70 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed font-light">
                Answer a few quick questions to understand what your feet might be experiencing.
              </p>
              <p className="text-[10px] sm:text-xs text-brand-taupe/60 max-w-lg mx-auto mb-10 italic uppercase tracking-wider">
                Educational insights only. Not medical advice.
              </p>
              <button
                onClick={handleStart}
                aria-label="Start the foot problem finder quiz"
                className="group relative inline-flex items-center gap-3 bg-brand-brown text-white px-10 py-5 sm:px-12 sm:py-6 rounded-2xl font-bold text-sm sm:text-lg hover:bg-brand-orange transition-all duration-300 shadow-xl hover:shadow-brand-orange/20 active:scale-95"
              >
                Start Diagnostic
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step >= 1 && step <= 12 && (
            <motion.div
              key={`question-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 40
              }}
              role="region"
              aria-live="polite"
              className="bg-white rounded-[2.5rem] p-6 sm:p-10 md:p-12 shadow-soft border border-brand-brown/5"
            >
              {/* Progress Bar */}
              <div className="mb-8 md:mb-12">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-brand-orange uppercase tracking-[0.2em]">
                    Question {step} of 12
                  </span>
                  <span className="text-[10px] font-bold text-brand-taupe uppercase tracking-widest opacity-40">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div 
                  className="h-2 w-full bg-brand-brown/5 rounded-full overflow-hidden relative"
                  role="progressbar"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-brand-orange"
                  />
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col sm:flex-row items-center gap-4 mb-8 md:mb-10"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-beige rounded-2xl flex items-center justify-center text-brand-brown shrink-0">
                  {currentQuestion.icon}
                </div>
                <h3 className="text-xl md:text-3xl font-display font-bold text-brand-brown leading-tight text-center sm:text-left">
                  {currentQuestion.text}
                </h3>
              </motion.div>

              <motion.div 
                className="grid gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.2
                    }
                  }
                }}
              >
                {currentQuestion.options.map((option) => (
                  <motion.button
                    key={option.id}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option)}
                    aria-label={`Select option: ${option.text}`}
                    className="group flex items-center justify-between p-5 sm:p-6 md:p-8 rounded-2xl border-2 border-brand-beige hover:border-brand-orange hover:bg-brand-orange/5 transition-all duration-300 text-left active:scale-[0.98]"
                  >
                    <span className="text-base sm:text-lg md:text-xl font-medium text-brand-brown group-hover:text-brand-orange transition-colors">
                      {option.text}
                    </span>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-brand-beige group-hover:border-brand-orange flex items-center justify-center transition-all shrink-0 ml-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}

          {step === 13 && (
            <motion.div
              key="result"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              role="alert"
              aria-live="assertive"
              className="space-y-12"
            >
              {/* Email Results Section */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="bg-brand-orange text-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="p-2 sm:p-3 bg-white/20 rounded-xl shrink-0">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg md:text-xl font-bold">Email Your Results</h4>
                    <p className="text-white/70 text-[10px] sm:text-xs md:text-sm">Get a copy sent to your inbox.</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 sm:gap-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full sm:w-64 px-4 sm:px-5 py-3 sm:py-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 transition-all text-xs sm:text-sm"
                  />
                  <button 
                    onClick={sendEmailResults}
                    disabled={isSendingEmail || emailSent}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-brand-orange rounded-xl font-bold hover:bg-brand-beige transition-all disabled:opacity-50 text-[10px] sm:text-sm uppercase tracking-widest active:scale-[0.98] transition-transform"
                  >
                    {isSendingEmail ? 'Sending' : emailSent ? 'Sent!' : 'Send'}
                  </button>
                </div>
              </motion.div>
              {/* Gemini Deep Analysis Section */}
              {/* Find Podiatrists only */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="bg-brand-brown text-brand-beige rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-10 md:p-16 shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-brand-orange/10 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32 blur-3xl" />
                
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8 relative z-10">
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-orange rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                      <Stethoscope className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-3xl font-display font-bold">Professional Consultation</h3>
                      <p className="text-xs sm:text-base text-brand-beige/70 font-light max-w-sm">While we provide guidance, professional diagnosis is key to long-term foot health.</p>
                    </div>
                  </div>
                  
                  <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button 
                      onClick={findNearbyPodiatrists}
                      className="w-full sm:w-auto bg-white text-brand-brown px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold uppercase tracking-widest text-[10px] sm:text-xs hover:bg-brand-orange hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Find Podiatrists
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Result Header */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="bg-white rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-16 shadow-soft border border-brand-brown/5 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 md:h-3 bg-brand-orange" />
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-brand-orange/10 rounded-[1.5rem] md:rounded-full mb-6 md:mb-8">
                  <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-brand-orange" />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold text-brand-brown mb-4 md:mb-8 leading-tight tracking-tight">
                  {getResult().title}
                </h2>
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-orange mb-4 md:mb-6">The Clinical Core</h3>
                  <p className="text-lg md:text-2xl text-brand-taupe/80 leading-relaxed font-light italic">
                    "{getResult().explanation}"
                  </p>
                </div>
              </motion.div>

              {/* Tips & Causes Grid */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="grid md:grid-cols-2 gap-8"
              >
                <div className="bg-brand-brown text-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <div className="p-2 bg-brand-gold/10 rounded-xl shrink-0">
                      <Info className="w-5 h-5 md:w-6 md:h-6 text-brand-gold" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-display font-bold">Why This Happens</h3>
                  </div>
                  <ul className="space-y-4 md:space-y-5">
                    {getResult().causes.map((cause, i) => (
                      <li key={i} className="flex items-start gap-4 text-white/70 text-base md:text-lg font-light">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                        <span className="leading-relaxed">{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-soft border border-brand-brown/5">
                  <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <div className="p-2 bg-brand-orange/10 rounded-xl shrink-0">
                      <Zap className="w-5 h-5 md:w-6 md:h-6 text-brand-orange" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-brand-brown">Management Tips</h3>
                  </div>
                  <ul className="space-y-4 md:space-y-5">
                    {getResult().tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-4 text-brand-taupe text-base md:text-lg font-light">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-2.5 shrink-0" />
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Product Recommendations */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="pt-8"
              >
                <div className="text-center mb-12">
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-brand-brown mb-4">
                    Suggested Support Options
                  </h3>
                  <p className="text-brand-taupe/70 font-light">Curated solutions tailored to your specific patterns.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {getResult().products.map((product, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-soft border border-brand-brown/5 flex flex-col group hover:border-brand-orange/20 transition-all"
                    >
                      <div className="inline-block px-4 py-1.5 bg-brand-orange/5 text-brand-orange text-[9px] md:text-[10px] font-bold rounded-full mb-6 self-start uppercase tracking-[0.2em] border border-brand-orange/10">
                        {product.bestFor}
                      </div>
                      <h4 className="text-xl md:text-2xl font-display font-bold text-brand-brown mb-4 group-hover:text-brand-orange transition-colors">{product.name}</h4>
                      <p className="text-sm md:text-base text-brand-taupe/90 mb-8 flex-grow leading-relaxed font-light">
                        {product.description}
                      </p>
                      <a 
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Check support options for ${product.name}`}
                        className="w-full inline-flex items-center justify-center gap-3 bg-brand-brown text-brand-beige py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-brand-orange transition-all duration-300 shadow-lg active:scale-95"
                      >
                        Check Support Options
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Conversion Features */}
              <div className="bg-brand-beige/80 backdrop-blur-sm rounded-[3rem] p-10 md:p-16 border border-brand-brown/10 space-y-12">
                <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                  {/* Email Guide */}
                  <div className="space-y-4 sm:space-y-6">
                    <h4 className="text-xl sm:text-2xl font-display font-bold text-brand-brown">Get Your Free Mini Foot Care Guide</h4>
                    <p className="text-sm sm:text-base text-brand-taupe font-light">A structured PDF guide to help you manage your foot wellness at home.</p>
                    {!formSubmitted.email ? (
                      <form 
                        onSubmit={async (e) => { 
                          e.preventDefault(); 
                          try {
                            await fetch('/api/leads', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ type: 'email_guide', value: email, resultId: getResult().id }),
                            });
                            setFormSubmitted(prev => ({ ...prev, email: true })); 
                          } catch (err) {
                            console.error('Failed to submit lead', err);
                          }
                        }}
                        className="flex flex-col gap-3"
                      >
                        <input 
                          type="email" 
                          required
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white border border-brand-brown/10 rounded-xl sm:rounded-2xl py-3.5 sm:py-4 px-5 sm:px-6 text-xs sm:text-sm focus:outline-none focus:border-brand-orange transition-colors"
                        />
                        <button type="submit" className="bg-brand-orange text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold uppercase tracking-widest text-[10px] sm:text-xs hover:bg-brand-orange/90 transition-all shadow-lg active:scale-[0.98]">
                          Get Free Guide
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-3 text-brand-orange font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span>Guide sent to your email!</span>
                      </div>
                    )}
                  </div>

                  {/* Product Links */}
                  <div className="space-y-4 sm:space-y-6">
                    <h4 className="text-xl sm:text-2xl font-display font-bold text-brand-brown">Send Me Product Links</h4>
                    <p className="text-sm sm:text-base text-brand-taupe font-light">Receive direct links to recommended gear on WhatsApp.</p>
                    {!formSubmitted.contact ? (
                      <form 
                        onSubmit={async (e) => { 
                          e.preventDefault(); 
                          try {
                            await fetch('/api/leads', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ type: 'product_links', value: contactInfo, resultId: getResult().id }),
                            });
                            setFormSubmitted(prev => ({ ...prev, contact: true })); 
                          } catch (err) {
                            console.error('Failed to submit lead', err);
                          }
                        }}
                        className="flex flex-col gap-3"
                      >
                        <input 
                          type="text" 
                          required
                          placeholder="Phone Number"
                          value={contactInfo}
                          onChange={(e) => setContactInfo(e.target.value)}
                          className="w-full bg-white border border-brand-brown/10 rounded-xl sm:rounded-2xl py-3.5 sm:py-4 px-5 sm:px-6 text-xs sm:text-sm focus:outline-none focus:border-brand-orange transition-colors"
                        />
                        <button type="submit" className="bg-brand-brown text-brand-beige py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold uppercase tracking-widest text-[10px] sm:text-xs hover:bg-brand-orange transition-all shadow-lg active:scale-[0.98]">
                          Send Me Links
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-3 text-brand-orange font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span>Links are on the way!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Share & Restart */}
                <div className="pt-12 border-t border-brand-brown/10 flex flex-col sm:flex-row items-center justify-center gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-taupe">Was this helpful?</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={async () => {
                            try {
                              await fetch('/api/feedback', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  userId: auth.currentUser?.uid,
                                  resultId: getResult().id,
                                  rating: star
                                })
                              });
                              alert("Thank you for your feedback!");
                            } catch (err) {
                              console.error("Failed to save feedback", err);
                            }
                          }}
                          className="p-1 text-brand-taupe hover:text-brand-orange transition-colors"
                        >
                          <Sparkles className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-3 text-brand-brown font-bold uppercase tracking-widest text-xs hover:text-brand-orange transition-colors"
                  >
                    <Activity className="w-4 h-4" />
                    Share My Results
                  </button>
                  {auth.currentUser && (
                    <button 
                      onClick={async () => {
                        const result = getResult();
                        try {
                          await addDoc(collection(db, 'users', auth.currentUser!.uid, 'journal'), {
                            date: new Date().toISOString().split('T')[0],
                            painLevel: Math.max(...Object.values(scores)), // Use highest score as proxy
                            symptoms: [result.title],
                            notes: `Quiz Result: ${result.title}. ${result.explanation.substring(0, 100)}...`,
                            activityLevel: 'moderate',
                            userId: auth.currentUser!.uid,
                            createdAt: serverTimestamp()
                          });
                          alert("Saved to your journal!");
                        } catch (err) {
                          console.error("Failed to save to journal", err);
                        }
                      }}
                      className="flex items-center gap-3 text-brand-orange font-bold uppercase tracking-widest text-xs hover:text-brand-brown transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Save to Journal
                    </button>
                  )}
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-3 text-brand-taupe hover:text-brand-brown font-bold uppercase tracking-widest text-xs transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restart Quiz
                  </button>
                </div>
                <div className="text-center mt-8">
                  <p className="text-[9px] text-brand-taupe/40 uppercase tracking-[0.2em] font-bold">
                    Your data helps us train our AI for better recommendations
                  </p>
                </div>
              </div>

              {/* Final Disclaimer */}
              <div className="text-center pt-8">
                <p className="text-[10px] text-brand-taupe/50 leading-relaxed italic max-w-2xl mx-auto">
                  This quiz provides general educational insights and should not be considered medical diagnosis or professional medical advice.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
