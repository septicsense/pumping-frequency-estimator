// src/components/RiskGauge.jsx

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const RiskGauge = ({ interval }) => {
    const data = [
        { name: 'High Risk', value: 33, color: '#ef4444' },      // Red
        { name: 'Moderate Risk', value: 33, color: '#f59e0b' }, // Amber
        { name: 'Low Risk', value: 34, color: '#10b981' },      // Green
    ];

    // Map the interval (e.g., 1 to 10 years) to an angle (0 to 180 degrees)
    const needleValue = Math.max(1, Math.min(10, interval));
    const needleAngle = 180 * ((needleValue - 1) / 9);

    return (
        <div className="relative w-48 h-24">
        <ResponsiveContainer width="100%" height="100%">
        <PieChart>
        <Pie
        data={data}
        cx="50%"
        cy="100%"
        startAngle={180}
        endAngle={0}
        innerRadius={60}
        outerRadius={95}
        paddingAngle={2}
        dataKey="value"
        cornerRadius={5}
        >
        {data.map((entry, index) => (
            <Cell
            key={`cell-${index}`}
            fill={entry.color}
            stroke="none"
            style={{ filter: `brightness(0.8)` }}
            />
        ))}
        </Pie>
        </PieChart>
        </ResponsiveContainer>

        {/* Center circle */}
        <div className="absolute top-full left-1/2 w-6 h-6 bg-slate-700 border-2 border-slate-500 rounded-full transform -translate-x-1/2 -translate-y-4 z-10"></div>

        {/* Needle */}
        <motion.div
        className="absolute bottom-1 left-1/2 w-1 h-24 bg-white rounded-full origin-bottom shadow-md z-20"
        initial={{ rotate: 0 }}
        animate={{ rotate: needleAngle }}
        transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.5 }}
        style={{ transformOrigin: 'bottom center' }}
        ></motion.div>

        {/* Value indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2 text-center">
        <span className="text-3xl font-bold text-white tracking-tight">{interval}</span>
        <span className="text-sm text-white/60 block -mt-1">years</span>
        </div>
        </div>
    );
};

export default RiskGauge;
