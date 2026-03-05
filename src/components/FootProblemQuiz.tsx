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
  Info
} from 'lucide-react';

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
    text: "Where do you usually feel discomfort?",
    icon: <MapPin className="w-6 h-6" />,
    options: [
      { id: 'q1-1', text: "Heel", scores: { heel: 3, achilles: 1 } },
      { id: 'q1-2', text: "Arch (middle of foot)", scores: { flat: 3, fatigue: 1 } },
      { id: 'q1-3', text: "Base of the big toe", scores: { bunion: 4 } },
      { id: 'q1-4', text: "Back of the ankle/heel", scores: { achilles: 4, heel: 1 } },
      { id: 'q1-5', text: "No specific pain, just numbness or tingling", scores: { diabetic: 4, fatigue: 1 } },
    ]
  },
  {
    id: 2,
    text: "When does the pain feel worst?",
    icon: <Clock className="w-6 h-6" />,
    options: [
      { id: 'q2-1', text: "First steps in the morning", scores: { heel: 3, achilles: 2 } },
      { id: 'q2-2', text: "After long hours of standing", scores: { fatigue: 3, flat: 1, heel: 1 } },
      { id: 'q2-3', text: "During or after physical activity", scores: { achilles: 3, flat: 2 } },
      { id: 'q2-4', text: "Worse at night or while resting", scores: { diabetic: 4, fatigue: 1 } },
      { id: 'q2-5', text: "When wearing tight or narrow shoes", scores: { bunion: 4, flat: 1 } },
    ]
  },
  {
    id: 3,
    text: "How do your shoes wear out?",
    icon: <Footprints className="w-6 h-6" />,
    options: [
      { id: 'q3-1', text: "More on the inside", scores: { flat: 3, fatigue: 1 } },
      { id: 'q3-2', text: "More on the outside", scores: { neutral: 2, heel: 1 } },
      { id: 'q3-3', text: "Mostly at the heel", scores: { heel: 3, fatigue: 1 } },
      { id: 'q3-4', text: "Even wear", scores: { neutral: 3 } },
      { id: 'q3-5', text: "Not sure", scores: { neutral: 1, fatigue: 1 } },
    ]
  },
  {
    id: 4,
    text: "How many hours do you stand or walk daily?",
    icon: <Activity className="w-6 h-6" />,
    options: [
      { id: 'q4-1', text: "Less than 3 hours", scores: { neutral: 3 } },
      { id: 'q4-2', text: "3–6 hours", scores: { neutral: 1, fatigue: 2 } },
      { id: 'q4-3', text: "6–8 hours", scores: { fatigue: 3, heel: 1, flat: 1 } },
      { id: 'q4-4', text: "More than 8 hours", scores: { fatigue: 3, heel: 2, flat: 2 } },
    ]
  },
  {
    id: 5,
    text: "Do your feet feel tired quickly?",
    icon: <Zap className="w-6 h-6" />,
    options: [
      { id: 'q5-1', text: "Yes, very often", scores: { fatigue: 3, flat: 2, heel: 1 } },
      { id: 'q5-2', text: "Sometimes", scores: { fatigue: 1, flat: 1, neutral: 1 } },
      { id: 'q5-3', text: "Rarely", scores: { neutral: 2, fatigue: 1 } },
      { id: 'q5-4', text: "Never", scores: { neutral: 3 } },
    ]
  }
];

const RESULTS: Record<string, Result> = {
  flat: {
    id: 'flat',
    title: "Flat Feet / Overpronation Risk",
    explanation: "Your answers suggest that your arches may not be getting enough support, causing the foot to roll inward. This can lead to strain in the ankles, knees, and even the lower back as your body compensates for the lack of a stable base.",
    causes: [
      "Genetic foot structure",
      "Weakened tendons due to age",
      "Prolonged standing on hard surfaces",
      "Improper footwear without arch support"
    ],
    tips: [
      "Try arch strengthening exercises like towel curls",
      "Avoid extremely flat footwear like flip-flops",
      "Use proper arch support when standing long hours",
      "Choose shoes with firm mid-soles"
    ],
    products: [
      {
        name: "Frido Rigid Arch Support Insole",
        description: "Rigid orthotic insoles designed to provide maximum support for collapsed arches.",
        bestFor: "Flat Feet & Overpronation",
        link: "https://amzn.in/d/066diPwp"
      },
      {
        name: "Boldfit Arch Support",
        description: "Comfortable and durable arch support inserts that help reduce foot fatigue.",
        bestFor: "Arch Strain & Ankle Support",
        link: "https://amzn.in/d/0bgzXhjD"
      }
    ]
  },
  heel: {
    id: 'heel',
    title: "Heel Pain / Plantar Fasciitis Risk",
    explanation: "Your answers suggest that the heel area of your foot may be experiencing strain. This is commonly associated with irritation of the plantar fascia, a band of tissue that supports the arch.",
    causes: [
      "Long hours of standing",
      "Tight calf muscles",
      "Lack of arch support",
      "Sudden increase in walking or running"
    ],
    tips: [
      "Stretching the calf and plantar fascia",
      "Rolling a frozen bottle under the foot",
      "Using supportive footwear",
      "Taking short breaks if standing long hours"
    ],
    products: [
      {
        name: "Frido Plantar Insole",
        description: "Premium orthotic insoles designed specifically for plantar fasciitis relief.",
        bestFor: "Heel Spurs & Plantar Fasciitis",
        link: "https://amzn.to/4rZCbsz"
      },
      {
        name: "Plantar Fasciitis Night Splint",
        description: "Soft, comfortable compression sock that keeps the foot in a gentle stretch.",
        bestFor: "Chronic Heel Pain",
        link: "https://amzn.to/4b0AXHN"
      }
    ]
  },
  fatigue: {
    id: 'fatigue',
    title: "Standing Job Foot Fatigue",
    explanation: "Long hours on your feet can lead to muscle exhaustion and poor circulation. Even with healthy feet, static standing puts constant pressure on the same points, leading to that 'heavy' or aching feeling.",
    causes: [
      "Static standing for over 4 hours",
      "Hard, unyielding floor surfaces",
      "Poorly fitted or heavy work boots",
      "Lack of movement during the day"
    ],
    tips: [
      "Shift your weight frequently while standing",
      "Elevate your feet at the end of the day",
      "Use anti-fatigue mats if possible",
      "Perform simple ankle circles and toe wiggles"
    ],
    products: [
      {
        name: "Anti-Fatigue Comfort Insoles",
        description: "Dual-layer foam technology that returns energy and reduces muscle vibration.",
        bestFor: "Long Work Shifts",
        link: "https://amzn.to/4rZCbsz"
      },
      {
        name: "Graduated Compression Socks",
        description: "Improves blood flow and prevents swelling during long hours of standing.",
        bestFor: "Circulation & Fatigue",
        link: "https://amzn.to/4b0AXHN"
      }
    ]
  },
  neutral: {
    id: 'neutral',
    title: "Neutral / Low Risk",
    explanation: "Your feet seem to be in good health! You likely have a neutral gait, which means your weight is distributed evenly. Maintaining this balance is key to long-term mobility.",
    causes: [
      "Balanced foot structure",
      "Proper footwear choices",
      "Good muscle flexibility",
      "Appropriate activity levels"
    ],
    tips: [
      "Continue wearing supportive shoes",
      "Replace athletic shoes regularly",
      "Maintain a consistent stretching routine",
      "Stay hydrated for healthy tissues"
    ],
    products: [
      {
        name: "Daily Wellness Insoles",
        description: "Lightweight cushioning to maintain comfort and prevent future issues.",
        bestFor: "General Comfort",
        link: "https://amzn.in/d/0gh0wRDf"
      },
      {
        name: "Foot Massage Roller",
        description: "A simple tool to release tension and maintain flexibility in the foot muscles.",
        bestFor: "Recovery & Maintenance",
        link: "https://amzn.to/4aFri8e"
      }
    ]
  },
  mixed: {
    id: 'mixed',
    title: "Overlapping Foot Concerns",
    explanation: "Your results indicate a combination of symptoms. You may be experiencing both arch strain and general fatigue, or a mix of heel sensitivity and structural misalignment.",
    causes: [
      "Multiple contributing factors",
      "Compensatory movements",
      "Lack of specialized support",
      "Transitioning to new activity levels"
    ],
    tips: [
      "Focus on versatile support options",
      "Rotate your footwear daily",
      "Incorporate full-foot stretching",
      "Consult a specialist for assessment"
    ],
    products: [
      {
        name: "All-Day Performance Insoles",
        description: "A hybrid design combining high-impact heel cushioning with adaptive arch support.",
        bestFor: "Mixed Symptoms & Versatile Use",
        link: "https://amzn.to/4rZCbsz"
      },
      {
        name: "Foot Recovery Kit",
        description: "Includes a massage ball, resistance band, and compression sleeves for total foot care.",
        bestFor: "Comprehensive Recovery",
        link: "https://amzn.to/4aFri8e"
      }
    ]
  },
  bunion: {
    id: 'bunion',
    title: "Bunion / Hallux Valgus Risk",
    explanation: "Your answers suggest a high likelihood of bunion formation or aggravation. This is often caused by the big toe joint being pushed out of alignment, frequently due to narrow footwear or inherited foot structure.",
    causes: [
      "Narrow or tight-fitting shoes",
      "Genetic predisposition",
      "Foot stress or injuries",
      "Arthritis in the toe joint"
    ],
    tips: [
      "Switch to shoes with a wide toe box",
      "Use bunion pads to reduce friction",
      "Try toe spacers during rest",
      "Apply ice after long periods of standing"
    ],
    products: [
      {
        name: "Bunion Corrector & Toe Separator",
        description: "Soft silicone separators that gently realign the big toe and provide a protective barrier.",
        bestFor: "Bunion Relief & Alignment",
        link: "https://amzn.to/4aFri8e"
      },
      {
        name: "Orthopedic Bunion Splint",
        description: "Adjustable splint that applies pressure to the big toe to help maintain correct alignment.",
        bestFor: "Corrective Support",
        link: "https://amzn.to/4cBR9jU"
      }
    ]
  },
  diabetic: {
    id: 'diabetic',
    title: "Diabetic Foot Sensitivity",
    explanation: "Your symptoms of numbness or tingling are common indicators of diabetic neuropathy or circulation issues. This requires specialized care to prevent injuries that you might not feel.",
    causes: [
      "High blood sugar levels",
      "Peripheral neuropathy",
      "Poor circulation",
      "Pressure points in standard shoes"
    ],
    tips: [
      "Perform daily foot inspections with a mirror",
      "Never walk barefoot, even indoors",
      "Use seamless, non-binding socks",
      "Keep skin moisturized but dry between toes"
    ],
    products: [
      {
        name: "Diabetic Socks (Seamless)",
        description: "Non-binding, moisture-wicking socks designed to prevent pressure points.",
        bestFor: "Diabetic Foot Protection",
        link: "https://amzn.to/4b0AXHN"
      },
      {
        name: "Foobetik Foot Cream",
        description: "Specialized moisturizing cream to maintain skin integrity for sensitive feet.",
        bestFor: "Dryness & Fissure Prevention",
        link: "https://amzn.in/d/0gh0wRDf"
      }
    ]
  },
  achilles: {
    id: 'achilles',
    title: "Achilles Tendinitis Risk",
    explanation: "The pain at the back of your heel suggests strain on the Achilles tendon. This is often an overuse injury from sudden increases in activity or tight calf muscles pulling on the tendon.",
    causes: [
      "Sudden increase in exercise intensity",
      "Tight calf muscles",
      "Improper or worn-out footwear",
      "Bone spurs on the heel"
    ],
    tips: [
      "Rest and avoid high-impact activities",
      "Perform gentle eccentric calf stretches",
      "Use heel lifts to reduce tendon tension",
      "Apply ice to the back of the heel"
    ],
    products: [
      {
        name: "Achilles Tendon Support Sleeve",
        description: "Compression sleeve with gel pads to stabilize the tendon and reduce strain.",
        bestFor: "Achilles Pain & Recovery",
        link: "https://amzn.to/4rZCbsz"
      },
      {
        name: "Silicone Heel Lifts",
        description: "Inserts that slightly elevate the heel to reduce tension on the tendon.",
        bestFor: "Immediate Relief",
        link: "https://amzn.to/4cBR9jU"
      }
    ]
  }
};

// --- Component ---

export const FootProblemQuiz: React.FC = () => {
  const [step, setStep] = useState<number>(0); // 0: Start, 1-5: Questions, 6: Result
  const [scores, setScores] = useState<Record<string, number>>({
    heel: 0,
    flat: 0,
    fatigue: 0,
    neutral: 0,
    bunion: 0,
    diabetic: 0,
    achilles: 0
  });
  const [email, setEmail] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState({ email: false, contact: false });

  const handleStart = () => setStep(1);

  const handleAnswer = (optionScores: Record<string, number>) => {
    setScores(prev => ({
      heel: prev.heel + (optionScores.heel || 0),
      flat: prev.flat + (optionScores.flat || 0),
      fatigue: prev.fatigue + (optionScores.fatigue || 0),
      neutral: prev.neutral + (optionScores.neutral || 0),
      bunion: prev.bunion + (optionScores.bunion || 0),
      diabetic: prev.diabetic + (optionScores.diabetic || 0),
      achilles: prev.achilles + (optionScores.achilles || 0)
    }));

    if (step < 5) {
      setStep(step + 1);
    } else {
      setStep(6);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setScores({ heel: 0, flat: 0, fatigue: 0, neutral: 0 });
    setShowEmailForm(false);
    setShowContactForm(false);
    setFormSubmitted({ email: false, contact: false });
  };

  const getResult = (): Result => {
    const sortedScores = (Object.entries(scores) as [string, number][]).sort(([, a], [, b]) => b - a);
    const [topCategory, topScore] = sortedScores[0];
    const [, secondScore] = sortedScores[1];

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
  const progress = (step / 5) * 100;

  return (
    <section id="quiz" className="bg-brand-beige py-24 px-6" aria-labelledby="quiz-title">
      <div className="max-w-4xl mx-auto">
        <div className="sr-only" id="quiz-title">Foot Problem Finder Quiz</div>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-orange/10 rounded-full mb-8">
                <Footprints className="w-10 h-10 text-brand-orange" />
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-brown mb-4">
                Find Your Foot Problem in 30 Seconds
              </h2>
              <p className="text-xl text-brand-taupe max-w-2xl mx-auto mb-4 leading-relaxed">
                Answer a few quick questions to understand what your feet might be experiencing.
              </p>
              <p className="text-xs text-brand-taupe/60 max-w-lg mx-auto mb-12 italic">
                This tool provides educational insights based on common foot patterns and does not replace professional medical advice.
              </p>
              <button
                onClick={handleStart}
                aria-label="Start the foot problem finder quiz"
                className="group relative inline-flex items-center gap-3 bg-brand-brown text-white px-12 py-6 rounded-full font-bold text-lg hover:bg-brand-orange transition-all duration-300 shadow-lg hover:shadow-brand-orange/20 active:scale-95"
              >
                Start Quiz
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step >= 1 && step <= 5 && (
            <motion.div
              key={`question-${step}`}
              initial={{ opacity: 0, x: 50, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.98 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                opacity: { duration: 0.2 }
              }}
              role="region"
              aria-live="polite"
              className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-soft border border-brand-brown/5"
            >
              {/* Progress Bar */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.2em]">
                    Question {step} of 5
                  </span>
                  <span className="text-xs font-bold text-brand-taupe uppercase tracking-widest">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <div 
                  className="h-3 w-full bg-brand-brown/5 rounded-full overflow-hidden relative shadow-inner"
                  role="progressbar"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Quiz progress: ${Math.round(progress)}%`}
                >
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 40, damping: 15 }}
                    className="h-full bg-gradient-to-r from-brand-orange to-brand-gold relative"
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.5,
                        ease: "linear",
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full"
                    />
                  </motion.div>
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-4 mb-10"
              >
                <div className="w-14 h-14 bg-brand-beige rounded-2xl flex items-center justify-center text-brand-brown shadow-inner">
                  {currentQuestion.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-brand-brown leading-tight">
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
                    onClick={() => handleAnswer(option.scores)}
                    aria-label={`Select option: ${option.text}`}
                    className="group flex items-center justify-between p-6 md:p-8 rounded-2xl border-2 border-brand-beige hover:border-brand-orange hover:bg-brand-orange/5 transition-all duration-300 text-left"
                  >
                    <span className="text-lg md:text-xl font-medium text-brand-brown group-hover:text-brand-orange transition-colors">
                      {option.text}
                    </span>
                    <div className="w-6 h-6 rounded-full border-2 border-brand-beige group-hover:border-brand-orange flex items-center justify-center transition-all shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}

          {step === 6 && (
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
              {/* Result Header */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="bg-white rounded-[3rem] p-10 md:p-16 shadow-soft border border-brand-brown/5 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-3 bg-brand-orange" />
                <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-orange/10 rounded-full mb-8">
                  <CheckCircle2 className="w-10 h-10 text-brand-orange" />
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-brown mb-6">
                  {getResult().title}
                </h2>
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange mb-4">What This Means</h3>
                  <p className="text-lg md:text-xl text-brand-taupe leading-relaxed font-light">
                    {getResult().explanation}
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
                <div className="bg-brand-brown text-white rounded-[2.5rem] p-10 md:p-12 shadow-2xl">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-brand-gold/20 rounded-xl">
                      <Info className="w-6 h-6 text-brand-gold" />
                    </div>
                    <h3 className="text-2xl font-display font-bold">Why This May Happen</h3>
                  </div>
                  <ul className="space-y-5">
                    {getResult().causes.map((cause, i) => (
                      <li key={i} className="flex items-start gap-4 text-white/80 text-lg font-light">
                        <div className="w-2 h-2 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-soft border border-brand-brown/5">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-brand-orange/10 rounded-xl">
                      <Zap className="w-6 h-6 text-brand-orange" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-brand-brown">What May Help</h3>
                  </div>
                  <ul className="space-y-5">
                    {getResult().tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-4 text-brand-taupe text-lg font-light">
                        <div className="w-2 h-2 rounded-full bg-brand-orange mt-2.5 shrink-0" />
                        <span>{tip}</span>
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
                <div className="grid md:grid-cols-2 gap-8">
                  {getResult().products.map((product, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-[2.5rem] p-10 shadow-soft border border-brand-brown/5 flex flex-col group hover:border-brand-orange/20 transition-all"
                    >
                      <div className="inline-block px-4 py-1.5 bg-brand-orange/5 text-brand-orange text-[10px] font-bold rounded-full mb-6 self-start uppercase tracking-[0.2em] border border-brand-orange/10">
                        Best for: {product.bestFor}
                      </div>
                      <h4 className="text-2xl font-display font-bold text-brand-brown mb-4 group-hover:text-brand-orange transition-colors">{product.name}</h4>
                      <p className="text-brand-taupe/90 mb-10 flex-grow leading-relaxed font-light">
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
                <div className="grid md:grid-cols-2 gap-12">
                  {/* Email Guide */}
                  <div className="space-y-6">
                    <h4 className="text-2xl font-display font-bold text-brand-brown">Get Your Free Mini Foot Care Guide</h4>
                    <p className="text-brand-taupe font-light">A structured PDF guide to help you manage your foot wellness at home.</p>
                    {!formSubmitted.email ? (
                      <form 
                        onSubmit={(e) => { e.preventDefault(); setFormSubmitted(prev => ({ ...prev, email: true })); }}
                        className="flex flex-col gap-3"
                      >
                        <input 
                          type="email" 
                          required
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white border border-brand-brown/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                        />
                        <button type="submit" className="bg-brand-orange text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-brand-orange/90 transition-all shadow-lg">
                          Get Free Guide
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-3 text-brand-orange font-bold">
                        <CheckCircle2 className="w-6 h-6" />
                        <span>Guide sent to your email!</span>
                      </div>
                    )}
                  </div>

                  {/* Product Links */}
                  <div className="space-y-6">
                    <h4 className="text-2xl font-display font-bold text-brand-brown">Send Me Product Links</h4>
                    <p className="text-brand-taupe font-light">Receive direct links to recommended gear on WhatsApp.</p>
                    {!formSubmitted.contact ? (
                      <form 
                        onSubmit={(e) => { e.preventDefault(); setFormSubmitted(prev => ({ ...prev, contact: true })); }}
                        className="flex flex-col gap-3"
                      >
                        <input 
                          type="text" 
                          required
                          placeholder="Phone Number"
                          value={contactInfo}
                          onChange={(e) => setContactInfo(e.target.value)}
                          className="w-full bg-white border border-brand-brown/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                        />
                        <button type="submit" className="bg-brand-brown text-brand-beige py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-brand-orange transition-all shadow-lg">
                          Send Me Links
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-3 text-brand-orange font-bold">
                        <CheckCircle2 className="w-6 h-6" />
                        <span>Links are on the way!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Share & Restart */}
                <div className="pt-12 border-t border-brand-brown/10 flex flex-col sm:flex-row items-center justify-center gap-8">
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-3 text-brand-brown font-bold uppercase tracking-widest text-xs hover:text-brand-orange transition-colors"
                  >
                    <Activity className="w-4 h-4" />
                    Share My Results
                  </button>
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-3 text-brand-taupe hover:text-brand-brown font-bold uppercase tracking-widest text-xs transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restart Quiz
                  </button>
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
