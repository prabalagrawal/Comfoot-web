import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Info, X } from 'lucide-react';

interface PainZone {
  id: string;
  name: string;
  title: string;
  description: string;
  tips: string[];
  position: { top: string; left: string };
}

const painZones: PainZone[] = [
  {
    id: 'heel',
    name: 'Heel',
    title: 'Heel Pain Guide',
    description: 'Often caused by Plantar Fasciitis, heel pain is one of the most common foot complaints. It typically feels like a sharp stab in the bottom of your foot.',
    tips: [
      'Use orthotics with deep heel cups',
      'Perform calf and foot stretches daily',
      'Avoid walking barefoot on hard surfaces',
      'Look for shoes with superior shock absorption'
    ],
    position: { top: '75%', left: '48%' }
  },
  {
    id: 'arch',
    name: 'Arch',
    title: 'Flat Feet & Arch Support',
    description: 'Pain in the arch often indicates overpronation or fallen arches. This can lead to fatigue and pain that radiates up to the knees and hips.',
    tips: [
      'Choose shoes with firm arch support',
      'Look for stability or motion control features',
      'Strengthen foot muscles with "towel curls"',
      'Ensure proper shoe width to prevent compression'
    ],
    position: { top: '55%', left: '42%' }
  },
  {
    id: 'ball',
    name: 'Ball of Foot',
    title: 'Metatarsalgia Guide',
    description: 'Pain and inflammation in the ball of your foot can make every step feel like walking on pebbles. It is common in athletes and those wearing ill-fitting shoes.',
    tips: [
      'Use metatarsal pads to redistribute pressure',
      'Choose shoes with a wide toe box',
      'Avoid high heels or narrow-pointed shoes',
      'Opt for maximum forefoot cushioning'
    ],
    position: { top: '30%', left: '50%' }
  },
  {
    id: 'ankle',
    name: 'Ankle',
    title: 'Stability & Support',
    description: 'Ankle pain or instability can lead to frequent sprains. Proper support is crucial for maintaining alignment and preventing long-term joint issues.',
    tips: [
      'Look for high-top or supportive collars',
      'Choose shoes with a firm heel counter',
      'Balance training to improve proprioception',
      'Compression sleeves for mild swelling'
    ],
    position: { top: '85%', left: '65%' }
  }
];

export const FootPainMap: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<PainZone | null>(null);

  return (
    <section id="pain-map" className="section-padding bg-white/50 rounded-3xl my-12">
      <div className="text-center mb-16">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-brand-orange font-semibold tracking-widest uppercase text-sm"
        >
          Interactive Diagnostic
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl mt-4 mb-6"
        >
          Where does it <span className="text-brand-orange italic">hurt?</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-brand-taupe max-w-2xl mx-auto text-lg"
        >
          Click on the areas of the foot below to discover tailored advice and the right support for your specific needs.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Interactive Foot Diagram */}
        <div className="relative aspect-[4/5] max-w-md mx-auto w-full bg-brand-beige/30 rounded-full p-8 flex items-center justify-center overflow-hidden border border-brand-brown/5">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Simple Stylized Foot SVG */}
          <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-2xl">
            <path 
              d="M100,280 C60,280 40,250 40,200 C40,150 60,120 80,100 C90,90 95,70 95,50 C95,30 110,20 120,20 C135,20 150,40 150,70 C150,100 140,130 140,160 C140,200 150,230 150,260 C150,280 130,280 100,280 Z" 
              fill="white" 
              stroke="#5B4A3A" 
              strokeWidth="2"
              className="transition-colors duration-500"
            />
            {/* Toes (Simplified) */}
            <circle cx="120" cy="35" r="15" fill="white" stroke="#5B4A3A" strokeWidth="1.5" />
            <circle cx="145" cy="55" r="10" fill="white" stroke="#5B4A3A" strokeWidth="1.5" />
            <circle cx="155" cy="85" r="8" fill="white" stroke="#5B4A3A" strokeWidth="1.5" />
            <circle cx="158" cy="115" r="7" fill="white" stroke="#5B4A3A" strokeWidth="1.5" />
            <circle cx="155" cy="145" r="6" fill="white" stroke="#5B4A3A" strokeWidth="1.5" />
          </svg>

          {/* Interaction Points */}
          {painZones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              className={`absolute group z-10 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300`}
              style={{ top: zone.position.top, left: zone.position.left }}
            >
              <div className={`relative flex items-center justify-center`}>
                <div className={`absolute w-12 h-12 rounded-full bg-brand-orange/20 animate-ping ${selectedZone?.id === zone.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-300 flex items-center justify-center ${selectedZone?.id === zone.id ? 'bg-brand-orange scale-125' : 'bg-brand-brown group-hover:bg-brand-orange'}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <span className={`absolute left-full ml-3 px-3 py-1 bg-brand-brown text-white text-xs rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl`}>
                  {zone.name}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Guide Content */}
        <div className="min-h-[400px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {selectedZone ? (
              <motion.div
                key={selectedZone.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 md:p-10 rounded-3xl shadow-soft border border-brand-brown/5 relative"
              >
                <button 
                  onClick={() => setSelectedZone(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-brand-beige rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-brand-taupe" />
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center">
                    <Info className="w-6 h-6 text-brand-orange" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display">{selectedZone.title}</h3>
                </div>

                <p className="text-brand-taupe text-lg leading-relaxed mb-8">
                  {selectedZone.description}
                </p>

                <div className="space-y-4">
                  <h4 className="font-semibold text-brand-brown uppercase tracking-wider text-sm">Recommended Care:</h4>
                  <ul className="grid gap-3">
                    {selectedZone.tips.map((tip, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 text-brand-taupe"
                      >
                        <ChevronRight className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-10 w-full py-4 bg-brand-brown text-white rounded-2xl font-semibold hover:bg-brand-orange transition-colors flex items-center justify-center gap-2"
                >
                  Shop Targeted Solutions
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-12 border-2 border-dashed border-brand-brown/10 rounded-3xl flex flex-col items-center justify-center bg-brand-beige/10"
              >
                <div className="w-20 h-20 rounded-full bg-brand-beige flex items-center justify-center mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Info className="w-10 h-10 text-brand-orange/40" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-display text-brand-brown mb-2">Select a pain point</h3>
                <p className="text-brand-taupe">Click the markers on the foot diagram to explore targeted relief guides.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
