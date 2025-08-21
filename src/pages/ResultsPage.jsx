// src/pages/ResultsPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Calendar, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { calculatePumpingFrequency } from '../logic/calculatePumpingFrequency';
import RiskGauge from '../components/RiskGauge';
import FactorImpactChart from '../components/FactorImpactChart';
// UPDATED: Import the new, robust PDF generator
import { generatePdfReport } from '../utils/pdfGenerator';

const ResultsPage = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    useEffect(() => {
        try {
            const formData = JSON.parse(localStorage.getItem('septicFormData') || '{}');
            if (!formData.tankSize || !formData.householdSize) {
                navigate('/input');
                return;
            }
            const calculatedResults = calculatePumpingFrequency(formData);
            setResults(calculatedResults);
        } catch (error) {
            console.error("Failed to parse form data", error);
            navigate('/input');
        }
    }, [navigate]);

    const handleDownloadPDF = async () => {
        if (!results) return;
        setIsGeneratingPDF(true);
        try {
            // UPDATED: Call the new, reliable function
            await generatePdfReport(results);
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('An error occurred while generating the PDF.');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    if (!results) {
        // ... (Loading spinner code remains the same)
        return (
            <div className="min-h-screen aurora-bg flex items-center justify-center">
            <div className="text-center">
            <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-white/20 border-t-blue-500 rounded-full mx-auto"
            ></motion.div>
            <p className="mt-4 text-white/60">Analyzing your data...</p>
            </div>
            </div>
        );
    }

    const { finalInterval, riskLevel, nextPumpDate } = results;

    const containerVariants = { /* ... */ };
    const itemVariants = { /* ... */ };
    // ... (All JSX and component code remains the same)

    return (
        <div className="min-h-screen aurora-bg py-12 px-4">
        <div className="max-w-6xl mx-auto">
        <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        >
        <button
        onClick={() => navigate('/input')}
        className="flex items-center text-white/60 hover:text-white transition-colors mb-8 p-2 rounded-lg hover:bg-white/5"
        >
        <ArrowLeft size={20} className="mr-2" />
        Recalculate
        </button>
        </motion.div>

        <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-5 gap-6"
        >
        {/* Left Column */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-between text-center">
        <div>
        <h2 className="text-lg font-medium text-blue-300">Recommended Interval</h2>
        <p className="text-7xl font-bold text-white tracking-tighter my-4">{finalInterval.toFixed(1)}</p>
        <p className="text-lg font-medium text-white/80 -mt-2">Years</p>
        </div>
        <RiskGauge interval={finalInterval} />
        {nextPumpDate ? (
            <div className="w-full text-center">
            <div className="flex items-center justify-center text-lg font-medium text-white">
            <Calendar size={18} className="mr-2 text-blue-400" />
            <span>Next pump due: <span className="font-bold">{new Date(nextPumpDate).toLocaleDateString()}</span></span>
            </div>
            <div className={`inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-medium ${riskLevel.bgColor} ${riskLevel.color}`}>
            {riskLevel.level} Risk
            </div>
            </div>
        ) : (
            <div className="text-center text-white/50 text-sm">
            <Info size={16} className="mx-auto mb-1"/>
            Enter the "Last Pumped Date" in the form to see your next estimated due date.
            </div>
        )}
        </motion.div>

        {/* Right Column */}
        <div className="lg:col-span-3 space-y-6">
        <motion.div variants={itemVariants} className="glass rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Calculation Breakdown</h2>
        <FactorImpactChart baseInterval={results.baseInterval} factors={results.factors} finalInterval={finalInterval} />
        </motion.div>

        <motion.div variants={itemVariants} className="glass rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Maintenance Guidance</h2>
        <div className="space-y-4">
        {finalInterval < 2 && (
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20 flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div>
            <h3 className="font-medium text-red-400">High Usage Advisory</h3>
            <p className="text-sm text-white/70 mt-1">Your short interval suggests a high risk of solids buildup. Consider water-efficiency upgrades or reducing garbage disposal use.</p>
            </div>
            </div>
        )}

        {finalInterval > 5 && (
            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 flex items-start gap-3">
            <AlertTriangle size={20} className="text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
            <h3 className="font-medium text-yellow-400">Long Interval Note</h3>
            <p className="text-sm text-white/70 mt-1">Even with long intervals, the EPA recommends a system inspection every 1-3 years to check sludge levels and baffle health.</p>
            </div>
            </div>
        )}

        <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20 flex items-start gap-3">
        <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
        <div>
        <h3 className="font-medium text-green-400">Pro Tip</h3>
        <p className="text-sm text-white/70 mt-1">Conserve water and avoid flushing non-biodegradable items to maximize the life of your drainfield.</p>
        </div>
        </div>
        </div>

        <button
        onClick={handleDownloadPDF}
        disabled={isGeneratingPDF}
        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
        >
        {isGeneratingPDF ? (
            <>
            <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full mr-2"
            ></motion.div>
            Generating Report...
            </>
        ) : (
            <>
            <Download size={18} className="mr-2" />
            Download Full Report
            </>
        )}
        </button>
        </motion.div>
        </div>
        </motion.div>

        <motion.div
        variants={itemVariants}
        className="text-center mt-8 text-sm text-white/50"
        >
        <p><strong>Disclaimer:</strong> This calculator is an estimation tool based on standard guidelines. Always consult a licensed professional and adhere to local regulations.</p>
        </motion.div>
        </div>
        </div>
    );
};

export default ResultsPage;
