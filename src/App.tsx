import React, { useState, useEffect } from 'react';
import { 
  Footprints, 
  ArrowRight, 
  CheckCircle2, 
  Info, 
  HelpCircle, 
  Menu, 
  X,
  Activity,
  Zap,
  ShieldCheck,
  ExternalLink,
  Instagram,
  Twitter,
  Linkedin,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface Product {
  name: string;
  description: string;
  bestFor: string;
  link: string;
}

interface Symptom {
  name: string;
  description: string;
}

interface Condition {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  whatIsIt: string;
  causes: string[];
  symptoms: Symptom[];
  diySupport: string[];
  products: Product[];
}

// --- Data ---

const CONDITIONS: Condition[] = [
  {
    id: 'plantar-fasciitis',
    title: 'Plantar Fasciitis',
    shortDesc: 'Morning heel pain or discomfort after long standing.',
    fullDesc: 'Plantar fasciitis is an inflammation of the fibrous tissue (plantar fascia) along the bottom of your foot that connects your heel bone to your toes.',
    whatIsIt: 'Often felt as a sharp stabbing sensation in the bottom of your foot, particularly during your first steps in the morning or after sitting for a long time.',
    causes: [
      'Repetitive strain from running or jumping',
      'Improper footwear with poor arch support',
      'Tight calf muscles',
      'Sudden increase in physical activity'
    ],
    symptoms: [
      { name: 'Sharp pain in the bottom of the heel', description: 'Often feels like a stabbing sensation, most intense during the first few steps of the day.' },
      { name: 'Pain that is worse in the morning', description: 'The plantar fascia tightens overnight; sudden stretching in the morning causes micro-tears and sharp pain.' },
      { name: 'Swelling or inflammation around the heel', description: 'Visible puffiness or redness indicating the body is trying to heal the damaged tissue.' },
      { name: 'Tenderness when touching the heel area', description: 'Sensitivity to pressure, especially at the point where the fascia attaches to the heel bone.' }
    ],
    diySupport: [
      'Frozen water bottle rolls (15 mins daily)',
      'Calf and plantar fascia stretches',
      'Rest and avoiding high-impact activities',
      'Using cushioned heel cups'
    ],
    products: [
      {
        name: 'Frido Plantar Insole',
        description: 'Premium orthotic insoles designed specifically for plantar fasciitis relief with deep heel cushioning and arch support.',
        bestFor: 'Daily wear in walking or sports shoes.',
        link: 'https://amzn.to/4rZCbsz'
      },
      {
        name: 'Medial Arch Support',
        description: 'Targeted support for the medial arch to redistribute pressure and reduce strain on the plantar fascia ligament.',
        bestFor: 'Correcting overpronation and arch fatigue.',
        link: 'https://amzn.to/4kJD5XT'
      },
      {
        name: 'Foot Massager and Roller',
        description: 'Ergonomically shaped roller for deep tissue massage to break up scar tissue and increase blood flow.',
        bestFor: 'Morning and evening recovery sessions.',
        link: 'https://amzn.to/4aFri8e'
      },
      {
        name: 'Gel Heel Cup & Silicon Heel Pad',
        description: 'Dual-density medical grade silicone that provides superior shock absorption for the heel bone.',
        bestFor: 'Immediate relief from sharp heel pain.',
        link: 'https://amzn.to/4cBR9jU'
      },
      {
        name: 'Calf Stretcher',
        description: 'Professional stretching tool to safely and effectively stretch the calf muscles and plantar fascia.',
        bestFor: 'Improving flexibility and long-term healing.',
        link: 'https://amzn.to/3OmUs4F'
      },
      {
        name: 'Plantar Fasciitis Night Splint Sock',
        description: 'Soft, comfortable compression sock that keeps the foot in a gentle stretch throughout the night.',
        bestFor: 'Eliminating the "first step" morning pain.',
        link: 'https://amzn.to/4b0AXHN'
      }
    ]
  },
  {
    id: 'flat-feet',
    title: 'Flat Feet',
    shortDesc: 'Low arch support causing strain and fatigue.',
    fullDesc: 'Flat feet (pes planus) occur when the arches on the inside of your feet flatten when you stand up.',
    whatIsIt: 'A condition where the entire sole of the foot touches the floor when standing. It can lead to misalignment in the ankles, knees, and hips.',
    causes: [
      'Genetic predisposition',
      'Weakened arches due to aging',
      'Foot or ankle injury',
      'Obesity or excessive weight bearing'
    ],
    symptoms: [
      { name: 'Feet tiring easily', description: 'Muscles in the feet and legs work harder to compensate for the lack of arch support, leading to rapid fatigue.' },
      { name: 'Pain in the arch or heel area', description: 'Strain on the ligaments and tendons that normally support the arch can cause persistent aching.' },
      { name: 'Swelling along the inside of the ankle', description: 'The posterior tibial tendon, which supports the arch, can become inflamed and swollen.' },
      { name: 'Back and leg pain due to misalignment', description: 'Flat feet can cause the legs to rotate inward, putting stress on the knees, hips, and lower back.' }
    ],
    diySupport: [
      'Arch strengthening exercises (towel scrunches)',
      'Walking barefoot on soft sand',
      'Maintaining a healthy weight',
      'Choosing shoes with firm mid-soles'
    ],
    products: [
      {
        name: 'Orthotic Arch Support Insoles',
        description: 'Semi-rigid inserts that provide a structural foundation for collapsed arches.',
        bestFor: 'Daily wear in formal or casual shoes.',
        link: '#'
      },
      {
        name: 'Stability Running Shoes',
        description: 'Specially designed footwear that prevents overpronation (rolling inward).',
        bestFor: 'Active individuals and long walks.',
        link: '#'
      },
      {
        name: 'Arch Support Sleeves',
        description: 'Elastic bands with built-in gel pads that hug the arch for immediate lift.',
        bestFor: 'Wearing with sandals or while barefoot at home.',
        link: '#'
      },
      {
        name: 'Foot Alignment Roller',
        description: 'A textured roller to stimulate the arch muscles and improve foot posture.',
        bestFor: 'Strengthening the intrinsic foot muscles.',
        link: '#'
      },
      {
        name: 'Gel Toe Spacers',
        description: 'Helps realign the big toe which often drifts in people with flat feet.',
        bestFor: 'Preventing bunions and improving balance.',
        link: '#'
      },
      {
        name: 'Supportive House Slippers',
        description: 'Slippers with built-in orthotic contours to prevent flattening on hard floors.',
        bestFor: 'Indoor support for all-day comfort.',
        link: '#'
      }
    ]
  }
];

// --- Components ---

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Conditions', href: '#explore' },
    { name: 'Compare', href: '#compare' },
    { name: 'About', href: '#about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-brand-beige/90 backdrop-blur-xl shadow-sm py-2' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <a href="#home" className="flex items-center group">
          <div className={`relative transition-all duration-500 ${isScrolled ? 'h-16 md:h-20' : 'h-20 md:h-28'} flex items-center justify-center`}>
            <img 
              src="/logo.png" 
              alt="Comfoot Logo" 
              className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-[11px] font-bold uppercase tracking-[0.15em] text-brand-taupe px-5 py-2.5 rounded-full hover:bg-brand-brown hover:text-brand-beige transition-all duration-300 active:scale-95"
              >
                {link.name}
              </a>
            ))}
            <div className="w-px h-4 bg-brand-brown/10 mx-2" />
            <a 
              href="#explore" 
              className="bg-brand-orange text-white px-7 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-brand-orange/90 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
            >
              Get Started
            </a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden ml-auto text-brand-brown" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-brand-beige border-t border-brand-brown/10 shadow-xl md:hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-brand-brown py-2 border-b border-brand-brown/5"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#explore" 
                onClick={() => setMobileMenuOpen(false)}
                className="bg-brand-orange text-white text-center py-3 rounded-xl font-semibold mt-2"
              >
                Explore Your Condition
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ConditionCard: React.FC<{ condition: Condition; onClick: () => void }> = ({ condition, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -8 }}
      className="bg-white p-8 rounded-[2rem] shadow-soft border border-brand-brown/5 flex flex-col items-start gap-4 transition-all group text-left w-full hover:border-brand-orange/20"
    >
      <div className="bg-brand-orange/10 p-4 rounded-2xl group-hover:bg-brand-orange group-hover:text-brand-beige transition-all duration-500 text-brand-orange">
        <Activity className="w-6 h-6" />
      </div>
      <h3 className="text-2xl font-display font-bold text-brand-brown group-hover:text-brand-orange transition-colors">{condition.title}</h3>
      <p className="text-sm text-brand-taupe/80 leading-relaxed font-light">{condition.shortDesc}</p>
      <div className="mt-auto pt-6 flex items-center gap-2 text-brand-orange font-bold text-xs uppercase tracking-widest">
        View Profile <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.button>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white p-10 rounded-[2.5rem] border border-brand-brown/5 shadow-soft hover:shadow-xl transition-all flex flex-col gap-6 group relative overflow-hidden hover:border-brand-orange/20 h-[520px]"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-brand-orange/10 transition-colors" />
      
      <div className="h-14 w-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-500 shadow-inner">
        <Zap className="w-7 h-7" />
      </div>
      
      <div className="flex-1 overflow-hidden">
        <h4 className="font-display font-bold text-2xl mb-3 text-brand-brown group-hover:text-brand-orange transition-colors">{product.name}</h4>
        <p className="text-base leading-relaxed text-brand-taupe/90 font-light line-clamp-4">{product.description}</p>
      </div>
      
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange bg-brand-orange/5 w-fit px-4 py-1.5 rounded-full border border-brand-orange/10">
        Best For: {product.bestFor}
      </div>
      
      <a 
        href={product.link}
        className="mt-auto bg-brand-brown text-brand-beige text-center py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-brand-orange transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
      >
        View Details <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </a>
    </motion.div>
  );
};

const SymptomItem: React.FC<{ symptom: Symptom }> = ({ symptom }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <li 
      className="text-sm flex items-start gap-3 text-brand-taupe group relative cursor-help"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(!showTooltip)}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
      <span className="border-b border-dotted border-brand-gold/40 group-hover:border-brand-gold transition-colors">
        {symptom.name}
      </span>
      
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 bottom-full left-0 mb-4 w-72 bg-brand-brown/95 backdrop-blur-md text-brand-beige p-5 rounded-[1.5rem] shadow-2xl text-[11px] leading-relaxed pointer-events-none border border-white/10"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1 bg-brand-gold/20 rounded-lg text-brand-gold">
                <Info className="w-3 h-3" />
              </div>
              <p>{symptom.description}</p>
            </div>
            <div className="absolute bottom-[-6px] left-6 w-3 h-3 bg-brand-brown/95 rotate-45 border-r border-b border-white/10" />
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

const ConditionModal: React.FC<{ condition: Condition; onClose: () => void }> = ({ condition, onClose }) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    
    // Focus management: focus the modal when it opens
    if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-brand-brown/60 backdrop-blur-md"
      onClick={onClose}
      role="presentation"
    >
      <motion.div 
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-brand-beige w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-[2.5rem] shadow-2xl relative flex flex-col md:flex-row border border-white/20 focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md text-brand-brown rounded-full shadow-lg hover:bg-brand-orange hover:text-white transition-all z-20 active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Editorial Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-14 bg-white/40 custom-scrollbar">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-brand-orange/40" />
              <span className="text-brand-orange font-bold uppercase tracking-[0.2em] text-[10px]">Condition Profile</span>
            </div>
            
            <h2 id="modal-title" className="text-4xl md:text-6xl font-display font-bold text-brand-brown mb-6 leading-tight">
              {condition.title}
            </h2>
            
            <p id="modal-description" className="text-xl leading-relaxed text-brand-taupe mb-12 font-light">
              {condition.fullDesc}
            </p>
 
            <div className="space-y-12">
              <section>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4" /> The Science
                </h3>
                <p className="text-base leading-relaxed text-brand-taupe/90 bg-brand-orange/5 p-6 rounded-2xl border border-brand-orange/10">
                  {condition.whatIsIt}
                </p>
              </section>
 
              <div className="grid sm:grid-cols-2 gap-10">
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange mb-4">Common Causes</h3>
                  <ul className="space-y-3">
                    {condition.causes.map((cause, i) => (
                      <li key={i} className="text-sm flex items-start gap-3 text-brand-taupe">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-1.5 shrink-0" />
                        {cause}
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-4 flex items-center gap-2">
                    Key Symptoms <HelpCircle className="w-3 h-3 opacity-50" />
                  </h3>
                  <ul className="space-y-3">
                    {condition.symptoms.map((symptom, i) => (
                      <SymptomItem key={i} symptom={symptom} />
                    ))}
                  </ul>
                </section>
              </div>
 
              <section>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange mb-4">Self-Care Protocols</h3>
                <div className="flex flex-wrap gap-2">
                  {condition.diySupport.map((tip, i) => (
                    <span key={i} className="bg-white px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider text-brand-orange border border-brand-orange/10 shadow-sm">
                      {tip}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
 
        {/* Right Side: Curated Products (Affiliate Section) */}
        <div className="w-full md:w-[420px] bg-brand-beige p-8 md:p-10 overflow-y-auto border-l border-brand-brown/5 custom-scrollbar">
          <div className="sticky top-0 bg-brand-beige z-10 pb-6 mb-6 border-bottom border-brand-brown/5">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="text-brand-orange w-5 h-5" />
              <h3 className="text-xl font-display font-bold text-brand-brown">Curated Support</h3>
            </div>
            <p className="text-xs text-brand-taupe/70">Curated solutions for {condition.title}.</p>
          </div>
 
          <div className="space-y-6">
            {condition.products.map((product, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-brand-brown/5 shadow-sm hover:shadow-md transition-all group hover:border-brand-orange/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 bg-brand-orange/10 rounded-xl flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-orange bg-brand-orange/5 px-3 py-1 rounded-full border border-brand-orange/10">
                    Recommended
                  </span>
                </div>
                
                <h4 className="font-display font-bold text-lg text-brand-brown mb-2 group-hover:text-brand-orange transition-colors">
                  {product.name}
                </h4>
                <p className="text-sm text-brand-taupe/80 leading-relaxed mb-4">
                  {product.description}
                </p>
                
                <a 
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-brand-brown text-brand-beige py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-orange transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  View on Amazon <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            ))}
          </div>
 
          {/* Transparency Disclosure */}
          <div className="mt-12 p-6 rounded-2xl bg-brand-orange/5 border border-brand-orange/10">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">Transparency Note</span>
            </div>
            <p className="text-[10px] text-brand-taupe/70 leading-relaxed italic">
              Comfoot is supported by its audience. When you purchase through links on our site, we may earn an affiliate commission at no extra cost to you. This helps us continue providing free foot health resources.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedCondition) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedCondition]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-brand-beige/50">
      {/* Global Floating Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[15%] left-[-5%] w-[30%] h-[30%] bg-brand-orange/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-[60%] right-[-10%] w-[40%] h-[40%] bg-brand-gold/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[20%] h-[20%] bg-brand-brown/10 rounded-full blur-[80px] animate-bounce-slow" />
      </div>

      <Navbar />

      <AnimatePresence>
        {selectedCondition && (
          <ConditionModal 
            condition={selectedCondition} 
            onClose={() => setSelectedCondition(null)} 
          />
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-40 bg-brand-beige/80 overflow-hidden">
        {/* Designer Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-brand-orange/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[70%] bg-brand-gold/10 rounded-full blur-[150px]" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] bg-brand-brown/10 rounded-full blur-[100px]" />
        </div>
 
        <div className="section-padding text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange/10 text-brand-orange rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8 border border-brand-orange/20">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping" />
              Structured Foot Health
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 leading-[0.95] tracking-tight font-display font-bold text-brand-brown">
              The Art of <span className="text-brand-orange">Comfortable</span> Walking.
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-brand-taupe/80 leading-relaxed max-w-2xl mx-auto font-light">
              Structured guidance for heel pain, flat feet, and daily foot discomfort in India.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href="#explore" 
                className="w-full sm:w-auto bg-brand-brown text-brand-beige px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-brand-orange transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 active:scale-95"
              >
                Explore Conditions <ArrowRight className="w-5 h-5" />
              </a>
              <a 
                href="#about" 
                className="w-full sm:w-auto bg-white/50 backdrop-blur-sm text-brand-brown px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-brand-brown hover:text-brand-beige transition-all border border-brand-brown/10 active:scale-95"
              >
                Our Philosophy
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Why Comfoot - Bento Grid Section */}
      <section className="py-24 bg-brand-beige/50 relative overflow-hidden">
        {/* Subtle Background Texture */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2D241E 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        <div className="section-padding relative z-10">
          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-brand-brown text-brand-beige p-10 md:p-16 rounded-[3rem] flex flex-col justify-between relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-all duration-700" />
              <div>
                <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">Guidance in Every Step.</h2>
                <p className="text-lg opacity-80 max-w-md leading-relaxed font-light">We combine medical knowledge with practical lifestyle advice to help you navigate foot health in India.</p>
              </div>
              <div className="mt-12 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Vetted by Comfoot</span>
              </div>
            </div>

            <div className="md:col-span-4 bg-brand-orange text-white p-10 rounded-[3rem] flex flex-col justify-between group shadow-xl hover:shadow-2xl transition-all duration-500">
              <Zap className="w-12 h-12 mb-8 group-hover:rotate-12 transition-transform duration-500" />
              <div>
                <h3 className="text-3xl font-display font-bold mb-4">Fast Relief.</h3>
                <p className="text-sm opacity-90 leading-relaxed font-light">Immediate DIY protocols for acute pain management at home.</p>
              </div>
            </div>

            <div className="md:col-span-4 bg-brand-gold text-white p-10 rounded-[3rem] flex flex-col justify-between group shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-8 border border-white/20">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-3xl font-display font-bold mb-4">Active Recovery.</h3>
                <p className="text-sm opacity-90 leading-relaxed font-light">Long-term strategies to keep you moving without discomfort.</p>
              </div>
            </div>

            <div className="md:col-span-8 bg-white p-10 md:p-16 rounded-[3rem] border border-brand-brown/5 shadow-soft flex flex-col md:flex-row gap-12 items-center group">
              <div className="flex-1">
                <h3 className="text-3xl md:text-4xl font-display font-bold text-brand-brown mb-4">Curated Gear.</h3>
                <p className="text-brand-taupe leading-relaxed font-light">We handpick the best footwear and orthotics available in the Indian market, so you don't have to.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {['Insoles', 'Massagers', 'Support Sleeves'].map(tag => (
                    <span key={tag} className="px-5 py-2 bg-brand-beige rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-brand-gold border border-brand-gold/10 hover:bg-brand-gold hover:text-white transition-colors cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-48 h-48 bg-brand-beige rounded-[2.5rem] flex items-center justify-center relative group overflow-hidden border border-brand-brown/5">
                <div className="absolute inset-0 bg-brand-orange/5 group-hover:bg-brand-orange/10 transition-all duration-500" />
                <ExternalLink className="w-12 h-12 text-brand-orange group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Selection */}
      <section id="explore" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-brand-gold/5 rounded-full blur-[120px] -mr-20 -mt-20" />
        
        <div className="section-padding relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-12 bg-brand-orange" />
                <span className="text-brand-orange font-bold uppercase tracking-[0.25em] text-[10px]">The Diagnostics</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-brand-brown leading-tight">
                Choose Your <span className="text-brand-orange">Condition</span>.
              </h2>
              <p className="text-lg text-brand-taupe/70 mt-6 font-light">
                Select a profile below to unlock structured guidance, DIY protocols, and curated product recommendations tailored for your specific foot health needs.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 rounded-full border border-brand-brown/10 flex items-center justify-center text-brand-brown/20 animate-spin-slow">
                <Activity className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {CONDITIONS.map((condition, idx) => (
              <motion.div
                key={condition.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <ConditionCard 
                  condition={condition} 
                  onClick={() => setSelectedCondition(condition)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Comparison Table */}
      <section id="compare" className="py-32 bg-brand-beige/50 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-brand-orange/10 rounded-full blur-[150px] -z-10" />
        
        <div className="section-padding relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/10 text-brand-gold rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-brand-gold/20">
              Decision Guide
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-brand-brown mb-6">Not Sure What You <span className="text-brand-gold italic">Need</span>?</h2>
            <p className="text-lg text-brand-taupe/70 max-w-2xl mx-auto font-light">A curated guide to matching your symptoms with the most effective support protocols.</p>
          </div>
          
          <div className="overflow-x-auto rounded-[2.5rem] border border-brand-brown/5 shadow-2xl bg-white/80 backdrop-blur-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-brown text-brand-beige">
                  <th className="p-8 font-display font-bold uppercase tracking-widest text-[11px]">Condition</th>
                  <th className="p-8 font-display font-bold uppercase tracking-widest text-[11px]">Our Recommendation</th>
                  <th className="p-8 font-display font-bold uppercase tracking-widest text-[11px]">Primary Benefit</th>
                  <th className="p-8 font-display font-bold uppercase tracking-widest text-[11px] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-brown/5">
                {CONDITIONS.map((c) => (
                  <tr key={c.id} className="hover:bg-brand-orange/5 transition-all duration-300 group">
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all">
                          <Activity className="w-5 h-5" />
                        </div>
                        <span className="font-display font-bold text-lg text-brand-brown">{c.title}</span>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-brand-brown">{c.products[0].name}</span>
                        <span className="text-xs text-brand-taupe/60 mt-1">Medical-Grade Support</span>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className="text-sm text-brand-taupe font-light italic leading-relaxed">"{c.products[0].bestFor}"</span>
                    </td>
                    <td className="p-8 text-right">
                      <button 
                        onClick={() => setSelectedCondition(c)}
                        className="text-[10px] font-bold uppercase tracking-widest text-brand-orange hover:text-brand-orange transition-colors flex items-center gap-2 ml-auto"
                      >
                        View Profile <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-brand-brown text-brand-beige relative overflow-hidden">
        {/* Designer Background Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-brand-orange/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[30%] h-[50%] bg-brand-gold/20 blur-[100px] rounded-full" />
        </div>

        <div className="section-padding relative z-10">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="h-px w-12 bg-brand-gold" />
                <span className="text-brand-gold font-bold uppercase tracking-[0.25em] text-[10px]">Our Philosophy</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-display font-bold mb-10 leading-[0.95] tracking-tight">
                Crafting <span className="text-brand-gold italic">Wellness</span> for Every Step.
              </h2>
              <div className="space-y-8 text-xl leading-relaxed opacity-80 font-light">
                <p>
                  Comfoot is a focused foot wellness platform that believes in education-first guidance. We understand that foot pain isn't just a physical discomfort—it affects your mobility, your productivity, and your overall quality of life.
                </p>
                <p>
                  Our mission is to help you understand the root cause of your foot problems before recommending structured support options. We curate high-quality products that provide real relief, helping you make informed decisions for your sole.
                </p>
              </div>
              
              <div className="mt-12 p-8 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10">
                <p className="font-display text-3xl font-bold text-brand-gold italic leading-tight">
                  “Educate First. <br />Monetize Responsibly.”
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-4 opacity-40">The Comfoot Manifesto</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-brand-beige/5 rounded-[3rem] flex flex-col items-center justify-center p-16 border border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-gold/5 group-hover:bg-brand-gold/10 transition-all duration-700" />
                <div className="text-center space-y-8 relative z-10">
                  <div className="w-24 h-24 rounded-full bg-brand-gold/20 flex items-center justify-center mx-auto mb-8 border border-brand-gold/30">
                    <HelpCircle className="w-10 h-10 text-brand-gold" />
                  </div>
                  <h3 className="text-3xl font-display font-bold text-brand-beige">Have Questions?</h3>
                  <p className="text-lg opacity-70 font-light leading-relaxed">Our team is here to help you navigate your foot wellness journey with care and guidance.</p>
                  <button className="bg-brand-gold text-brand-brown px-12 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-brand-beige hover:text-brand-brown transition-all shadow-xl active:scale-95">
                    Contact Us
                  </button>
                </div>
              </div>
              
              {/* Abstract floating shapes */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-orange/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-brand-beige text-brand-taupe pt-32 pb-12 px-6 border-t border-brand-brown/5 relative overflow-hidden">
        {/* Subtle Background Texture */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2D241E 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid sm:grid-cols-2 md:grid-cols-12 gap-16 mb-24">
            <div className="md:col-span-5">
              <div className="flex items-center gap-2 mb-12">
                <img 
                  src="/logo.png" 
                  alt="Comfoot Logo" 
                  className="h-24 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-lg max-w-sm leading-relaxed text-brand-taupe/80 font-light mb-10">
                Crafting the future of foot wellness through education, curated support, and structured guidance.
              </p>
              <div className="flex items-center gap-4">
                <a href="https://www.instagram.com/comfoot._/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-brown/10 flex items-center justify-center hover:bg-brand-brown hover:text-brand-beige transition-all duration-300" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://x.com/Comfooot" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-brown/10 flex items-center justify-center hover:bg-brand-brown hover:text-brand-beige transition-all duration-300" aria-label="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://www.linkedin.com/company/comfoot/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-brown/10 flex items-center justify-center hover:bg-brand-brown hover:text-brand-beige transition-all duration-300" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="mailto:hello@comfoot.in" className="w-10 h-10 rounded-full border border-brand-brown/10 flex items-center justify-center hover:bg-brand-brown hover:text-brand-beige transition-all duration-300" aria-label="Email">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-brand-brown font-bold mb-8 uppercase tracking-[0.2em] text-[10px]">Navigation</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#home" className="hover:text-brand-orange transition-colors">Home</a></li>
                <li><a href="#explore" className="hover:text-brand-orange transition-colors">Conditions</a></li>
                <li><a href="#compare" className="hover:text-brand-orange transition-colors">Comparison</a></li>
                <li><a href="#about" className="hover:text-brand-orange transition-colors">Philosophy</a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-brand-brown font-bold mb-8 uppercase tracking-[0.2em] text-[10px]">Resources</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#" className="hover:text-brand-orange transition-colors">Foot Care Guide</a></li>
                <li><a href="#" className="hover:text-brand-orange transition-colors">Shoe Fitting 101</a></li>
                <li><a href="#" className="hover:text-brand-orange transition-colors">Wellness Blog</a></li>
                <li><a href="#" className="hover:text-brand-orange transition-colors">FAQs</a></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-brand-brown font-bold mb-8 uppercase tracking-[0.2em] text-[10px]">Newsletter</h4>
              <p className="text-xs text-brand-taupe/70 mb-6 leading-relaxed">Join our community for weekly foot health insights and curated gear updates.</p>
              <form className="relative" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-white border border-brand-brown/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-brand-brown text-brand-beige px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-orange transition-all">
                  Join
                </button>
              </form>
            </div>
          </div>
          
          <div className="pt-12 border-t border-brand-brown/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-brand-taupe/40">
              <span>&copy; {new Date().getFullYear()} Comfoot</span>
              <a href="#" className="hover:text-brand-brown transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand-brown transition-colors">Terms of Service</a>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-taupe/40">
              <span>Made with</span>
              <Activity className="w-3 h-3 text-brand-orange" />
              <span>for your soles</span>
            </div>
          </div>

          <div className="mt-12 bg-white/50 p-6 rounded-2xl border border-brand-brown/5">
            <p className="text-[10px] leading-relaxed text-center text-brand-taupe/60 italic">
              <strong className="text-brand-brown not-italic">Medical Disclaimer:</strong> Content on this website is for educational purposes only and is not intended as medical advice. Always consult with a qualified healthcare professional for diagnosis and treatment of foot conditions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
