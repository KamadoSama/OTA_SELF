"use client";

import { useState } from "react";
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left focus:outline-none group"
      >
        <h4 className="text-lg font-medium text-white/80 group-hover:text-white transition-colors">{question}</h4>
        <div className={`ml-4 w-8 h-8 rounded-full glass flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="h-4 w-4 text-white/50 group-hover:text-white" />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
        <p className="text-white/40 leading-relaxed font-medium">
          {answer}
        </p>
      </div>
    </div>
  );
}

export function FAQ() {
  const t = useTranslations();

  return (
    <section className="py-24 px-6 relative z-10 border-t border-white/5">
      <div className="container max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">{t('FAQ.title')}</h2>
          <p className="text-white/40 font-medium text-lg">{t('FAQ.subtitle')}</p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="flex flex-col"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <FAQItem
              question={t('FAQ.q1.q')}
              answer={t('FAQ.q1.a')}
            />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <FAQItem
              question={t('FAQ.q2.q')}
              answer={t('FAQ.q2.a')}
            />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <FAQItem
              question={t('FAQ.q3.q')}
              answer={t('FAQ.q3.a')}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
