import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets, ArrowRight, ShieldCheck, Clock, BarChart3, FileText, MousePointerClick, BarChartHorizontal, CheckCircle } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog'; // Import Radix UI Dialog

const WelcomePage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/input');
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
            },
        },
    };

    const GuideStep = ({ icon, title, description }) => (
        <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 mt-1 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
        {icon}
        </div>
        <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="text-sm text-white/70">{description}</p>
        </div>
        </div>
    );

    return (
        <Dialog.Root>
        <div className="min-h-screen w-full aurora-bg flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
        {/* Left Column: Headline and CTA */}
        <div className="text-center lg:text-left">
        <motion.div
        variants={itemVariants}
        className="inline-flex items-center bg-white/10 border border-white/20 rounded-full px-4 py-1 text-sm font-medium text-blue-200"
        >
        Powered by AI & EPA Data
        </motion.div>

        <motion.h1
        variants={itemVariants}
        className="mt-6 text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-white to-blue-300 bg-clip-text text-transparent"
        >
        The Future of Septic Maintenance is Here.
        </motion.h1>

        <motion.p
        variants={itemVariants}
        className="mt-6 text-lg text-blue-100/80 max-w-xl mx-auto lg:mx-0"
        >
        Stop guessing. Get a precise, data-driven schedule for your septic system. Prevent failures, save money, and protect your property with our intelligent estimator.
        </motion.p>

        <motion.div
        variants={itemVariants}
        className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
        >
        <button
        onClick={handleGetStarted}
        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/50 overflow-hidden"
        >
        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shimmer" />
        <span className="relative flex items-center gap-2">
        Start Free Analysis <ArrowRight size={20} />
        </span>
        </button>

        {/* This is the trigger for our new modal */}
        <Dialog.Trigger asChild>
        <button className="px-8 py-4 bg-white/5 text-white/80 font-medium rounded-2xl border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-300">
        Learn More
        </button>
        </Dialog.Trigger>
        </motion.div>
        </div>

        {/* Right Column: Visual Showcase */}
        <motion.div variants={itemVariants} className="relative">
        <div className="relative glass rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/20">
        <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="absolute -top-12 -left-12 w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30"
        >
        <Droplets size={48} className="text-white" />
        </motion.div>

        <h3 className="text-2xl font-semibold text-white mb-6 ml-20">Your Smart Report</h3>

        <motion.ul
        variants={{
            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.6 } }
        }}
        initial="hidden"
        animate="visible"
        className="space-y-5"
        >
        <li className="flex items-start gap-4">
        <div className="w-10 h-10 mt-1 flex-shrink-0 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
        <ShieldCheck className="text-green-400" />
        </div>
        <div>
        <h4 className="font-semibold text-white">Prevent Failures</h4>
        <p className="text-sm text-white/70">Avoid costly backups with precise, AI-powered scheduling.</p>
        </div>
        </li>
        <li className="flex items-start gap-4">
        <div className="w-10 h-10 mt-1 flex-shrink-0 bg-yellow-500/10 rounded-xl flex items-center justify-center border border-yellow-500/20">
        <Clock className="text-yellow-400" />
        </div>
        <div>
        <h4 className="font-semibold text-white">Optimize Costs</h4>
        <p className="text-sm text-white/70">Save money by pumping only when necessary, not on a fixed cycle.</p>
        </div>
        </li>
        <li className="flex items-start gap-4">
        <div className="w-10 h-10 mt-1 flex-shrink-0 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
        <BarChart3 className="text-purple-400" />
        </div>
        <div>
        <h4 className="font-semibold text-white">Gain Insights</h4>
        <p className="text-sm text-white/70">Understand how your usage habits directly impact system health.</p>
        </div>
        </li>
        </motion.ul>
        </div>
        </motion.div>
        </motion.div>
        </div>
        </div>

        {/* Modal Content */}
        <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass rounded-2xl p-8 border border-white/10 shadow-2xl shadow-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
        <Dialog.Title className="text-2xl font-bold text-white">How It Works</Dialog.Title>
        <Dialog.Description className="mt-2 text-white/70">
        Follow these simple steps to get your personalized report.
        </Dialog.Description>

        <div className="mt-6 space-y-5">
        <GuideStep
        icon={<FileText className="text-blue-400" />}
        title="1. Gather System Info"
        description="Find your tank size and household details. Don't worry, estimates are fine!"
        />
        <GuideStep
        icon={<MousePointerClick className="text-purple-400" />}
        title="2. Answer a Few Questions"
        description="Complete the multi-step form about your water usage and system specifics."
        />
        <GuideStep
        icon={<BarChartHorizontal className="text-green-400" />}
        title="3. Get Instant Results"
        description="Our AI analyzes your data against EPA guidelines to calculate your schedule."
        />
        <GuideStep
        icon={<CheckCircle className="text-yellow-400" />}
        title="4. Stay on Track"
        description="Use the report to schedule maintenance and keep your system healthy for years."
        />
        </div>

        <div className="mt-8 flex justify-end">
        <Dialog.Close asChild>
        <button className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
        Got It
        </button>
        </Dialog.Close>
        </div>
        </Dialog.Content>
        </Dialog.Portal>
        </Dialog.Root>
    );
};

export default WelcomePage;
