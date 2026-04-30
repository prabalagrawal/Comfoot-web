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
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValueEvent, useMotionValue } from 'motion/react';
import { auth, googleProvider, FirebaseUser, db, handleFirestoreError } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';

const Logo = ({ isScrolled, className = "" }: { isScrolled?: boolean, className?: string }) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <div className={`bg-brand-brown rounded-[1.2rem] flex items-center justify-center shadow-luxury transition-all duration-700 ${isScrolled ? 'w-10 h-10' : 'w-12 h-12'}`}>
      <Footprints className="text-brand-orange w-3/5 h-3/5" />
    </div>
    <div className="flex flex-col leading-[0.8]">
      <span className={`font-display font-black text-brand-brown transition-all duration-700 tracking-[-0.05em] ${isScrolled ? 'text-lg' : 'text-xl md:text-2xl'}`}>
        Com<span className="text-brand-orange">foot</span>
      </span>
      {!isScrolled && (
        <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-brand-taupe/40 mt-1 ml-0.5">
          Where Comfort meets your Soul
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
        name: 'Frido Orthotics Bunion Corrector',
        description: 'Advanced bunion corrector designed for effective toe realignment and pressure relief.',
        bestFor: 'Hallux Valgus correction and pain relief.',
        link: 'https://amzn.to/4sW7nZN'
      },
      {
        name: 'AGEasy Antara Bunion Corrector',
        description: 'Comfortable bunion aid that helps in toe separation and alignment.',
        bestFor: 'Daily wear and gradual correction.',
        link: 'https://amzn.to/4eHwhc4'
      },
      {
        name: 'Wonder Care Silicone Toe Separators',
        description: 'Soft silicone separators that gently divide toes to reduce bunion pain.',
        bestFor: 'Friction reduction and toe spacing.',
        link: 'https://amzn.to/4cKDWDM'
      },
      {
        name: 'Gel Big toe Bunion Guard',
        description: 'Protective gel guard that shields the bunion from shoe pressure and rubbing.',
        bestFor: 'External protection and immediate relief.',
        link: 'https://amzn.to/4sZinpg'
      },
      {
        name: 'Zebrooc Bunions Gel Toe Separators',
        description: 'Multi-functional gel separators for bunion relief and toe stretching.',
        bestFor: 'Comprehensive toe care.',
        link: 'https://amzn.to/4tCJZ4I'
      },
      {
        name: 'BowieMall Toe Hallux Valgus',
        description: 'Supportive brace for managing hallux valgus and improving toe posture.',
        bestFor: 'Toe alignment and joint support.',
        link: 'https://amzn.to/4sXa2m3'
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
        name: 'Kitcoz Foot Cream Roll on',
        description: 'Convenient roll-on foot cream specifically formulated for intensive moisturizing of diabetic feet.',
        bestFor: 'Moisturizing and skin integrity maintenance.',
        link: 'https://amzn.to/4mSq9zN'
      },
      {
        name: 'BraceAbility Neuropathy Sock',
        description: 'Specialized socks designed to provide comfort and protection for feet affected by neuropathy.',
        bestFor: 'Neuropathy symptoms and foot protection.',
        link: 'https://amzn.to/4mSVlz0'
      },
      {
        name: 'Fixderma Foobetik Cream',
        description: 'Expertly formulated cream for diabetic foot care, preventing dryness and infection.',
        bestFor: 'Comprehensive diabetic foot skin health.',
        link: 'https://amzn.to/4cNsg3o'
      },
      {
        name: 'ortho joy extra soft slippers',
        description: 'Ultra-soft therapeutic slippers providing superior cushioning for sensitive diabetic feet.',
        bestFor: 'Indoor comfort and pressure reduction.',
        link: 'https://amzn.to/41Z8cGe'
      },
      {
        name: 'Doctorhealth soft Men\'s massage flip flop',
        description: 'Soft and comfortable flip flops with massage points to stimulate circulation.',
        bestFor: 'Lightweight summer wear and circulation support.',
        link: 'https://amzn.to/4twZfQu'
      },
      {
        name: 'DOCTOR EXTRA SOFT Men\'s Sports Shoes',
        description: 'Cushioned sports shoes designed specifically for those needing extra soft footbeds.',
        bestFor: 'Active lifestyle and impact protection.',
        link: 'https://amzn.to/3OCx4R9'
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
        name: 'Powerstep UltraFlexx Foot Rocker',
        description: 'Ergonomic foot rocker that helps stretch the Achilles tendon and calf muscles effectively.',
        bestFor: 'Tendon stretching and flexibility.',
        link: 'https://amzn.to/3ODWFsW'
      },
      {
        name: 'FOVERA Foot & Calf Stretcher Belt',
        description: 'Designed for safe and controlled stretching of the lower leg muscles and Achilles tendon.',
        bestFor: 'Relieving tendon tightness.',
        link: 'https://amzn.to/4cuNSCK'
      },
      {
        name: 'Sorgen Ankle support for pain relief',
        description: 'Compression ankle sleeve providing stability and relief for Achilles pain.',
        bestFor: 'Stability and inflammation reduction.',
        link: 'https://amzn.to/4cwfpnl'
      },
      {
        name: 'Adjustable Orthopedic Heel Lift',
        description: 'Customizable heel lifts to reduce tension on the Achilles tendon during daily activities.',
        bestFor: 'Immediate strain reduction.',
        link: 'https://amzn.to/3QqI2d3'
      },
      {
        name: 'Dr.Ortho Pain Relief Gel Insoles',
        description: 'Soft gel insoles that absorb shock and provide comfort to the heel area.',
        bestFor: 'Shock absorption and daily comfort.',
        link: 'https://amzn.to/4eI1BYf'
      },
      {
        name: 'Aegon Foot Stretcher Strap',
        description: 'Versatile strap for deep and effective stretching of the foot and Achilles.',
        bestFor: 'Intensive stretching sessions.',
        link: 'https://amzn.to/41QcPm1'
      },
      {
        name: 'Achilles Heel Compression Padded Sleeve Socks',
        description: 'Padded compression socks that target the Achilles area for maximum support.',
        bestFor: 'Dedicated tendon compression and protection.',
        link: 'https://amzn.to/4u7bnYr'
      }
    ],
    painType: ['Heel Pain', 'Aching'],
    affectedArea: ['Heel', 'Ankle']
  },
  {
    id: 'dry-cracked-heels',
    title: 'Dry & Cracked Heels',
    shortDesc: 'Hard, thick, and cracked skin around the heel area.',
    fullDesc: 'Cracked heels (heel fissures) occur when the skin on the bottom, outer edge of the heel becomes hard, dry, and flaky. This can be painful if the cracks deepen.',
    whatIsIt: 'A common condition where the skin around the rim of the heel becomes thickened (callus) and eventually splits under pressure.',
    causes: [
      'Prolonged standing on hard floors',
      'Wearing open-backed shoes or sandals',
      'Lack of moisture in the skin',
      'Cold, dry weather',
      'Using harsh soaps or long, hot showers'
    ],
    symptoms: [
      { name: 'Thickened, hard skin (callus)', description: 'Yellowish or dark skin patches around the heel edge that feel rough.' },
      { name: 'Visible cracks or fissures', description: 'Splits in the skin that can range from fine lines to deep, painful cracks.' },
      { name: 'Itchy or flaky skin', description: 'The skin feels very dry and may flake off during movement.' },
      { name: 'Pain while walking', description: 'Deep cracks that reach the sensitive layers of the skin, potentially leading to bleeding.' }
    ],
    diySupport: [
      'Apply urea-based heel balms twice daily',
      'Soak feet in lukewarm water for 15-20 minutes',
      'Gently use a pumice stone on callused areas',
      'Wear moisturizing heel socks overnight',
      'Stay hydrated to maintain skin elasticity'
    ],
    products: [
      {
        name: 'Bodywise Urea Foot Cream Roll',
        description: 'Easy-to-apply roll-on with urea to soften thick skin and repair deep cracks.',
        bestFor: 'Convenient application and intensive repair.',
        link: 'https://amzn.to/3OMQ5jH'
      },
      {
        name: 'Foottex Cracked Heel Cream',
        description: 'Potent formula designed to heal dry and cracked heels effectively.',
        bestFor: 'Deeply moisturizing severe fissures.',
        link: 'https://amzn.to/4sZoQAp'
      },
      {
        name: 'Fixderma Footbetik Cream',
        description: 'Dermatologist-recommended cream for intensive hydration and skin repair.',
        bestFor: 'Ultra-dry skin and persistent cracking.',
        link: 'https://amzn.to/4cNsg3o'
      },
      {
        name: 'Tifanso Moisturizing Heel Socks',
        description: 'Gel-lined socks that lock in moisture and soften hard heels while you sleep.',
        bestFor: 'Overnight intensive treatment.',
        link: 'https://amzn.to/4t1fFQ9'
      },
      {
        name: 'Krack Heel Repair Cream',
        description: 'A classic and trusted solution for soothing and healing cracked skin.',
        bestFor: 'Quick relief and budget-friendly care.',
        link: 'https://amzn.to/4mN00lQ'
      }
    ],
    painType: ['Sharp Pain', 'Itching', 'Soreness'],
    affectedArea: ['Heel']
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
    { name: 'Analysis', href: '#quiz' },
    { name: 'Myths', href: '#myth-busters' },
    { name: 'Conditions', href: '#explore' },
    { name: 'Framework', href: '#compare' },
    ...(user ? [{ name: 'Journal', href: '#journal' }] : []),
    { name: 'About', href: '#about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${isScrolled ? 'py-4' : 'py-6 md:py-8'}`}>
      <div className={`absolute inset-0 transition-opacity duration-700 ${isScrolled ? 'opacity-100' : 'opacity-0'} bg-white/80 backdrop-blur-2xl border-b border-brand-brown/5 shadow-luxury`} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex items-center justify-between">
        <a href="#home" className="group">
          <Logo isScrolled={isScrolled} />
        </a>

        <div className="hidden lg:flex items-center gap-1 p-1 bg-brand-brown/5 rounded-full backdrop-blur-xl border border-brand-brown/5 shadow-soft">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              className="px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-taupe hover:text-brand-brown hover:bg-white transition-all duration-500"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <button 
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-3 px-6 py-3 bg-brand-brown text-brand-beige rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-brand-orange transition-all shadow-xl active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          ) : (
            <button 
              onClick={handleLogin}
              className="hidden sm:flex items-center gap-3 px-6 py-3 bg-brand-orange text-white rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-brand-brown transition-all shadow-xl shadow-brand-orange/20 active:scale-95"
            >
              <UserIcon className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
              Access
            </button>
          )}

          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-4 bg-brand-brown text-brand-beige rounded-2xl hover:bg-brand-orange transition-all lg:hidden shadow-xl"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Shopify Editions Style */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-brand-brown text-brand-beige lg:hidden"
          >
            <div className="absolute top-0 right-0 p-10">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="h-full flex flex-col justify-center px-12 pb-20 overflow-y-auto">
              <div className="mb-16 mt-20">
                <Logo className="invert brightness-200" />
              </div>
              
              <div className="space-y-6">
                {navLinks.map((link, i) => (
                  <motion.a
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-5xl sm:text-7xl font-display font-bold tracking-tighter hover:text-brand-orange transition-colors"
                  >
                    {link.name}<span className="text-brand-orange">.</span>
                  </motion.a>
                ))}
              </div>

              <div className="mt-20 pt-12 border-t border-white/5 flex flex-col gap-8">
                {user ? (
                   <div className="flex items-center gap-4">
                     {user.photoURL ? (
                       <img src={user.photoURL} className="w-12 h-12 rounded-2xl" referrerPolicy="no-referrer" alt="" />
                     ) : (
                       <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                         <UserIcon className="w-6 h-6" />
                       </div>
                     )}
                     <div className="flex flex-col">
                       <span className="text-xs font-bold text-white">{user.displayName}</span>
                       <button onClick={handleLogout} className="text-[10px] uppercase tracking-widest text-brand-orange text-left">Logout Session</button>
                     </div>
                   </div>
                ) : (
                  <button 
                    onClick={handleLogin}
                    className="w-full py-6 bg-brand-orange text-white rounded-3xl font-display font-bold text-xl shadow-2xl active:scale-95"
                  >
                    Specialist Access
                  </button>
                )}
                <div className="flex items-center gap-6 opacity-40">
                  <Instagram className="w-6 h-6" />
                  <Twitter className="w-6 h-6" />
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-[0.4em]">MMXXIV Edition</span>
                </div>
              </div>
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
      whileHover={{ 
        y: -16, 
        rotateX: -2,
        rotateY: 2,
        boxShadow: "0 50px 100px -20px rgba(45, 36, 30, 0.2)" 
      }}
      className={`group relative overflow-hidden bg-white p-12 rounded-[4rem] border-2 transition-all duration-700 flex flex-col h-full ${
        isComparing ? 'border-brand-orange shadow-luxury' : 'border-brand-brown/5 shadow-soft hover:border-brand-orange/20'
      } perspective-1000`}
    >
      {/* Index Number - Editorial Detail */}
      <div className="absolute top-12 right-12 text-6xl font-display font-black text-brand-brown/5 group-hover:text-brand-orange/10 transition-colors duration-700 select-none">
        0{condition.id}
      </div>

      <div className="flex items-center gap-6 mb-10 relative z-10">
        <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-all duration-700 ${
          isComparing ? 'bg-brand-orange text-white scale-110' : 'bg-brand-beige text-brand-orange group-hover:bg-brand-orange group-hover:text-white group-hover:rotate-12 group-hover:scale-110'
        } shadow-lg`}>
          <Activity className="w-8 h-8" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-orange mb-3 group-hover:tracking-[0.6em] transition-all">Clinical Profile</span>
        <h3 className="text-4xl md:text-5xl font-display font-bold text-brand-brown leading-[0.95] tracking-[-0.03em] mb-8 group-hover:text-brand-orange transition-colors">
          {condition.title}
        </h3>

        <p className="text-lg text-brand-taupe/70 leading-relaxed font-light mb-12 border-l-2 border-brand-orange/20 pl-6 group-hover:border-brand-orange transition-colors">
          {condition.shortDesc}
        </p>
        
        <div className="mt-auto flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={onToggleCompare}
              className={`flex items-center justify-center gap-3 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${
                isComparing 
                  ? 'bg-brand-orange text-white shadow-lg' 
                  : 'bg-brand-beige text-brand-taupe hover:bg-brand-brown hover:text-white'
              }`}
            >
              {isComparing ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {isComparing ? 'Selected' : 'Compare'}
            </button>
            
            <button 
              onClick={onQuickView}
              className="flex items-center justify-center py-5 bg-brand-beige text-brand-taupe rounded-2xl hover:bg-brand-gold hover:text-white transition-all shadow-sm"
              title="Quick Analytics"
            >
              <BookOpen className="w-5 h-5" />
            </button>
          </div>
          
          <button 
            onClick={onLearnMore}
            className="group/btn relative overflow-hidden bg-brand-brown text-brand-beige py-6 rounded-2xl text-[12px] font-bold uppercase tracking-[0.4em] shadow-xl hover:shadow-brand-orange/30 transition-all active:scale-95 text-center flex items-center justify-center gap-3"
          >
            <div className="absolute inset-0 bg-brand-orange translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10">Full Protocol</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-2 transition-transform" />
          </button>
        </div>
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

        {/* Full-width Header */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-12 bg-brand-orange" />
            <span className="text-brand-orange font-bold uppercase tracking-[0.25em] text-[10px]">Clinical Protocol Profile</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-display font-bold text-brand-brown mb-8 leading-tight tracking-tight">
            {condition.title}
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed text-brand-taupe/70 font-light max-w-4xl">
            {condition.fullDesc}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* Main Content Area - Products (8 columns) */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-display font-bold text-brand-brown">Curated Relief Gear</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {condition.products.map((product, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-brand-brown/5 shadow-soft hover:shadow-luxury hover:-translate-y-1 transition-all duration-500 group flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-brand-beige/50 flex items-center justify-center text-brand-brown font-bold text-xs uppercase tracking-widest">
                      Item 0{i + 1}
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-display font-bold text-brand-brown mb-3 group-hover:text-brand-orange transition-colors">{product.name}</h4>
                  <p className="text-sm text-brand-taupe/70 mb-10 leading-relaxed flex-grow">{product.description}</p>
                  
                  <div className="mt-auto space-y-8">
                    <ProductRating productId={product.name} conditionId={condition.id} user={user} />
                    <a 
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-brand-brown text-white py-6 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-brand-orange transition-all flex items-center justify-center gap-4 group/btn shadow-lg"
                    >
                      Amazon Protocol Hub <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Support Section */}
            <div className="mt-16 bg-brand-brown p-12 rounded-[3.5rem] text-brand-beige shadow-luxury relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/10 rounded-full -mr-[300px] -mt-[300px] blur-[140px]" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center mb-8">
                  <HelpCircle className="w-8 h-8 text-brand-orange" />
                </div>
                <h3 className="text-4xl font-display font-bold mb-6">Need more clarity?</h3>
                <p className="text-lg opacity-70 mb-10 leading-relaxed font-light max-w-2xl">If these interventions don't yield results within 14 days, a clinical consultation is advised. Revisit our framework for next steps.</p>
                <div className="flex flex-wrap gap-6">
                  <a href="#framework" className="bg-brand-orange text-white px-10 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-white hover:text-brand-orange transition-all shadow-xl shadow-brand-orange/20">
                    Explore Framework
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Science & Information (4 columns) */}
          <div className="lg:col-span-4 order-1 lg:order-2" ref={contentRef}>
            <div className="sticky top-32 space-y-10">
              <div className="bg-white p-8 rounded-[2.5rem] border border-brand-brown/5 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">{currentSection}</span>
                  <span className="text-[10px] font-bold text-brand-taupe/40 font-mono italic">{percent}% read</span>
                </div>
                <div className="h-1.5 w-full bg-brand-brown/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-brand-orange origin-left rounded-full"
                    style={{ scaleX: scrollYProgress }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <section className="bg-white p-10 rounded-[3rem] border border-brand-brown/5 shadow-soft">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                      <Info className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-display font-bold text-brand-brown">Diagnosis</h2>
                  </div>
                  <p className="text-sm text-brand-taupe/80 leading-relaxed mb-8 font-light italic opacity-80 border-l-2 border-brand-orange/20 pl-6">
                    {condition.whatIsIt}
                  </p>
                  
                  <div className="pt-8 border-t border-brand-brown/5">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-orange mb-6">Pathology Roots</h4>
                    <ul className="space-y-4">
                      {condition.causes.map((cause, i) => (
                        <li key={i} className="text-[12px] flex items-start gap-4 text-brand-taupe leading-snug">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-1.5 opacity-40 shrink-0" />
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                  <section className="bg-brand-beige/30 p-10 rounded-[3rem] border border-brand-brown/5">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                        <Activity className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl font-display font-bold text-brand-brown">Clinical Signs</h2>
                    </div>
                    <ul className="space-y-4">
                      {condition.symptoms.map((symptom, i) => (
                        <SymptomItem key={i} symptom={symptom} />
                      ))}
                    </ul>
                  </section>

                <section className="bg-brand-brown text-brand-beige p-10 rounded-[3rem]">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-orange mb-8 underline decoration-brand-orange/30 underline-offset-8">Bio-Hacking Steps</h3>
                  <div className="space-y-4">
                    {condition.diySupport.map((tip, i) => (
                      <div key={i} className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl">
                        <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0" />
                        <span className="text-[12px] font-light leading-relaxed">{tip}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="p-8 text-center bg-brand-beige/20 rounded-[2.5rem]">
                  <p className="text-[10px] text-brand-taupe/50 leading-relaxed">
                    Comfoot earns from qualifying purchases. This supports our independent clinical research.
                  </p>
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
        className="bg-brand-beige w-full max-w-6xl max-h-[92vh] overflow-y-auto md:overflow-hidden rounded-[2.5rem] shadow-2xl relative flex flex-col md:flex-row border border-white/20 focus:outline-none"
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
        <div className="flex-1 md:overflow-y-auto p-8 md:p-14 bg-white/40 custom-scrollbar">
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
        <div className="w-full md:w-[420px] bg-brand-beige p-8 md:p-10 md:overflow-y-auto border-l border-brand-brown/5 custom-scrollbar">
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
      {[...Array(6)].map((_, i) => (
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
    [0, 0.06, 0.06, 0]
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

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`skeleton ${className}`} />
);

const LoadingScreen = () => (
  <motion.div 
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    className="fixed inset-0 z-[200] bg-brand-beige flex flex-col items-center justify-center"
  >
    <div className="relative mb-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-40 h-40 bg-brand-brown rounded-[3rem] flex items-center justify-center shadow-luxury"
      >
        <Footprints className="w-20 h-20 text-brand-orange" />
      </motion.div>
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-brand-orange/30 blur-3xl rounded-full -z-10"
      />
    </div>
    
    <div className="overflow-hidden flex flex-col items-center">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <h2 className="text-4xl font-display font-black text-brand-brown tracking-tighter">
          COM<span className="text-brand-orange">FOOT</span>
        </h2>
      </motion.div>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
        className="h-0.5 bg-brand-brown/10 mt-4 rounded-full relative overflow-hidden w-48"
      >
        <motion.div 
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-brand-orange w-1/2"
        />
      </motion.div>
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.2 }}
        className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-brown mt-6"
      >
        where comfort meets your Soul
      </motion.span>
    </div>
  </motion.div>
);

const LazyImage = ({ src, alt, className, imgClassName }: { src: string; alt: string; className?: string; imgClassName?: string }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && <Skeleton className="absolute inset-0 z-10" />}
      <img
        src={src}
        alt={alt}
        className={`${imgClassName || 'w-full h-full object-cover'} transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </div>
  );
};

const WalkingFeet = ({ className }: { className?: string }) => {
  return (
    <div className={`flex gap-16 ${className}`}>
      <motion.div
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Footprints className="w-12 h-12 text-brand-orange/20" />
      </motion.div>
      <motion.div
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      >
        <Footprints className="w-12 h-12 text-brand-orange/20" />
      </motion.div>
    </div>
  );
};

const ViewSkeleton = () => (
  <div className="min-h-screen pt-32 section-padding space-y-12">
    <div className="flex flex-col md:flex-row gap-12 items-center">
      <div className="flex-1 space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-14 w-40 rounded-full" />
          <Skeleton className="h-14 w-40 rounded-full" />
        </div>
      </div>
      <div className="flex-1 w-full">
        <Skeleton className="aspect-square md:aspect-video rounded-[3rem]" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-64" />
      ))}
    </div>
  </div>
);

const HeroVisual = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto px-4 perspective-1000 mt-12 lg:mt-0">
      <div className="relative group">
        {/* Main Editorial Image */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.4 }}
          className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border border-white/40 z-20"
        >
          <LazyImage 
            src="https://images.unsplash.com/photo-1549057446-9f5c6ac91a04?auto=format&fit=crop&q=80&w=1200" 
            alt="Editorial Foot Health"
            imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/40 to-transparent" />
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 md:w-8 h-px bg-brand-orange" />
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em]">Our Philosophy</span>
            </div>
            <h3 className="text-xl md:text-2xl font-display font-medium">Where Comfort meets your soul.</h3>
          </motion.div>
        </motion.div>

        {/* Walking Feet Animation Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none opacity-10">
          <WalkingFeet />
        </div>

        {/* Supporting Images / Decorative Cards - Simplified */}
        <motion.div
          initial={{ opacity: 0, x: 20, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="absolute -bottom-6 -right-6 w-32 h-44 md:w-40 md:h-56 rounded-[1.5rem] overflow-hidden shadow-2xl border-2 border-white z-30 hidden sm:block"
        >
          <LazyImage 
            src="https://images.unsplash.com/photo-1560343060-c140a58e920c?auto=format&fit=crop&q=80&w=800" 
            alt="Product Detail"
          />
        </motion.div>

        {/* Floaters - Simplified */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -right-10 z-40 bg-white/60 backdrop-blur-xl p-3 rounded-2xl border border-white/60 shadow-xl hidden lg:block"
        >
          <ShieldCheck className="w-6 h-6 text-brand-orange mb-1" />
          <div className="text-[8px] font-bold uppercase tracking-widest text-brand-brown">Certified</div>
        </motion.div>
      </div>

      <div className="absolute -bottom-12 left-1/4 z-40 bg-brand-brown text-white px-8 py-5 rounded-[2rem] shadow-2xl border border-white/10 hidden md:flex items-center gap-4">
        <div className="flex -space-x-3">
          {[1,2,3].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-brown bg-brand-orange/20 flex items-center justify-center overflow-hidden">
               <LazyImage src={`https://i.pravatar.cc/100?u=${i}`} alt={`User ${i}`} />
            </div>
          ))}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold leading-none tracking-tight">PRACTITIONER CURATED</span>
          <span className="text-[9px] opacity-60 uppercase tracking-widest mt-1">Science-First Approach</span>
        </div>
      </div>
    </div>
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

const revealVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [view, setView] = useState<'home' | 'detail'>('home');
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

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

  // Prevent scroll ONLY when modal or comparison is open (not in detail view)
  useEffect(() => {
    if ((selectedCondition && view === 'home') || showComparison) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedCondition, showComparison, view]);

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
    <div className="min-h-screen relative overflow-x-hidden bg-brand-beige/50 font-sans">
      <AnimatePresence mode="wait">
        {isInitialLoading && <LoadingScreen />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {loading && !isInitialLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-beige/80 backdrop-blur-sm flex items-center justify-center"
          >
            <ViewSkeleton />
          </motion.div>
        )}
      </AnimatePresence>
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
      <header id="home" className="relative min-h-screen flex items-center justify-center bg-brand-beige/50 overflow-hidden pt-20">
        {/* Designer Background Elements - More Dynamic */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-brand-orange/10 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, -70, 0],
              y: [0, 40, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-5%] w-[70%] h-[70%] bg-brand-gold/10 rounded-full blur-[150px]" 
          />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] bg-brand-brown/5 rounded-full blur-[100px]" />
        </div>
 
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid lg:grid-cols-2 gap-20 lg:gap-32 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="inline-flex items-center gap-3 px-6 py-2 bg-brand-brown text-brand-beige rounded-full text-[10px] font-bold uppercase tracking-[0.4em] mb-8 md:mb-12 border border-white/10"
            >
              Walking Reinvisioned • 2026
            </motion.div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-8 leading-[1] tracking-[-0.04em] font-display font-black text-brand-brown">
              WALKING <br />
              <span className="text-brand-orange inline-block italic font-bold">REINVISIONED<span className="text-brand-brown">.</span></span>
            </h1>
            
            <p className="text-base md:text-lg lg:text-xl mb-10 text-brand-taupe/60 leading-relaxed max-w-lg mx-auto lg:mx-0 tracking-tight font-light">
              Science-first diagnostics for the urban explorer. Specialized care for heel pain, flat feet, and diabetic health.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 w-full sm:w-auto">
              <motion.a
                whileHover={{ scale: 1.02, backgroundColor: "#2D241E" }}
                whileTap={{ scale: 0.98 }}
                href="#quiz"
                className="w-full sm:w-auto px-12 py-6 bg-brand-orange text-white rounded-2xl text-[12px] font-bold uppercase tracking-[0.4em] shadow-xl shadow-brand-orange/20 transition-all text-center"
              >
                Start Analysis
              </motion.a>
              <motion.a 
                whileHover={{ x: 5 }}
                href="#about"
                className="group flex items-center gap-3 text-brand-brown font-bold text-[10px] uppercase tracking-[0.2em]"
              >
                Our Philosophy
                <div className="w-10 h-10 rounded-full border border-brand-brown/10 flex items-center justify-center group-hover:bg-brand-brown group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.a>
            </div>
          </motion.div>

          {/* New Interactive Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            className="relative lg:block"
          >
            <HeroVisual />
            
            {/* Background elements for depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10">
              <div className="absolute inset-0 bg-brand-gold/5 blur-[100px] rounded-full animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* Floating Particles for more activity */}
        <FloatingParticles />

        {/* Soulful floating tag */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 2 }}
          className="absolute left-12 bottom-12 hidden lg:flex flex-col gap-1 items-start"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-brand-orange/40">Established MMXXIV</span>
          <span className="text-sm font-display font-medium text-brand-brown/60 italic tracking-tight">"Where Comfort meets your soul."</span>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <div className="w-px h-16 bg-gradient-to-b from-brand-orange to-transparent" />
          <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-brand-taupe/40 [writing-mode:vertical-rl] rotate-180">Scroll</span>
        </motion.div>
      </header>

      {/* Why Comfoot - Bento Grid Section */}
      <section className="py-40 bg-brand-beige/50 relative overflow-hidden">
        <div className="section-padding relative z-10">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Featured Mission Bento - 2026 Style */}
            <div className="lg:col-span-8 bg-brand-brown text-brand-beige p-12 md:p-24 rounded-[4rem] flex flex-col justify-between relative overflow-hidden group shadow-luxury min-h-[600px]">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/10 rounded-full -mr-[300px] -mt-[300px] blur-[140px] group-hover:scale-125 transition-transform duration-1000" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-12 border border-white/10 italic text-white/40">
                  Mission Statement • Edition 2.6
                </div>
                <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-[1] tracking-[-0.04em]">
                  Where Comfort <br />
                  <span className="text-brand-orange italic font-light drop-shadow-2xl">meets your soul.</span>
                </h2>
                <p className="text-lg md:text-xl opacity-60 max-w-xl leading-relaxed font-light font-sans mt-6">
                  We combine clinical precision with soulful lifestyle integration to help you reclaim every step in India's unique urban terrain.
                </p>
              </div>
              
              <div className="mt-16 flex flex-wrap gap-12 relative z-10">
                <div className="flex flex-col gap-2">
                  <span className="text-4xl font-display font-bold text-brand-orange">1.2M+</span>
                  <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold">Steps Analyzed</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-4xl font-display font-bold text-brand-gold">500+</span>
                  <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold">Clinical Patterns</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-4xl font-display font-bold text-white">150+</span>
                  <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold">Product Updates</span>
                </div>
              </div>
            </div>

            {/* Side Column - Editorial Accents (Shopify 2026 Style) */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              <motion.div 
                whileHover={{ y: -10, boxShadow: "0 40px 80px -15px rgba(216, 116, 42, 0.15)" }}
                className="flex-1 bg-brand-orange text-white p-12 rounded-[4rem] group relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-luxury transition-all duration-500"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative z-10">
                  <div className="p-4 bg-white/20 rounded-2xl w-fit mb-12 backdrop-blur-md">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-4xl font-display font-bold leading-[1] mb-6 tracking-[-0.03em]">Clinical <br />Foundation.</h3>
                  <p className="text-white/80 font-light leading-relaxed text-sm">
                    Every data point is validated against certified orthopedics and global kinetic standards.
                  </p>
                </div>
                <div className="relative z-10 text-[9px] uppercase font-bold tracking-[0.4em] opacity-40">Standard 2.6 Verified</div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -10, boxShadow: "0 40px 80px -15px rgba(232, 165, 82, 0.15)" }}
                className="flex-1 bg-brand-gold text-white p-12 rounded-[4rem] group relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-luxury transition-all duration-500"
              >
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative z-10">
                  <div className="p-4 bg-white/20 rounded-2xl w-fit mb-12 backdrop-blur-md">
                    <Zap className="w-8 h-8" />
                  </div>
                  <h3 className="text-4xl font-display font-bold leading-[1] mb-6 tracking-[-0.03em]">Rapid <br />Intervention.</h3>
                  <p className="text-white/80 font-light leading-relaxed text-sm">
                    Direct access to immediate DIY protocols for acute plantar and heel discomfort.
                  </p>
                </div>
                <div className="relative z-10 text-[9px] uppercase font-bold tracking-[0.4em] opacity-40 italic">Active Recovery</div>
              </motion.div>
            </div>

            <div className="lg:col-span-12 bg-white p-12 md:p-24 rounded-[4rem] border border-brand-brown/5 shadow-soft flex flex-col lg:flex-row gap-20 items-center group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-brand-beige rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
               <div className="flex-1 relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-12 h-px bg-brand-orange" />
                  <span className="text-brand-orange font-bold uppercase tracking-[0.3em] text-[10px]">Curated Gear</span>
                </div>
                <h3 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-bold text-brand-brown mb-8 leading-[1] tracking-tighter">
                  Handpicked <br />Science-First <span className="text-brand-gold italic font-medium">Solutions.</span>
                </h3>
                <p className="text-lg md:text-xl text-brand-taupe/60 leading-relaxed font-light max-w-2xl mb-12">
                  We meticulously research every footcare product in the Indian market to bring you only the most effective tools.
                </p>
                <div className="flex flex-wrap gap-4">
                  {['Custom Insoles', 'Electric Massagers', 'Compression Sleeves', 'Arch Supports'].map(tag => (
                    <span key={tag} className="px-8 py-4 bg-brand-beige rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] text-brand-brown border border-brand-brown/5 hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-96 aspect-square bg-brand-beige rounded-[3.5rem] flex items-center justify-center relative group overflow-hidden border border-brand-brown/5 shadow-inner">
                <div className="absolute inset-0 bg-brand-orange/5 group-hover:bg-brand-orange/10 transition-all duration-700" />
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  <ExternalLink className="w-24 h-24 text-brand-orange group-hover:scale-110 transition-transform duration-700" />
                </motion.div>
                <div className="absolute bottom-10 inset-x-0 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-taupe/40">Marketplace Portal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MythBusters />

      <FootProblemQuiz />

      {user && <FootJournal />}
      
      {/* Testimonials Section */}
      <section className="py-40 bg-brand-brown text-brand-beige relative overflow-hidden">
        <div className="section-padding relative z-10">
        <div className="flex flex-col items-center text-center mb-32">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-px bg-brand-orange" />
              <span className="text-brand-orange font-bold uppercase tracking-[0.6em] text-[10px]">User Stories</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black leading-[1] tracking-[-0.04em] mb-8">
              REAL RELIEF, <br />
              <span className="text-brand-orange italic font-bold">REAL PEOPLE<span className="text-brand-beige">.</span></span>
            </h2>
            <p className="text-base md:text-lg opacity-60 max-w-2xl mx-auto font-light leading-relaxed">Join thousands who have reclaimed their mobility with our structured protocols.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                name: "Anjali Sharma",
                role: "Teacher, New Delhi",
                text: "Standing for 6 hours a day was becoming impossible. The Plantar Fasciitis protocol changed my life in just 3 weeks.",
                condition: "Success Case"
              },
              {
                name: "Vikram Mehta",
                role: "IT Professional, Bangalore",
                text: "I didn't even realize I had flat feet until I took the quiz. The arch support exercises are simple and actually work.",
                condition: "Optimization"
              },
              {
                name: "Dr. Rajesh Iyer",
                role: "Orthopedic Surgeon, Mumbai",
                text: "Comfoot provides accurate, structured information that bridges the gap between clinical advice and lifestyle.",
                condition: "Clinical Verdict"
              }
            ].map((t, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 p-12 rounded-[3.5rem] border border-white/5 flex flex-col gap-10 group"
              >
                <div className="flex gap-1.5 text-brand-orange">
                  {[...Array(5)].map((_, i) => <Zap key={i} className="w-4 h-4 fill-current opacity-40 group-hover:opacity-100 transition-opacity" />)}
                </div>
                <p className="text-3xl leading-tight font-light italic opacity-70 group-hover:opacity-100 transition-opacity">"{t.text}"</p>
                <div className="mt-auto pt-10 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-lg text-brand-beige">{t.name}</h4>
                    <p className="text-[10px] opacity-40 uppercase tracking-[0.4em] mt-1">{t.role}</p>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] px-4 py-2 bg-brand-beige/5 rounded-full border border-white/5">
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
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-px bg-brand-orange" />
                <span className="text-brand-orange font-bold uppercase tracking-[0.6em] text-[10px]">The Diagnostics</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-black text-brand-brown leading-[1] tracking-[-0.04em]">
                CHOOSE <br />
                <span className="text-brand-orange italic font-bold">CONDITION<span className="text-brand-brown">.</span></span>
              </h2>
              <p className="text-base md:text-lg text-brand-taupe/60 mt-6 font-light leading-relaxed max-w-xl">
                Deep-dive clinical analysis on common urban foot issues to find relief that fits your lifestyle.
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
                    custom={idx}
                    variants={revealVariants}
                    initial="hidden"
                    whileInView="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
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

      <section id="compare" className="py-40 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[#FAF9F6]/50 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#2D241E 2px, transparent 2px)', backgroundSize: '80px 80px' }} />
        
        <div className="section-padding relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-brand-gold/10 text-brand-gold rounded-full text-[10px] font-bold uppercase tracking-[0.4em] mb-10 border border-brand-gold/20">
                Decision Framework
              </div>
              <h2 className="text-5xl md:text-8xl font-display font-bold text-brand-brown leading-[0.9] tracking-[-0.05em]">
                Not Sure What <br />
                <span className="text-brand-gold italic font-light lowercase">you need?</span>
              </h2>
            </div>
            <p className="text-xl md:text-2xl text-brand-taupe/60 max-w-md leading-relaxed font-light font-sans">
              A curated navigation through clinical patterns to find your optimal support protocol.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CONDITIONS.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
                viewport={{ once: true }}
                className="group relative bg-[#F9F6F2] p-12 rounded-[4rem] border border-brand-brown/5 hover:border-brand-orange/20 transition-all duration-700 min-h-[450px] flex flex-col justify-between"
              >
                <div className="absolute top-12 right-12 text-5xl font-display font-black text-brand-brown/[0.03] group-hover:text-brand-orange/5 transition-colors">
                  {i + 1}
                </div>
                
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-brand-orange shadow-soft mb-12 group-hover:scale-110 transition-transform">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-display font-bold text-brand-brown mb-4 tracking-tight leading-tight">
                    {c.title}
                  </h3>
                  <p className="text-brand-taupe/60 font-light text-base leading-relaxed line-clamp-2">
                    {c.shortDesc}
                  </p>
                </div>

                <div className="pt-12 border-t border-brand-brown/5">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-orange">Priority Gear</span>
                      <span className="text-base font-medium text-brand-brown">{c.products[0].name}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedCondition(c);
                        setView('detail');
                      }}
                      className="group/select flex items-center justify-between py-6 px-10 bg-brand-brown text-brand-beige rounded-3xl text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-brand-orange transition-all duration-500 shadow-xl"
                    >
                      Protocol
                      <ArrowRight className="w-4 h-4 group-hover/select:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
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
      <footer className="bg-[#FAF9F6] text-brand-taupe pt-40 pb-16 px-6 border-t border-brand-brown/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2D241E 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-20 mb-32">
            <div className="lg:col-span-5">
              <Logo className="mb-12" />
              <p className="text-2xl max-w-sm leading-relaxed text-brand-brown/70 font-light mb-12 tracking-tight">
                Reimagining the future of <span className="text-brand-brown font-medium italic">foot wellness</span> through data, curation, and structured guidance.
              </p>
              <div className="flex items-center gap-6">
                {[Twitter, Linkedin, Instagram, Mail].map((Icon, i) => (
                  <motion.a 
                    key={i}
                    whileHover={{ y: -4, color: "#D8742A" }}
                    href="#" 
                    className="text-brand-taupe/40 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-7 grid md:grid-cols-3 gap-12">
              <div className="flex flex-col gap-8">
                <h4 className="text-brand-brown font-bold uppercase tracking-[0.4em] text-[10px]">Ecosystem</h4>
                <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-brand-taupe/60">
                  <li><a href="#home" className="hover:text-brand-orange transition-colors">Platform Home</a></li>
                  <li><a href="#explore" className="hover:text-brand-orange transition-colors">Diagnostics</a></li>
                  <li><a href="#compare" className="hover:text-brand-orange transition-colors">Comparison Engine</a></li>
                  <li><a href="#about" className="hover:text-brand-orange transition-colors">Our Ethos</a></li>
                </ul>
              </div>

              <div className="flex flex-col gap-8">
                <h4 className="text-brand-brown font-bold uppercase tracking-[0.4em] text-[10px]">Knowledge</h4>
                <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-brand-taupe/60">
                  <li><a href="#" className="hover:text-brand-orange transition-colors">Scientific Journals</a></li>
                  <li><a href="#" className="hover:text-brand-orange transition-colors">Product Studies</a></li>
                  <li><a href="#" className="hover:text-brand-orange transition-colors">Community Forum</a></li>
                  <li><a href="#" className="hover:text-brand-orange transition-colors">Partner Program</a></li>
                </ul>
              </div>

              <div className="flex flex-col gap-8">
                <h4 className="text-brand-brown font-bold uppercase tracking-[0.4em] text-[10px]">The Journal</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-taupe/40 leading-relaxed mb-4">
                  Weekly insights into elite foot health and curated tech.
                </p>
                <form className="relative group" onSubmit={handleNewsletterSubmit}>
                  <input 
                    type="email" 
                    placeholder="PROTOCOL@COMFOOT.IN" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    disabled={newsletterStatus === 'loading'}
                    className="w-full bg-white border-b-2 border-brand-brown/10 py-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-brand-orange transition-colors disabled:opacity-50 placeholder:text-brand-taupe/20 px-4"
                    required
                  />
                  <button 
                    type="submit"
                    disabled={newsletterStatus === 'loading'}
                    className="absolute right-0 bottom-3 text-brand-orange p-2 hover:bg-brand-orange/10 rounded-full transition-all"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <AnimatePresence>
                    {newsletterMessage && (
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-[9px] font-bold uppercase tracking-widest mt-4 ${newsletterStatus === 'success' ? 'text-emerald-600' : 'text-brand-orange'}`}
                      >
                        {newsletterMessage}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-brand-brown/5 gap-8">
            <div className="flex items-center gap-8 text-[9px] font-bold uppercase tracking-[0.4em] text-brand-taupe/40">
              <span>© {new Date().getFullYear()} Comfoot Labs</span>
              <span className="hidden md:block italic">Where Comfort meets your soul</span>
              <button onClick={() => setShowAdmin(true)} className="hover:text-brand-brown transition-colors">Access Console</button>
            </div>
            <div className="flex gap-8 text-[9px] font-bold uppercase tracking-[0.4em] text-brand-taupe/60">
              <a href="#" className="hover:text-brand-orange transition-colors">Privacy Charter</a>
              <a href="#" className="hover:text-brand-orange transition-colors">Usage Terms</a>
              <a href="#" className="hover:text-brand-orange transition-colors">Diagnostics Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
