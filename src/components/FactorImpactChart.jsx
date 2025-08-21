// src/components/FactorImpactChart.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const FactorImpactChart = ({ baseInterval, factors, finalInterval }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    const getImpactColor = (multiplier) => {
        if (multiplier < 1) return 'bg-red-500/80'; // Negative impact (shortens interval)
        if (multiplier > 1) return 'bg-green-500/80'; // Positive impact (lengthens interval)
        return 'bg-gray-500/80'; // Neutral
    };

    return (
        <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
        >
        {/* Base Interval */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
        <div className="w-32 text-right text-sm text-white/70">Base Interval</div>
        <div className="flex-1 flex items-center">
        <div className="h-2 w-full bg-blue-500/50 rounded-full" />
        </div>
        <div className="w-16 text-left font-mono font-bold text-blue-300">{baseInterval.toFixed(1)} yrs</div>
        </motion.div>

        {/* Factors */}
        {factors.map((factor, index) => (
            <motion.div variants={itemVariants} key={index} className="flex items-center gap-4">
            <div className="w-32 text-right text-sm text-white/70 truncate" title={factor.name}>
            {factor.name}
            </div>
            <div className="flex-1 flex items-center">
            <div
            className={`h-2 rounded-full ${getImpactColor(factor.multiplier)}`}
            style={{ width: `${Math.abs(1 - factor.multiplier) * 200}%` }} // Scale factor for visual impact
            />
            {factor.multiplier < 1 ? (
                <ArrowDownRight size={16} className="text-red-400 ml-2 flex-shrink-0" />
            ) : (
                <ArrowUpRight size={16} className="text-green-400 ml-2 flex-shrink-0" />
            )}
            </div>
            <div className={`w-16 text-left font-mono font-semibold ${factor.multiplier < 1 ? 'text-red-400' : 'text-green-400'}`}>
            &times;{factor.multiplier.toFixed(2)}
            </div>
            </motion.div>
        ))}

        {/* Divider */}
        <motion.div variants={itemVariants} className="pt-2">
        <div className="h-px w-full bg-white/10" />
        </motion.div>

        {/* Final Interval */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
        <div className="w-32 text-right font-bold text-white">Final Interval</div>
        <div className="flex-1">
        <div className="h-3 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg" />
        </div>
        <div className="w-16 text-left font-mono text-xl font-bold text-white">{finalInterval.toFixed(1)} yrs</div>
        </motion.div>
        </motion.div>
    );
};

export default FactorImpactChart;
