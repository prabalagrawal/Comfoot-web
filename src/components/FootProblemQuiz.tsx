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
      { id: 'q1-1', text: "Heel", scores: { heel: 3, fatigue: 1 } },
      { id: 'q1-2', text: "Arch (middle of foot)", scores: { flat: 3, fatigue: 1 } },
      { id: 'q1-3', text: "Front of foot", scores: { neutral: 1, fatigue: 2, flat: 1 } },
      { id: 'q1-4', text: "Around ankle", scores: { flat: 2, heel: 1 } },
      { id: 'q1-5', text: "No specific pain, just fatigue", scores: { fatigue: 3, neutral: 1 } },
    ]
  },
  {
    id: 2,
    text: "When does the pain feel worst?",
    icon: <Clock className="w-6 h-6" />,
    options: [
      { id: 'q2-1', text: "First steps in the morning", scores: { heel: 3, flat: 1 } },
      { id: 'q2-2', text: "After long hours of standing", scores: { fatigue: 3, flat: 1, heel: 1 } },
      { id: 'q2-3', text: "After walking or running", scores: { neutral: 1, flat: 2, heel: 1 } },
      { id: 'q2-4', text: "At the end of the day", scores: { fatigue: 2, flat: 2 } },
      { id: 'q2-5', text: "No specific timing", scores: { neutral: 3 } },
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
    title: "Possible Flat Feet or Arch Strain",
    explanation: "Your answers suggest that your arches may not be getting enough support, which can cause fatigue, ankle strain, or knee discomfort over time.",
    causes: [
      "Genetics or structural foot shape",
      "Weakened tendons due to age or injury",
      "Prolonged standing on hard surfaces",
      "Improper footwear without arch support"
    ],
    tips: [
      "Try arch strengthening exercises like towel curls",
      "Avoid extremely flat footwear like flip-flops",
      "Use proper arch support when standing long hours",
      "Consider a professional gait analysis"
    ],
    products: [
      {
        name: "Comfoot Arch Support Insoles",
        description: "Medical-grade support designed to realign the foot and provide lasting arch relief.",
        bestFor: "Flat Feet & Overpronation",
        link: "#"
      },
      {
        name: "Stability Compression Sleeves",
        description: "Lightweight compression that lifts the arch and reduces swelling during activity.",
        bestFor: "Arch Strain & Ankle Support",
        link: "#"
      }
    ]
  },
  heel: {
    id: 'heel',
    title: "Heel Pain / Plantar Fasciitis Risk",
    explanation: "The discomfort you feel, especially in the morning, is often linked to inflammation of the plantar fascia—the tissue connecting your heel to your toes.",
    causes: [
      "Overuse or sudden increase in activity",
      "Tight calf muscles pulling on the heel",
      "Inadequate cushioning in footwear",
      "High-impact sports on hard surfaces"
    ],
    tips: [
      "Stretch your calves and feet before getting out of bed",
      "Use ice therapy after long periods of activity",
      "Avoid walking barefoot on hard floors",
      "Wear shoes with a slight heel lift and good cushioning"
    ],
    products: [
      {
        name: "Premium Heel Cushion Cups",
        description: "Shock-absorbing gel inserts that cradle the heel and reduce impact pressure.",
        bestFor: "Heel Spurs & Plantar Fasciitis",
        link: "#"
      },
      {
        name: "Night Splint Support",
        description: "Gently stretches the plantar fascia while you sleep to reduce morning pain.",
        bestFor: "Chronic Heel Pain",
        link: "#"
      }
    ]
  },
  fatigue: {
    id: 'fatigue',
    title: "Standing Job Foot Fatigue",
    explanation: "Long hours on your feet can lead to muscle exhaustion and poor circulation, even if your foot structure is healthy.",
    causes: [
      "Static standing for more than 4 hours daily",
      "Hard, unyielding floor surfaces",
      "Poorly fitted or heavy work boots",
      "Lack of movement during the workday"
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
        link: "#"
      },
      {
        name: "Graduated Compression Socks",
        description: "Improves blood flow and prevents swelling during long hours of standing.",
        bestFor: "Circulation & Fatigue",
        link: "#"
      }
    ]
  },
  neutral: {
    id: 'neutral',
    title: "Neutral Foot / Low Risk",
    explanation: "Your feet seem to be in good health! You likely have a neutral gait, but maintaining this health requires proactive care.",
    causes: [
      "Balanced foot structure",
      "Proper footwear choices",
      "Good muscle flexibility",
      "Appropriate activity levels"
    ],
    tips: [
      "Continue wearing supportive, well-fitted shoes",
      "Replace athletic shoes every 300-500 miles",
      "Maintain a consistent stretching routine",
      "Stay hydrated to keep connective tissues healthy"
    ],
    products: [
      {
        name: "Daily Wellness Insoles",
        description: "Lightweight cushioning to maintain comfort and prevent future issues.",
        bestFor: "General Comfort",
        link: "#"
      },
      {
        name: "Foot Massage Roller",
        description: "A simple tool to release tension and maintain flexibility in the foot muscles.",
        bestFor: "Recovery & Maintenance",
        link: "#"
      }
    ]
  },
  mixed: {
    id: 'mixed',
    title: "Overlapping Foot Concerns",
    explanation: "Your results indicate a combination of symptoms. You may be experiencing both arch strain and general fatigue, or a mix of heel sensitivity and structural misalignment.",
    causes: [
      "Multiple contributing factors (e.g., standing long hours in unsupportive shoes)",
      "Compensatory movements where one pain leads to another",
      "General lack of specialized support for your specific foot type",
      "Transitioning to new activity levels without proper gear"
    ],
    tips: [
      "Focus on versatile support that addresses both cushioning and stability",
      "Rotate your footwear to give your feet different support patterns",
      "Incorporate a full-foot stretching and strengthening routine",
      "Consult a specialist for a comprehensive foot assessment"
    ],
    products: [
      {
        name: "All-Day Performance Insoles",
        description: "A hybrid design combining high-impact heel cushioning with adaptive arch support.",
        bestFor: "Mixed Symptoms & Versatile Use",
        link: "#"
      },
      {
        name: "Foot Recovery Kit",
        description: "Includes a massage ball, resistance band, and compression sleeves for total foot care.",
        bestFor: "Comprehensive Recovery",
        link: "#"
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
    neutral: 0
  });

  const handleStart = () => setStep(1);

  const handleAnswer = (optionScores: Record<string, number>) => {
    setScores(prev => ({
      heel: prev.heel + (optionScores.heel || 0),
      flat: prev.flat + (optionScores.flat || 0),
      fatigue: prev.fatigue + (optionScores.fatigue || 0),
      neutral: prev.neutral + (optionScores.neutral || 0)
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
  };

  const getResult = (): Result => {
    const sortedScores = (Object.entries(scores) as [string, number][]).sort(([, a], [, b]) => b - a);
    const [topCategory, topScore] = sortedScores[0];
    const [, secondScore] = sortedScores[1];

    // If the top two scores are within 2 points of each other, it's a 'mixed' result
    // This threshold can be adjusted for more/less sensitivity
    if (topScore > 0 && (topScore - secondScore) <= 2 && topCategory !== 'neutral') {
      return RESULTS.mixed;
    }

    return RESULTS[topCategory] || RESULTS.neutral;
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
              <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-brown mb-6">
                Find Your Foot Problem in 30 Seconds
              </h2>
              <p className="text-xl text-brand-taupe max-w-2xl mx-auto mb-12 leading-relaxed">
                Answer a few quick questions and discover possible causes of your foot discomfort along with helpful guidance.
              </p>
              <button
                onClick={handleStart}
                aria-label="Start the foot problem finder quiz"
                className="group relative inline-flex items-center gap-3 bg-brand-brown text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-brand-orange transition-all duration-300 shadow-lg hover:shadow-brand-orange/20"
              >
                Start the Quiz
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step >= 1 && step <= 5 && (
            <motion.div
              key={`question-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              role="region"
              aria-live="polite"
              className="bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-brand-brown/5"
            >
              {/* Progress Bar */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-brand-orange uppercase tracking-wider">
                    Question {step} of 5
                  </span>
                  <span className="text-sm font-medium text-brand-taupe">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <div 
                  className="h-2 w-full bg-brand-beige rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Quiz progress: ${Math.round(progress)}%`}
                >
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-brand-orange"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-brand-beige rounded-2xl flex items-center justify-center text-brand-brown">
                  {currentQuestion.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-brand-brown">
                  {currentQuestion.text}
                </h3>
              </div>

              <div className="grid gap-4">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.scores)}
                    aria-label={`Select option: ${option.text}`}
                    className="group flex items-center justify-between p-6 rounded-2xl border-2 border-brand-beige hover:border-brand-orange hover:bg-brand-orange/5 transition-all duration-200 text-left"
                  >
                    <span className="text-lg font-medium text-brand-brown group-hover:text-brand-orange transition-colors">
                      {option.text}
                    </span>
                    <div className="w-6 h-6 rounded-full border-2 border-brand-beige group-hover:border-brand-orange flex items-center justify-center transition-all">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              role="alert"
              aria-live="assertive"
              className="space-y-12"
            >
              {/* Result Header */}
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-brand-brown/5 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-brand-orange" />
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-orange/10 rounded-full mb-6">
                  <CheckCircle2 className="w-8 h-8 text-brand-orange" />
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-brown mb-4">
                  {getResult().title}
                </h2>
                <p className="text-lg text-brand-taupe max-w-2xl mx-auto leading-relaxed">
                  {getResult().explanation}
                </p>
              </div>

              {/* Tips & Causes Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-brand-brown text-white rounded-3xl p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Info className="w-6 h-6 text-brand-gold" />
                    <h3 className="text-xl font-display font-bold">Common Causes</h3>
                  </div>
                  <ul className="space-y-4">
                    {getResult().causes.map((cause, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-soft border border-brand-brown/5">
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="w-6 h-6 text-brand-orange" />
                    <h3 className="text-xl font-display font-bold text-brand-brown">Quick Tips</h3>
                  </div>
                  <ul className="space-y-4">
                    {getResult().tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 text-brand-taupe">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-2.5 shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Product Recommendations */}
              <div>
                <h3 className="text-2xl font-display font-bold text-brand-brown mb-8 text-center">
                  Recommended Support Options
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {getResult().products.map((product, i) => (
                    <div key={i} className="bg-white rounded-3xl p-8 shadow-soft border border-brand-brown/5 flex flex-col">
                      <div className="inline-block px-3 py-1 bg-brand-gold/10 text-brand-orange text-xs font-bold rounded-full mb-4 self-start uppercase tracking-wider">
                        Best for: {product.bestFor}
                      </div>
                      <h4 className="text-xl font-bold text-brand-brown mb-3">{product.name}</h4>
                      <p className="text-brand-taupe mb-8 flex-grow">
                        {product.description}
                      </p>
                      <button 
                        aria-label={`Check support options for ${product.name}`}
                        className="w-full inline-flex items-center justify-center gap-2 bg-brand-beige text-brand-brown py-4 rounded-xl font-bold hover:bg-brand-orange hover:text-white transition-all duration-300"
                      >
                        Check Support Options
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-12 border-t border-brand-brown/10">
                <div className="text-center space-y-8">
                  <h3 className="text-2xl font-display font-bold text-brand-brown">
                    Explore More Foot Health Guides
                  </h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    {[
                      { name: 'Heel Pain Guide', href: '#explore' },
                      { name: 'Flat Feet Guide', href: '#explore' },
                      { name: 'Standing Job Foot Care', href: '#explore' }
                    ].map((guide) => (
                      <a 
                        key={guide.name}
                        href={guide.href} 
                        className="flex items-center gap-2 px-6 py-3 bg-white rounded-full text-brand-taupe font-medium hover:text-brand-orange transition-colors shadow-sm"
                      >
                        {guide.name}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                  <button
                    onClick={handleRestart}
                    aria-label="Restart the quiz"
                    className="inline-flex items-center gap-2 text-brand-taupe hover:text-brand-brown font-semibold transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restart Quiz
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
