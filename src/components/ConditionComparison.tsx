
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  ShieldCheck, 
  ChevronRight,
  ArrowRight,
  Info
} from 'lucide-react';
import { Condition } from '../types';

interface ConditionComparisonProps {
  conditions: Condition[];
  onClose: () => void;
  onSelectCondition: (condition: Condition) => void;
}

export const ConditionComparison: React.FC<ConditionComparisonProps> = ({ 
  conditions, 
  onClose,
  onSelectCondition
}) => {
  if (conditions.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10 bg-brand-brown/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-brand-beige w-full max-w-7xl h-[90vh] overflow-hidden rounded-[3rem] shadow-2xl relative flex flex-col"
      >
        {/* Header */}
        <div className="p-8 md:p-12 border-b border-brand-brown/5 flex justify-between items-center bg-white/50 backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px w-8 bg-brand-orange" />
              <span className="text-brand-orange font-bold uppercase tracking-[0.2em] text-[10px]">Comparison Tool</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-brown">Condition Comparison</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-4 hover:bg-brand-brown/5 rounded-full transition-all group"
          >
            <X className="w-6 h-6 text-brand-taupe group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-8 md:p-12">
          <div className={`grid gap-8 min-w-[800px]`} style={{ gridTemplateColumns: `repeat(${conditions.length}, 1fr)` }}>
            {conditions.map((condition) => (
              <motion.div 
                key={condition.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-10"
              >
                {/* Title & Short Desc */}
                <div className="space-y-4">
                  <div className="bg-brand-orange/10 text-brand-orange w-fit px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {condition.id.replace('-', ' ')}
                  </div>
                  <h3 className="text-3xl font-display font-bold text-brand-brown">{condition.title}</h3>
                  <p className="text-sm text-brand-taupe leading-relaxed font-light">{condition.shortDesc}</p>
                </div>

                {/* Symptoms Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-brand-brown">
                    <AlertCircle className="w-4 h-4 text-brand-orange" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Key Symptoms</h4>
                  </div>
                  <div className="space-y-3">
                    {condition.symptoms.map((symptom, idx) => (
                      <div key={idx} className="bg-white/60 p-4 rounded-2xl border border-brand-brown/5 hover:border-brand-orange/20 transition-all group">
                        <span className="text-xs font-bold text-brand-brown block mb-1 group-hover:text-brand-orange transition-colors">{symptom.name}</span>
                        <p className="text-[10px] text-brand-taupe/70 leading-relaxed">{symptom.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Causes Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-brand-brown">
                    <Zap className="w-4 h-4 text-brand-gold" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Primary Causes</h4>
                  </div>
                  <ul className="space-y-2">
                    {condition.causes.map((cause, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[11px] text-brand-taupe leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 shrink-0" />
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Treatments Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-brand-brown">
                    <ShieldCheck className="w-4 h-4 text-brand-orange" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Recommended Care</h4>
                  </div>
                  <div className="space-y-2">
                    {condition.diySupport.map((tip, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-brand-beige p-3 rounded-xl border border-brand-brown/5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="text-[10px] font-medium text-brand-taupe">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action */}
                <button 
                  onClick={() => onSelectCondition(condition)}
                  className="mt-auto w-full bg-brand-brown text-brand-beige py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-brand-orange transition-all flex items-center justify-center gap-2 group"
                >
                  Full Profile <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-8 bg-brand-brown text-brand-beige/60 text-[10px] font-bold uppercase tracking-widest flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>Comparison based on common clinical presentations</span>
          </div>
          <span>Comfoot Clinical Database v1.2</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
