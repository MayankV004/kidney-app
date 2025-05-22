import React from 'react';
import { DietChartGenerator } from '../components/diet/DietChartGenerator';
import { motion } from 'framer-motion';

export const DietChartPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-8 sm:px-6"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">
          Personalized Diet Chart
        </h1>
        <p className="text-neutral-600 mt-1">
          Customize your nutrition targets based on your kidney health needs
        </p>
      </div>

      <DietChartGenerator />
    </motion.div>
  );
};