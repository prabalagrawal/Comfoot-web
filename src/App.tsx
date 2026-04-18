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
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Share2,
  Check,
  ChevronLeft,
  LogOut,
  User as UserIcon,
  BookOpen,
  Star
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValueEvent } from 'motion/react';
import { auth, googleProvider, FirebaseUser, db, handleFirestoreError } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';

const Logo = ({ isScrolled, className = "" }: { isScrolled?: boolean, className?: string }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className={`bg-brand-orange rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 ${isScrolled ? 'w-10 h-10' : 'w-14 h-14'}`}>
      <Footprints className="text-white w-3/5 h-3/5" />
    </div>
    <div className="flex flex-col leading-none">
      <span className={`font-display font-bold text-brand-brown transition-all duration-500 ${isScrolled ? 'text-xl' : 'text-3xl'}`}>
        Com<span className="text-brand-orange">foot</span>
      </span>
      {!isScrolled && (
        <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-brand-taupe/60 mt-1">
          Sole Support
        </span>
      )}
    </div>
  </div>
);

import { FootProblemQuiz } from './components/FootProblemQuiz';
import { MythBusters } from './components/MythBusters';
import { AdminDashboard } from './components/AdminDashboard';
import { FootJournal } from './components/FootJournal';
import { ConditionComparison } from './components/ConditionComparison';
import { Condition, Product, Symptom } from './types';

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
      }
    ],
    painType: ['Heel Pain', 'Arch Pain'],
    affectedArea: ['Heel', 'Arch']
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
        name: 'Frido Rigid Arch Support Insole',
        description: 'Rigid orthotic insoles designed to provide maximum support for collapsed arches and improve foot alignment.',
        bestFor: 'Daily wear in sports or formal shoes.',
        link: 'https://amzn.in/d/066diPwp'
      },
      {
        name: 'Boldfit Arch Support',
        description: 'Comfortable and durable arch support inserts that help reduce foot fatigue and pain.',
        bestFor: 'Active lifestyles and long hours of standing.',
        link: 'https://amzn.in/d/0bgzXhjD'
      },
      {
        name: 'Flat Foot Arch Support',
        description: 'Targeted support for the medial arch to redistribute pressure and reduce strain.',
        bestFor: 'Correcting overpronation.',
        link: 'https://amzn.in/d/01TLGUJ3'
      }
    ],
    painType: ['Arch Pain', 'Aching'],
    affectedArea: ['Arch']
  },
  {
    id: 'bunions',
    title: 'Bunions (Hallux Valgus)',
    shortDesc: 'Bony bump at the base of the big toe.',
    fullDesc: 'A bunion is a bony bump that forms on the joint at the base of your big toe. It occurs when some of the bones in the front part of your foot move out of place.',
    whatIsIt: 'The tip of your big toe gets pulled toward the smaller toes and forces the joint at the base of your big toe to stick out.',
    causes: [
      'Wearing tight, narrow shoes',
      'Inherited structural foot defects',
      'Stress on your foot or a medical condition, such as arthritis',
      'Prolonged standing in high heels'
    ],
    symptoms: [
      { name: 'Bulging bump on the outside of the big toe', description: 'A visible, often red and swollen protrusion at the base of the big toe.' },
      { name: 'Swelling, redness or soreness', description: 'Inflammation around the big toe joint that can be painful to touch.' },
      { name: 'Corns or calluses', description: 'These often develop where the first and second toes overlap or rub against each other.' },
      { name: 'Persistent or intermittent pain', description: 'Aching or sharp pain that can make it difficult to find comfortable shoes.' }
    ],
    diySupport: [
      'Wearing wide-toe box shoes',
      'Using bunion pads or cushions',
      'Applying ice to the joint after standing',
      'Toe spacing exercises'
    ],
    products: [
      {
        name: 'Bunion Corrector & Toe Separator',
        description: 'Soft silicone separators that gently realign the big toe and provide a protective barrier against friction.',
        bestFor: 'Night-time realignment and daily friction protection.',
        link: 'https://amzn.to/4aFri8e'
      },
      {
        name: 'Orthopedic Bunion Splint',
        description: 'Adjustable splint that applies pressure to the big toe to help maintain correct alignment during sleep.',
        bestFor: 'Corrective support and pain relief.',
        link: 'https://amzn.to/4cBR9jU'
      }
    ],
    painType: ['Toe Pain', 'Aching'],
    affectedArea: ['Toes']
  },
  {
    id: 'diabetic-foot',
    title: 'Diabetic Foot Care',
    shortDesc: 'Specialized care for sensitive feet due to diabetes.',
    fullDesc: 'Diabetes can cause nerve damage (neuropathy) and poor blood flow, making feet vulnerable to ulcers and infections that can be slow to heal.',
    whatIsIt: 'A critical condition where even minor injuries can lead to serious complications. Daily inspection and specialized protection are mandatory.',
    causes: [
      'High blood sugar levels over time',
      'Peripheral neuropathy (nerve damage)',
      'Peripheral artery disease (poor circulation)',
      'Inappropriate footwear causing pressure points'
    ],
    symptoms: [
      { name: 'Loss of feeling or numbness', description: 'Inability to feel heat, cold, or pain, which can lead to unnoticed injuries.' },
      { name: 'Tingling or burning sensation', description: 'Often described as "pins and needles," usually worse at night.' },
      { name: 'Slow-healing sores or ulcers', description: 'Minor cuts or blisters that do not heal within a normal timeframe.' },
      { name: 'Changes in skin color or temperature', description: 'Redness, warmth, or unusual coolness indicating circulation issues.' }
    ],
    diySupport: [
      'Daily foot inspections with a mirror',
      'Never walking barefoot',
      'Moisturizing feet (but not between toes)',
      'Gentle washing and thorough drying'
    ],
    products: [
      {
        name: 'Diabetic Socks (Seamless)',
        description: 'Non-binding, moisture-wicking socks with seamless toes to prevent friction and pressure points.',
        bestFor: 'Daily protection and improved circulation.',
        link: 'https://amzn.to/4b0AXHN'
      },
      {
        name: 'Foobetik Foot Cream',
        description: 'Specialized moisturizing cream for diabetic feet to prevent dryness and cracking while maintaining skin integrity.',
        bestFor: 'Preventing fissures and maintaining skin health.',
        link: 'https://amzn.in/d/0gh0wRDf'
      }
    ],
    painType: ['Numbness', 'Tingling'],
    affectedArea: ['Whole Foot']
  },
  {
    id: 'achilles-tendinitis',
    title: 'Achilles Tendinitis',
    shortDesc: 'Pain along the back of the leg near the heel.',
    fullDesc: 'Achilles tendinitis is an overuse injury of the Achilles tendon, the band of tissue that connects calf muscles at the back of the lower leg to your heel bone.',
    whatIsIt: 'Commonly occurs in runners who have suddenly increased the intensity or duration of their runs, or middle-aged people who play sports.',
    causes: [
      'Sudden increase in physical activity',
      'Tight calf muscles',
      'Bone spurs on the heel',
      'Running in worn-out or improper shoes'
    ],
    symptoms: [
      { name: 'Aching pain in the back of the leg', description: 'Usually felt above the heel after running or other sports activity.' },
      { name: 'Episodes of more severe pain', description: 'Sharp pain during prolonged running, stair climbing, or sprinting.' },
      { name: 'Tenderness or stiffness', description: 'Especially in the morning, which usually improves with mild activity.' },
      { name: 'Mild swelling or a "bump"', description: 'A thickening of the tendon that may be visible or felt.' }
    ],
    diySupport: [
      'R.I.C.E (Rest, Ice, Compression, Elevation)',
      'Eccentric calf strengthening exercises',
      'Using heel lifts in shoes',
      'Gentle stretching of the calf'
    ],
    products: [
      {
        name: 'Achilles Tendon Support Sleeve',
        description: 'Compression sleeve with integrated gel pads to stabilize the tendon and reduce vibration during movement.',
        bestFor: 'Active recovery and sports support.',
        link: 'https://amzn.to/4rZCbsz'
      },
      {
        name: 'Silicone Heel Lifts',
        description: 'Inserts that slightly elevate the heel to reduce the tension and strain on the Achilles tendon.',
        bestFor: 'Immediate relief during walking.',
        link: 'https://amzn.to/4cBR9jU'
      }
    ],
    painType: ['Heel Pain', 'Aching'],
    affectedArea: ['Heel', 'Ankle']
  }
];

// --- Components ---

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
      <span className="border-b border-dotted border-brand-gold/40 group-hover:border-brand-gold transition-colors flex items-center gap-1.5">
        {symptom.name}
        <HelpCircle className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
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

const ProductRating: React.FC<{ productId: string; conditionId: string; user: FirebaseUser | null }> = ({ productId, conditionId, user }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleRate = async (value: number) => {
    if (!user) return;
    setRating(value);
    try {
      await addDoc(collection(db, 'productFeedback'), {
        userId: user.uid,
        productId,
        conditionId,
        rating: value,
        createdAt: new Date().toISOString()
      });
      setSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, 'create', '/productFeedback');
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 mt-4 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100"
      >
        <CheckCircle2 className="w-3 h-3" /> Thanks for your feedback!
      </motion.div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-brand-brown/5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-taupe/60 mb-2">Was this recommendation helpful?</p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={!user}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
            onClick={() => handleRate(star)}
            className={`transition-all ${!user ? 'cursor-not-allowed opacity-50' : 'hover:scale-110 active:scale-95'}`}
          >
            <Star 
              className={`w-4 h-4 transition-colors ${
                (hover || rating || 0) >= star 
                  ? 'fill-brand-orange text-brand-orange' 
                  : 'text-brand-taupe/30'
              }`} 
            />
          </button>
        ))}
        {!user && (
          <span className="text-[9px] text-brand-taupe/40 ml-2 italic">Login to rate</span>
        )}
      </div>
    </div>
  );
};

const Navbar: React.FC<{ user: FirebaseUser | null }> = ({ user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Quiz', href: '#quiz' },
    { name: 'Myths', href: '#myth-busters' },
    { name: 'Conditions', href: '#explore' },
    { name: 'Compare', href: '#compare' },
    ...(user ? [{ name: 'Journal', href: '#journal' }] : []),
    { name: 'About', href: '#about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-brand-beige/90 backdrop-blur-xl shadow-sm py-2' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <a href="#home" className="flex items-center">
          <Logo isScrolled={isScrolled} />
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
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-brand-beige rounded-full border border-brand-brown/10">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-brand-brown" />
                  )}
                  <span className="text-[10px] font-bold text-brand-brown truncate max-w-[80px]">{user.displayName?.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 text-brand-taupe hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-brand-brown px-5 py-2.5 rounded-full hover:bg-brand-brown hover:text-brand-beige transition-all duration-300"
              >
                <UserIcon className="w-4 h-4" /> Login
              </button>
            )}

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
              {user ? (
                <div className="flex items-center justify-between p-4 bg-brand-brown/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                    ) : (
                      <UserIcon className="w-5 h-5 text-brand-brown" />
                    )}
                    <span className="font-bold text-brand-brown">{user.displayName}</span>
                  </div>
                  <button onClick={handleLogout} className="text-rose-500 font-bold text-xs uppercase tracking-widest">Logout</button>
                </div>
              ) : (
                <button 
                  onClick={() => { handleLogin(); setMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 bg-brand-brown text-brand-beige py-3 rounded-xl font-bold uppercase tracking-widest text-xs"
                >
                  <UserIcon className="w-4 h-4" /> Login with Google
                </button>
              )}
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

const ConditionCard: React.FC<{ 
  condition: Condition; 
  onQuickView: () => void;
  onLearnMore: () => void;
  isComparing: boolean;
  onToggleCompare: () => void;
}> = ({ condition, onQuickView, onLearnMore, isComparing, onToggleCompare }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`bg-white p-8 rounded-[2rem] shadow-soft border transition-all group text-left w-full h-full relative overflow-hidden ${
        isComparing ? 'border-brand-orange ring-1 ring-brand-orange/20' : 'border-brand-brown/5 hover:border-brand-orange/20'
      }`}
    >
      {/* Comparison Badge */}
      <AnimatePresence>
        {isComparing && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-6 right-6 bg-brand-orange text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full z-10 shadow-lg"
          >
            Comparing
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`p-4 rounded-2xl transition-all duration-500 ${
        isComparing ? 'bg-brand-orange text-brand-beige' : 'bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-brand-beige'
      }`}>
        <Activity className="w-6 h-6" />
      </div>
      <h3 className="text-2xl font-display font-bold text-brand-brown group-hover:text-brand-orange transition-colors mt-4">{condition.title}</h3>
      <p className="text-sm text-brand-taupe/80 leading-relaxed font-light flex-1">{condition.shortDesc}</p>
      
      <div className="mt-auto pt-6 flex flex-col gap-3 w-full">
        <div className="flex items-center gap-2">
          <button 
            onClick={onToggleCompare}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border ${
              isComparing 
                ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/20' 
                : 'bg-brand-beige text-brand-taupe border-brand-brown/5 hover:border-brand-orange/20'
            }`}
          >
            {isComparing ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3 rotate-90" />}
            {isComparing ? 'Selected' : 'Compare'}
          </button>
          
          <button 
            onClick={onQuickView}
            className="p-2.5 bg-brand-beige text-brand-taupe rounded-xl border border-brand-brown/5 hover:border-brand-orange/20 transition-all"
            title="Quick View"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <button 
          onClick={onLearnMore}
          className="w-full bg-brand-brown text-brand-beige py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-orange transition-all shadow-sm active:scale-95 text-center"
        >
          Learn More
        </button>
      </div>
    </motion.div>
  );
};

const ConditionDetailView: React.FC<{ condition: Condition; user: FirebaseUser | null; onBack: () => void }> = ({ condition, user, onBack }) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start start", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const sectionLabel = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["Intro", "Science", "Causes", "Symptoms", "Care"]
  );

  const progressPercent = useTransform(scrollYProgress, (v) => Math.round(v * 100));

  const [percent, setPercent] = useState(0);
  const [currentSection, setCurrentSection] = useState("Intro");

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setPercent(Math.round(latest * 100));
  });

  useMotionValueEvent(sectionLabel, "change", (latest) => {
    setCurrentSection(latest);
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-brand-beige/30 pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-brand-brown hover:text-brand-orange transition-colors mb-12 group"
        >
          <div className="w-10 h-10 rounded-full border border-brand-brown/10 flex items-center justify-center group-hover:border-brand-orange/20">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">Back to Explore</span>
        </button>

        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8" ref={contentRef}>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-brand-orange" />
              <span className="text-brand-orange font-bold uppercase tracking-[0.25em] text-[10px]">In-Depth Analysis</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-brown mb-8 leading-tight">
              {condition.title}
            </h1>
            
            <p className="text-2xl leading-relaxed text-brand-taupe mb-16 font-light">
              {condition.fullDesc}
            </p>

            <div className="space-y-20">
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                    <Info className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-brand-brown">Understanding the Condition</h2>
                </div>
                <div className="prose prose-brand max-w-none text-lg text-brand-taupe/90 leading-relaxed bg-white p-10 rounded-[2.5rem] border border-brand-brown/5 shadow-soft">
                  <p>{condition.whatIsIt}</p>
                </div>
              </section>

              <div className="grid md:grid-cols-2 gap-12">
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" /> Common Causes
                  </h3>
                  <div className="bg-white p-8 rounded-[2rem] border border-brand-brown/5 shadow-soft">
                    <ul className="space-y-4">
                      {condition.causes.map((cause, i) => (
                        <li key={i} className="text-sm flex items-start gap-4 text-brand-taupe group">
                          <div className="w-8 h-8 rounded-lg bg-brand-beige flex items-center justify-center shrink-0 text-brand-brown font-bold text-[10px] group-hover:bg-brand-orange group-hover:text-white transition-colors">
                            0{i + 1}
                          </div>
                          <span className="pt-1.5">{cause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" /> Key Symptoms <HelpCircle className="w-3 h-3 opacity-50" />
                  </h3>
                  <div className="bg-white p-8 rounded-[2rem] border border-brand-brown/5 shadow-soft">
                    <ul className="space-y-4">
                      {condition.symptoms.map((symptom, i) => (
                        <SymptomItem key={i} symptom={symptom} />
                      ))}
                    </ul>
                  </div>
                </section>
              </div>

              <section>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange mb-8">Self-Care & DIY Protocols</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {condition.diySupport.map((tip, i) => (
                    <div key={i} className="bg-brand-brown text-brand-beige p-8 rounded-[2rem] flex items-center gap-5 group hover:bg-brand-orange transition-colors duration-500">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 group-hover:rotate-12 transition-transform">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold uppercase tracking-widest leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-32 flex gap-8 items-start">
              {/* Vertical Scroll Progress Indicator */}
              <div className="hidden lg:flex flex-col items-center gap-4 py-8 h-[450px] shrink-0">
                <div className="flex flex-col items-center gap-2 mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-brand-taupe/40 [writing-mode:vertical-lr] rotate-180">Reading Progress</span>
                  <motion.span className="text-[8px] font-bold text-brand-orange uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">
                    {currentSection}
                  </motion.span>
                </div>
                <div className="w-1 flex-1 bg-brand-brown/5 rounded-full overflow-hidden relative">
                  {/* Milestone Dots */}
                  <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between py-2 pointer-events-none z-0">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-full h-px bg-brand-brown/10" />
                    ))}
                  </div>
                  
                  <motion.div 
                    className="absolute top-0 left-0 right-0 bg-brand-orange origin-top rounded-full z-10"
                    style={{ height: '100%', scaleY }}
                  />
                </div>
                <div className="w-2 h-2 rounded-full border-2 border-brand-orange/20 flex items-center justify-center">
                  <motion.div 
                    className="w-1 h-1 rounded-full bg-brand-orange"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <motion.span className="text-[8px] font-bold text-brand-orange mt-1">
                  {percent}%
                </motion.span>
              </div>

              <div className="flex-1 space-y-8">
                <div className="bg-white p-10 rounded-[3rem] border border-brand-brown/5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                
                <div className="flex items-center gap-3 mb-8">
                  <ShieldCheck className="text-brand-orange w-6 h-6" />
                  <h3 className="text-2xl font-display font-bold text-brand-brown">Curated Gear</h3>
                </div>
                
                <p className="text-sm text-brand-taupe/70 mb-10 leading-relaxed">
                  We've handpicked these specific solutions to help manage {condition.title} effectively.
                </p>

                <div className="space-y-6">
                  {condition.products.map((product, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-brand-beige/50 border border-brand-brown/5 hover:border-brand-orange/20 transition-all group">
                      <h4 className="font-bold text-brand-brown mb-2 group-hover:text-brand-orange transition-colors">{product.name}</h4>
                      <p className="text-xs text-brand-taupe/70 mb-4 line-clamp-2">{product.description}</p>
                      <a 
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold uppercase tracking-widest text-brand-orange flex items-center gap-2 hover:gap-3 transition-all"
                      >
                        View on Amazon <ArrowRight className="w-3 h-3" />
                      </a>
                      <ProductRating productId={product.name} conditionId={condition.id} user={user} />
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-10 border-t border-brand-brown/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-3.5 h-3.5 text-brand-taupe/40" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-taupe/40">Affiliate Disclosure</span>
                  </div>
                  <p className="text-[10px] text-brand-taupe/40 leading-relaxed italic">
                    Comfoot earns a small commission from qualifying purchases at no extra cost to you.
                  </p>
                </div>
              </div>

              <div className="bg-brand-orange p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <HelpCircle className="w-12 h-12 mb-6 opacity-50" />
                <h3 className="text-2xl font-display font-bold mb-4">Still in Pain?</h3>
                <p className="text-sm opacity-90 mb-8 leading-relaxed">If symptoms persist for more than 2 weeks, we strongly recommend consulting a podiatrist.</p>
                <a href="#about" className="inline-block bg-white text-brand-orange px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-brown hover:text-white transition-all">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </motion.div>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(product.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <h4 className="font-display font-bold text-2xl mb-3 text-brand-brown group-hover:text-brand-orange transition-colors flex items-center gap-2">
          <Zap className="w-5 h-5 shrink-0 text-brand-orange" /> {product.name}
        </h4>
        <p className="text-base leading-relaxed text-brand-taupe/90 font-light line-clamp-4">{product.description}</p>
      </div>
      
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange bg-brand-orange/5 w-fit px-4 py-1.5 rounded-full border border-brand-orange/10">
        Best For: {product.bestFor}
      </div>
      
      <div className="mt-auto flex gap-3">
        <a 
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-brand-brown text-brand-beige text-center py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-brand-orange transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
        >
          View Details <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
        <button
          onClick={handleShare}
          className="px-6 bg-brand-beige text-brand-brown rounded-2xl hover:bg-brand-brown hover:text-brand-beige transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          title="Share Product"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Share</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

const ConditionModal: React.FC<{ condition: Condition; user: FirebaseUser | null; onClose: () => void }> = ({ condition, user, onClose }) => {
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
            {condition.products.map((product, i) => {
              const [copied, setCopied] = useState(false);
              
              const handleShare = (e: React.MouseEvent) => {
                e.preventDefault();
                navigator.clipboard.writeText(product.link);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              };

              return (
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
                  
                  <h4 className="font-display font-bold text-lg text-brand-brown mb-2 group-hover:text-brand-orange transition-colors flex items-center gap-2">
                    <Zap className="w-4 h-4 shrink-0 text-brand-orange" /> {product.name}
                  </h4>
                  <p className="text-sm text-brand-taupe/80 leading-relaxed mb-4">
                    {product.description}
                  </p>
                  
                  <div className="flex gap-2">
                    <a 
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-brand-brown text-brand-beige py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-orange transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      View on Amazon <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={handleShare}
                      className="px-4 bg-brand-beige text-brand-brown rounded-xl hover:bg-brand-brown hover:text-brand-beige transition-all shadow-sm flex items-center justify-center gap-2"
                      title="Share Product"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Share</span>
                        </>
                      )}
                    </button>
                  </div>
                  <ProductRating productId={product.name} conditionId={condition.id} user={user} />
                </motion.div>
              );
            })}
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

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: Math.random() * 0.5 + 0.1
          }}
          animate={{ 
            y: [null, (Math.random() - 0.5) * 100 + "px"],
            x: [null, (Math.random() - 0.5) * 100 + "px"],
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute w-1 h-1 bg-brand-orange rounded-full"
          style={{ 
            width: Math.random() * 4 + 2 + "px",
            height: Math.random() * 4 + 2 + "px",
            filter: "blur(1px)"
          }}
        />
      ))}
    </div>
  );
};

const ScrollProgressFootprints = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Number of footprints to show in the side track
  const footprintCount = 12;

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[60] hidden lg:flex flex-col items-center gap-6 pointer-events-none">
      <div className="relative h-64 w-8 flex flex-col items-center justify-between">
        {/* Track Line */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-brand-brown/10" />
        
        {/* Footprints */}
        {[...Array(footprintCount)].map((_, i) => {
          const stepProgress = (i / (footprintCount - 1)) * 100;
          const isActive = scrollProgress >= stepProgress;
          const isLeft = i % 2 === 0;

          return (
            <motion.div
              key={i}
              initial={false}
              animate={{ 
                opacity: isActive ? 1 : 0.1,
                scale: isActive ? 1.1 : 0.8,
                color: isActive ? "#F27D26" : "#2D241E",
                x: isLeft ? -6 : 6
              }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              <Footprints 
                className={`w-4 h-4 transition-colors duration-500 ${isLeft ? '-scale-x-100' : ''}`} 
                style={{ transform: `rotate(${isLeft ? -15 : 15}deg) ${isLeft ? 'scaleX(-1)' : ''}` }}
              />
            </motion.div>
          );
        })}

        {/* Moving Indicator Footprint */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 z-20 text-brand-orange"
          animate={{ 
            top: `${scrollProgress}%`,
            x: (scrollProgress % 10 > 5) ? 8 : -8,
            rotate: (scrollProgress % 10 > 5) ? 15 : -15,
            scaleX: (scrollProgress % 10 > 5) ? 1 : -1
          }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <div className="relative">
            <Footprints className="w-6 h-6 drop-shadow-lg" />
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-brand-orange/20 rounded-full blur-md"
            />
          </div>
        </motion.div>
      </div>
      
      <div className="text-[8px] font-bold uppercase tracking-[0.3em] text-brand-taupe/40 [writing-mode:vertical-rl] rotate-180">
        Progress
      </div>
    </div>
  );
};

interface FootprintProps {
  step: {
    id: number;
    isLeft: boolean;
    y: number;
    xOffset: number;
    rotate: number;
  };
  scrollY: any;
}

const Footprint: React.FC<FootprintProps> = ({ step, scrollY }) => {
  const targetY = step.y;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
  
  // Fade in as it approaches the center of the viewport, then fade out
  const opacity = useTransform(
    scrollY,
    [targetY - viewportHeight * 0.8, targetY - viewportHeight * 0.4, targetY + viewportHeight * 0.2, targetY + viewportHeight * 0.6],
    [0, 0.15, 0.15, 0]
  );
  
  // Scale up as it appears
  const scale = useTransform(
    scrollY,
    [targetY - viewportHeight * 0.8, targetY - viewportHeight * 0.4],
    [0.7, 1]
  );

  // Parallax effect: shift the footprint vertically relative to scroll
  const yOffset = useTransform(
    scrollY,
    [targetY - viewportHeight, targetY + viewportHeight],
    [40, -40]
  );

  return (
    <motion.div
      style={{
        opacity,
        scale,
        y: yOffset,
        left: step.isLeft ? `calc(6% + ${step.xOffset}px)` : `calc(94% + ${step.xOffset}px)`,
        top: step.y,
        position: 'absolute',
        rotate: step.rotate,
        x: '-50%',
        transformOrigin: 'center',
      }}
      className="text-brand-brown"
    >
      <div style={{ transform: step.isLeft ? 'scaleX(-1)' : 'none' }}>
        <Footprints className="w-16 h-16" />
      </div>
      {/* Subtle glow */}
      <motion.div 
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-brand-orange/5 rounded-full blur-2xl -z-10"
      />
    </motion.div>
  );
};

const WalkingTrail = () => {
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Generate steps with more organic placement
  const steps = Array.from({ length: 45 }, (_, i) => ({
    id: i,
    isLeft: i % 2 === 0,
    y: i * 320 + 700, // Spacing
    xOffset: Math.sin(i * 0.4) * 25, // Organic path wobble
    rotate: (i % 2 === 0 ? -15 : 15) + (Math.sin(i) * 8)
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden hidden lg:block">
      {steps.map((step) => (
        <Footprint key={step.id} step={step} scrollY={smoothScrollY} />
      ))}
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [view, setView] = useState<'home' | 'detail'>('home');
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  
  // Filter States
  const [painFilter, setPainFilter] = useState<string>('All');
  const [areaFilter, setAreaFilter] = useState<string>('All');

  // Derive unique filter options
  const allPainTypes = ['All', ...Array.from(new Set(CONDITIONS.flatMap(c => c.painType)))];
  const allAreas = ['All', ...Array.from(new Set(CONDITIONS.flatMap(c => c.affectedArea)))];

  const filteredConditions = CONDITIONS.filter(condition => {
    const matchesPain = painFilter === 'All' || condition.painType.includes(painFilter);
    const matchesArea = areaFilter === 'All' || condition.affectedArea.includes(areaFilter);
    return matchesPain && matchesArea;
  });

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterStatus('loading');
    try {
      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewsletterStatus('success');
        setNewsletterMessage('Welcome to the community!');
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
        setNewsletterMessage(data.error || 'Something went wrong.');
      }
    } catch (error) {
      setNewsletterStatus('error');
      setNewsletterMessage('Failed to connect to server.');
    }
  };

  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const compareConditions = CONDITIONS.filter(c => compareList.includes(c.id));

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedCondition || showComparison) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedCondition, showComparison]);

  if (showAdmin) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />;
  }

  if (view === 'detail' && selectedCondition) {
    return (
      <div className="min-h-screen bg-brand-beige/50">
        <Navbar user={user} />
        <ConditionDetailView 
          condition={selectedCondition} 
          user={user}
          onBack={() => {
            setView('home');
            setSelectedCondition(null);
          }} 
        />
        <footer className="bg-brand-beige text-brand-taupe pt-32 pb-12 px-6 border-t border-brand-brown/5 relative overflow-hidden">
          {/* Subtle Background Texture */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2D241E 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          <div className="max-w-7xl mx-auto relative z-10">
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
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-brand-beige/50">
      {/* Global Floating Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[15%] left-[-5%] w-[30%] h-[30%] bg-brand-orange/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-[60%] right-[-10%] w-[40%] h-[40%] bg-brand-gold/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[20%] h-[20%] bg-brand-brown/10 rounded-full blur-[80px] animate-bounce-slow" />
      </div>

      <Navbar user={user} />
      <ScrollProgressFootprints />
      <WalkingTrail />

      <AnimatePresence>
        {selectedCondition && (
          <ConditionModal 
            condition={selectedCondition} 
            user={user}
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

            {/* Scroll Indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-20 flex flex-col items-center gap-3"
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-taupe/40">Scroll to Explore</span>
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-px h-12 bg-gradient-to-b from-brand-orange to-transparent"
              />
            </motion.div>
          </motion.div>
        </div>
        <FloatingParticles />
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

      <MythBusters />

      <FootProblemQuiz />

      {user && <FootJournal />}
      
      {/* Testimonials Section */}
      <section className="py-32 bg-brand-brown text-brand-beige relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-brand-orange rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[70%] bg-brand-gold rounded-full blur-[150px]" />
        </div>
        
        <div className="section-padding relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-brand-gold rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-white/10">
              User Stories
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">Real Relief, <span className="text-brand-gold italic">Real People</span>.</h2>
            <p className="text-lg opacity-70 max-w-2xl mx-auto font-light">Join thousands of people in India who have reclaimed their mobility with Comfoot's structured guidance.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Anjali Sharma",
                role: "Teacher, New Delhi",
                text: "Standing for 6 hours a day was becoming impossible. The Plantar Fasciitis protocol and the recommended insoles changed my life in just 3 weeks.",
                condition: "Plantar Fasciitis"
              },
              {
                name: "Vikram Mehta",
                role: "IT Professional, Bangalore",
                text: "I didn't even realize I had flat feet until I took the quiz. The arch support exercises are simple and actually work. Highly recommended!",
                condition: "Flat Feet"
              },
              {
                name: "Dr. Rajesh Iyer",
                role: "Orthopedic Surgeon, Mumbai",
                text: "Comfoot provides accurate, structured information that bridges the gap between clinical advice and daily lifestyle management.",
                condition: "Expert Review"
              }
            ].map((t, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white/5 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10 flex flex-col gap-6 relative group"
              >
                <div className="flex gap-1 text-brand-gold">
                  {[...Array(5)].map((_, i) => <Zap key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <p className="text-lg leading-relaxed font-light italic opacity-90">"{t.text}"</p>
                <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm">{t.name}</h4>
                    <p className="text-[10px] opacity-60 uppercase tracking-widest">{t.role}</p>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 bg-brand-orange/20 text-brand-orange rounded-full border border-brand-orange/20">
                    {t.condition}
                  </span>
                </div>
              </motion.div>
            ))}
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
            
            {/* Filter UI */}
            <div className="flex flex-col gap-6 md:items-end">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-taupe/60 ml-2">Type of Pain</label>
                  <div className="flex flex-wrap gap-2">
                    {allPainTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => setPainFilter(type)}
                        className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                          painFilter === type 
                            ? 'bg-brand-orange text-white border-brand-orange shadow-md' 
                            : 'bg-white text-brand-taupe border-brand-brown/10 hover:border-brand-orange/40'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-taupe/60 ml-2">Affected Area</label>
                <div className="flex flex-wrap gap-2">
                  {allAreas.map(area => (
                    <button
                      key={area}
                      onClick={() => setAreaFilter(area)}
                      className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                        areaFilter === area 
                          ? 'bg-brand-brown text-brand-beige border-brand-brown shadow-md' 
                          : 'bg-white text-brand-taupe border-brand-brown/10 hover:border-brand-orange/40'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="w-24 h-24 rounded-full border border-brand-brown/10 flex items-center justify-center text-brand-brown/20 animate-spin-slow">
                <Activity className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredConditions.length > 0 ? (
                filteredConditions.map((condition, idx) => (
                  <motion.div
                    key={condition.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ConditionCard 
                      condition={condition} 
                      onQuickView={() => setSelectedCondition(condition)}
                      onLearnMore={() => {
                        setSelectedCondition(condition);
                        setView('detail');
                      }}
                      isComparing={compareList.includes(condition.id)}
                      onToggleCompare={() => toggleCompare(condition.id)}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center"
                >
                  <div className="w-20 h-20 bg-brand-beige rounded-full flex items-center justify-center mx-auto mb-6">
                    <HelpCircle className="w-10 h-10 text-brand-taupe/20" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-brand-brown mb-2">No conditions found</h3>
                  <p className="text-brand-taupe/60">Try adjusting your filters to find what you're looking for.</p>
                  <button 
                    onClick={() => { setPainFilter('All'); setAreaFilter('All'); }}
                    className="mt-8 text-brand-orange font-bold uppercase tracking-widest text-[10px] hover:underline"
                  >
                    Reset all filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Comparison Floating Bar */}
      <AnimatePresence>
        {compareList.length > 0 && !showComparison && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-2xl"
          >
            <div className="bg-brand-brown text-brand-beige p-4 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-xl flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {compareConditions.map((c, i) => (
                    <motion.div 
                      key={c.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-10 h-10 rounded-full bg-brand-orange border-2 border-brand-brown flex items-center justify-center text-[10px] font-bold shadow-lg"
                      title={c.title}
                    >
                      {c.title.charAt(0)}
                    </motion.div>
                  ))}
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gold mb-0.5">Comparison List</p>
                  <p className="text-xs opacity-70">{compareList.length} condition{compareList.length > 1 ? 's' : ''} selected</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCompareList([])}
                  className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 hover:text-brand-orange transition-colors"
                >
                  Clear
                </button>
                <button 
                  onClick={() => setShowComparison(true)}
                  disabled={compareList.length < 2}
                  className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                    compareList.length >= 2 
                      ? 'bg-brand-orange text-white hover:bg-brand-orange/90 shadow-lg active:scale-95' 
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                >
                  Compare Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showComparison && (
          <ConditionComparison 
            conditions={compareConditions}
            onClose={() => setShowComparison(false)}
            onSelectCondition={(condition) => {
              setSelectedCondition(condition);
              setView('detail');
              setShowComparison(false);
            }}
          />
        )}
      </AnimatePresence>

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
                      <div className="flex items-center justify-end gap-4">
                        <button 
                          onClick={() => setSelectedCondition(c)}
                          className="text-[10px] font-bold uppercase tracking-widest text-brand-taupe hover:text-brand-orange transition-colors"
                        >
                          Quick View
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedCondition(c);
                            setView('detail');
                          }}
                          className="text-[10px] font-bold uppercase tracking-widest text-brand-orange hover:text-brand-orange transition-colors flex items-center gap-2"
                        >
                          Learn More <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
                  <div className="flex flex-col items-center gap-6">
                    <a href="mailto:hello@comfoot.in" className="bg-brand-gold text-brand-brown px-12 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-brand-beige hover:text-brand-brown transition-all shadow-xl active:scale-95">
                      Contact Us
                    </a>
                    <a 
                      href="https://www.instagram.com/comfoot._/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-brand-gold hover:text-brand-beige transition-all group/insta px-6 py-2 rounded-full border border-brand-gold/20 hover:border-brand-beige/40"
                    >
                      <Instagram className="w-4 h-4 group-hover/insta:rotate-12 transition-transform" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">@comfoot._</span>
                    </a>
                  </div>
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
              <Logo className="mb-12" />
              <p className="text-lg max-w-sm leading-relaxed text-brand-taupe/80 font-light mb-10">
                Crafting the future of foot wellness through education, curated support, and structured guidance.
              </p>
              <div className="flex items-center gap-4">
                <a href="https://x.com/Comfooot" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-brown/10 flex items-center justify-center hover:bg-brand-brown hover:text-brand-beige transition-all duration-300" aria-label="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://www.linkedin.com/company/comfoot/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-brown/10 flex items-center justify-center hover:bg-brand-brown hover:text-brand-beige transition-all duration-300" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/comfoot._/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-brand-brown/10 flex items-center justify-center hover:bg-brand-brown hover:text-brand-beige transition-all duration-300" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
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
              <form className="relative" onSubmit={handleNewsletterSubmit}>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  disabled={newsletterStatus === 'loading'}
                  className="w-full bg-white border border-brand-brown/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-brand-orange transition-colors disabled:opacity-50"
                  required
                />
                <button 
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="absolute right-2 top-2 bottom-2 bg-brand-brown text-brand-beige px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-orange transition-all disabled:opacity-50"
                >
                  {newsletterStatus === 'loading' ? '...' : 'Join'}
                </button>
              </form>
              {newsletterStatus !== 'idle' && (
                <p className={`mt-3 text-[10px] font-bold uppercase tracking-widest ${newsletterStatus === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {newsletterMessage}
                </p>
              )}
            </div>
          </div>
          
          <div className="pt-12 border-t border-brand-brown/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-brand-taupe/40">
              <span>&copy; {new Date().getFullYear()} Comfoot</span>
              <a href="#" className="hover:text-brand-brown transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand-brown transition-colors">Terms of Service</a>
              <button onClick={() => setShowAdmin(true)} className="hover:text-brand-brown transition-colors">Admin</button>
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
