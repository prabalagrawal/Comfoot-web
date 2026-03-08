import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { 
  AlertCircle, 
  CheckCircle2, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface MythCardProps {
  myth: string;
  fact: string;
  explanation: string;
  source: string;
  index: number;
}

const MythCard: React.FC<MythCardProps> = ({ myth, fact, explanation, source, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      className="perspective-1000 h-[450px] w-full group cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="relative w-full h-full preserve-3d"
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden bg-white rounded-[2rem] border border-brand-brown/5 shadow-soft p-8 md:p-10 flex flex-col justify-center items-center text-center gap-6 group-hover:shadow-xl transition-shadow">
          <div className="p-3 bg-red-50 text-red-500 rounded-2xl group-hover:scale-110 transition-transform duration-500">
            <AlertCircle className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500/80">Common Myth</span>
          <h3 className="text-2xl md:text-3xl font-display font-bold text-brand-brown leading-tight">
            "{myth}"
          </h3>
          <div className="mt-4 flex items-center gap-2 text-brand-orange font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
            Hover to reveal fact <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 backface-hidden bg-brand-brown rounded-[2rem] p-8 md:p-10 flex flex-col justify-center gap-6 text-brand-beige rotate-y-180 relative overflow-hidden">
          {/* Animated Glow Effect */}
          <motion.div 
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-brand-orange/20 rounded-full blur-[80px] pointer-events-none"
          />
          
          <div className="relative z-10 space-y-6">
            {/* Myth Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-red-500/20 text-red-400 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">The Myth</span>
              </div>
              <p className="text-sm text-brand-beige/60 italic leading-tight">
                "{myth}"
              </p>
            </div>

            {/* Fact Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">The Fact</span>
              </div>
              <p className="text-lg font-medium leading-snug">
                {fact}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">Why This Happens</h4>
            <p className="text-brand-beige/70 leading-relaxed font-light text-sm">
              {explanation}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-white/10">
            <BookOpen className="w-3.5 h-3.5 text-brand-beige/40" />
            <span className="text-[10px] text-brand-beige/60 italic">Source: {source}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const MythBusters: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  const myths = [
    {
      myth: "Flat feet are always unhealthy and must be treated.",
      fact: "Many people naturally have flat feet and experience no pain or limitations.",
      explanation: "The structure of the foot arch varies naturally among individuals. Flat feet only become a concern when they cause symptoms such as pain, fatigue, or alignment issues during walking or standing.",
      source: "American Academy of Orthopaedic Surgeons (AAOS)"
    },
    {
      myth: "Heel pain means you just need new shoes.",
      fact: "Heel pain is often related to strain of the plantar fascia.",
      explanation: "The plantar fascia is a thick band of tissue that supports the arch of the foot. Repeated stress, prolonged standing, or tight calf muscles can irritate this tissue and cause pain near the heel, especially during the first steps in the morning.",
      source: "Mayo Clinic – Plantar Fasciitis"
    },
    {
      myth: "If your feet don’t hurt, they are perfectly healthy.",
      fact: "Some foot issues develop gradually and may not cause immediate pain.",
      explanation: "Problems such as overpronation, weak arch muscles, or poor alignment can slowly develop over time and may eventually lead to discomfort in the feet, knees, or ankles.",
      source: "American Podiatric Medical Association (APMA)"
    },
    {
      myth: "All insoles are the same.",
      fact: "Different insoles are designed for different needs.",
      explanation: "Some insoles focus on cushioning, others provide arch support, and some improve foot stability and alignment. The correct insole depends on foot structure and daily activity.",
      source: "American Orthopaedic Foot & Ankle Society (AOFAS)"
    },
    {
      myth: "Standing all day does not affect your feet.",
      fact: "Long periods of standing can increase stress on the feet and cause fatigue.",
      explanation: "The muscles and ligaments of the feet support the entire body weight while standing. Over time, prolonged standing can increase pressure on the heel and arch, leading to fatigue or discomfort.",
      source: "Canadian Centre for Occupational Health and Safety"
    },
    {
      myth: "Flat shoes are always better for foot health.",
      fact: "Shoes without proper support can sometimes increase strain on the foot.",
      explanation: "Supportive footwear helps distribute pressure across the foot and reduces stress on muscles and ligaments during walking and standing.",
      source: "Harvard Health Publishing"
    }
  ];

  return (
    <section id="myth-busters" ref={sectionRef} className="py-24 md:py-32 bg-brand-beige/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-[100px] -mr-48 -mt-48" 
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] -ml-48 -mb-48" 
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-brown/5 text-brand-brown rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-brand-brown/10 hover:bg-brand-brown hover:text-white transition-colors duration-300 cursor-default"
          >
            Education First
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-brand-brown mb-6 hover:tracking-tight transition-all duration-500"
          >
            Foot Health <span className="text-brand-orange">Myth Busters</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-brand-taupe max-w-2xl mx-auto font-light leading-relaxed"
          >
            Many things we hear about feet are not always true. Let’s separate common myths from real facts.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {myths.map((item, index) => (
            <MythCard key={index} {...item} index={index} />
          ))}
        </div>

        {/* CTA Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 md:mt-32 bg-brand-brown rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl group hover:scale-[1.02] transition-transform duration-500"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/10 rounded-full -ml-32 -mb-32 blur-3xl" />
          
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-display font-bold text-brand-beige mb-6">
              Still unsure about your foot health?
            </h3>
            <p className="text-brand-beige/70 mb-10 max-w-xl mx-auto font-light">
              Take our structured assessment to identify potential issues and get personalized recommendations.
            </p>
            <a
              href="#quiz"
              className="inline-flex items-center gap-3 bg-brand-orange text-white px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-brand-orange/90 transition-all shadow-xl hover:shadow-brand-orange/20 active:scale-95"
            >
              Check Your Foot Type <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-[10px] md:text-xs text-brand-taupe/50 max-w-2xl mx-auto leading-relaxed italic">
            The information provided here is for educational purposes and should not replace professional medical advice. If you experience persistent foot pain, consult a qualified healthcare professional.
          </p>
        </div>
      </div>
    </section>
  );
};
