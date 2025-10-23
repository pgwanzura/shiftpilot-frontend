'use client';

import { FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export interface ValidationCheckIconProps {
  isValidated: boolean;
}

const PULSE_DURATION = 1000;

const ValidationCheckIcon: FC<ValidationCheckIconProps> = ({ isValidated }) => {
  const [hasPulsed, setHasPulsed] = useState(false);

  useEffect(() => {
    if (isValidated && !hasPulsed) {
      const timer = setTimeout(() => setHasPulsed(true), PULSE_DURATION);
      return () => clearTimeout(timer);
    }
    if (!isValidated) setHasPulsed(false);
  }, [isValidated, hasPulsed]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: 45 }}
      animate={
        isValidated
          ? { opacity: 1, scale: 1, rotate: 0 }
          : { opacity: 0, scale: 0.5, rotate: 45 }
      }
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative flex items-center justify-center"
    >
      {/* Light green background circle */}
      <motion.div
        className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center"
        initial={false}
        animate={isValidated ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 0.35 }}
      >
        {/* Green icon */}
        <CheckCircle className="w-4.5 h-4.5 text-green-600" strokeWidth={2.5} />
      </motion.div>

      {/* One-time expanding ring */}
      <AnimatePresence>
        {isValidated && !hasPulsed && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-green-300"
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 1.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ValidationCheckIcon;
