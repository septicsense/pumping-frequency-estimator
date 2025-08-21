import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

// --- Reusable Modern Form Components ---

const FloatingLabelInput = ({ id, label, type, value, onChange, placeholder, infoText }) => (
    <div className="relative mb-6">
    <input
    id={id}
    name={id}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder} // This needs to be a real space for the CSS to work
    className="form-input peer"
    required
    />
    <label htmlFor={id} className="form-label">
    {label}
    </label>
    {infoText && <p className="mt-2 text-xs text-white/50">{infoText}</p>}
    </div>
);

const ModernSelect = ({ name, label, value, onChange, options, placeholder, infoText }) => (
    <div className="mb-6">
    <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-1.5">
    {label}
    {infoText && (
        <span title={infoText}>
        <HelpCircle size={14} className="text-white/40" />
        </span>
    )}
    </label>
    <Select.Root value={value} onValueChange={(val) => onChange({ target: { name, value: val } })}>
    <Select.Trigger className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/30 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50">
    <Select.Value placeholder={placeholder} />
    <Select.Icon className="text-white/60">
    <ChevronDown size={18} />
    </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
    <Select.Content position="popper" sideOffset={5} className="w-[--radix-select-trigger-width] glass rounded-xl border border-white/10 shadow-lg z-50 overflow-hidden">
    <Select.ScrollUpButton className="flex items-center justify-center h-6 cursor-default"><ChevronUp /></Select.ScrollUpButton>
    <Select.Viewport className="p-2">
    {options.map(option => (
        <Select.Item
        key={option.value}
        value={option.value}
        className="relative flex items-center px-8 py-2.5 rounded-lg text-sm text-white/80 cursor-pointer outline-none hover:bg-white/10 focus:bg-white/10"
        >
        <Select.ItemText>{option.label}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
        <Check size={16} className="text-blue-400" />
        </Select.ItemIndicator>
        </Select.Item>
    ))}
    </Select.Viewport>
    <Select.ScrollDownButton className="flex items-center justify-center h-6 cursor-default"><ChevronDown /></Select.ScrollDownButton>
    </Select.Content>
    </Select.Portal>
    </Select.Root>
    </div>
);

const NeumorphicToggle = ({ name, label, enabled, setEnabled, infoText }) => (
    <div className="mb-6 flex items-center justify-between">
    <div>
    <label className="block text-sm font-medium text-white/80 flex items-center gap-1.5">
    {label}
    {infoText && (
        <span title={infoText}>
        <HelpCircle size={14} className="text-white/40" />
        </span>
    )}
    </label>
    </div>
    <button
    type="button"
    onClick={() => setEnabled(!enabled)}
    className={`relative w-14 h-8 rounded-full transition-all duration-200 ease-out ${enabled ? 'neumorphic-pressed' : 'neumorphic'}`}
    >
    <span className={`absolute left-1 top-1 w-6 h-6 rounded-full transition-transform duration-200 ease-out ${enabled ? 'transform translate-x-6 bg-blue-500' : 'bg-slate-500'}`} />
    </button>
    </div>
);


const InputForm = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        tankSize: '',
        householdSize: '',
        waterUsage: '',
        garbageDisposal: false,
        laundryFrequency: '',
        laundryHabits: '',
        waterSoftener: false,
        systemType: '',
        soilType: '',
        systemAge: '',
        lastPumped: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('septicFormData', JSON.stringify(formData));
        navigate('/results');
    };

    const sections = ['Core Information', 'Usage Habits', 'System Details', 'Maintenance History'];
    const totalSteps = sections.length;

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
    const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const slideVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    return (
        <div className="min-h-screen w-full aurora-bg py-8 px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
        <div className="flex items-center mb-6">
        <button
        onClick={() => navigate('/')}
        className="flex items-center text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
        >
        <ArrowLeft size={20} className="mr-2" />
        Back to Home
        </button>
        </div>

        <div className="glass rounded-2xl border border-white/10 p-8">
        <form onSubmit={handleSubmit}>
        {/* Stepper / Progress Bar */}
        <div className="mb-8">
        <p className="text-sm text-blue-300 font-medium">Step {currentStep + 1} of {totalSteps}</p>
        <h2 className="text-2xl font-bold text-white mt-1">{sections[currentStep]}</h2>
        <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full">
        <motion.div
        className="h-1.5 bg-blue-500 rounded-full"
        initial={{ width: '0%' }}
        animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
        </div>
        </div>

        {/* Form Sections with Animation */}
        <AnimatePresence mode="wait">
        <motion.div
        key={currentStep}
        variants={slideVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
        >
        {currentStep === 0 && (
            <div>
            <ModernSelect
            label="Tank Size" name="tankSize" value={formData.tankSize} onChange={handleChange}
            options={[
                { value: '750', label: '750 gallons' }, { value: '1000', label: '1,000 gallons' },
                { value: '1250', label: '1,250 gallons' }, { value: '1500', label: '1,500 gallons' },
                { value: '2000', label: '2,000+ gallons' },
            ]}
            placeholder="Select tank capacity..."
            infoText="The capacity of your septic tank in gallons."
            />
            <FloatingLabelInput id="householdSize" label="Household Size" type="number" value={formData.householdSize} onChange={handleChange} placeholder=" " infoText="Number of permanent residents." />
            <ModernSelect
            label="Estimated Daily Water Usage" name="waterUsage" value={formData.waterUsage} onChange={handleChange}
            options={[
                { value: 'low', label: 'Low (~50 gal/person/day)' },
                               { value: 'average', label: 'Average (~70 gal/person/day)' },
                               { value: 'high', label: 'High (100+ gal/person/day)' },
            ]}
            placeholder="Select consumption pattern..."
            />
            <NeumorphicToggle name="garbageDisposal" label="Garbage Disposal Use" enabled={formData.garbageDisposal} setEnabled={(val) => handleToggle('garbageDisposal', val)} infoText="Do you regularly use a garbage disposal?" />
            </div>
        )}

        {currentStep === 1 && (
            <div>
            <ModernSelect
            label="Laundry Frequency" name="laundryFrequency" value={formData.laundryFrequency} onChange={handleChange}
            options={[
                { value: 'low', label: 'Low (1-3 loads/week)' }, { value: 'medium', label: 'Medium (4-7 loads/week)' },
                               { value: 'high', label: 'High (8+ loads/week)' },
            ]}
            placeholder="Select weekly loads..."
            />
            <ModernSelect
            label="Laundry Habits" name="laundryHabits" value={formData.laundryHabits} onChange={handleChange}
            options={[
                { value: 'spread', label: 'Loads are spread out' },
                { value: 'concentrated', label: 'Most loads on 1-2 days' },
            ]}
            placeholder="Select your laundry habit..."
            infoText="How you distribute laundry throughout the week."
            />
            <NeumorphicToggle name="waterSoftener" label="Water Softener Use" enabled={formData.waterSoftener} setEnabled={(val) => handleToggle('waterSoftener', val)} infoText="Do you have a water softener system?" />
            </div>
        )}

        {currentStep === 2 && (
            <div>
            <ModernSelect
            label="Type of Septic System" name="systemType" value={formData.systemType} onChange={handleChange}
            options={[
                { value: 'conventional', label: 'Conventional (Gravity)' }, { value: 'chamber', label: 'Chamber System' },
                               { value: 'atu', label: 'Aerobic Treatment Unit (ATU)' }, { value: 'mound', label: 'Mound System' },
                               { value: 'unknown', label: "I Don't Know" },
            ]}
            placeholder="Select system type..."
            />
            <ModernSelect
            label="Soil Absorption Type" name="soilType" value={formData.soilType} onChange={handleChange}
            options={[
                { value: 'sandy', label: 'Sandy (drains quickly)' }, { value: 'loam', label: 'Loam (balanced and ideal)' },
                               { value: 'clay', label: 'Clay (drains slowly)' }, { value: 'unknown', label: "I Don't Know" },
            ]}
            placeholder="Select soil type..."
            />
            <FloatingLabelInput id="systemAge" label="System Age (Years)" type="number" value={formData.systemAge} onChange={handleChange} placeholder=" " infoText="Approximate age of your septic system." />
            </div>
        )}

        {currentStep === 3 && (
            <div>
            <FloatingLabelInput id="lastPumped" label="Last Pumped Date" type="date" value={formData.lastPumped} onChange={handleChange} placeholder=" " infoText="When was your septic tank last pumped? (Optional)" />
            </div>
        )}
        </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-10">
        {currentStep > 0 ? (
            <button
            type="button"
            onClick={handlePrev}
            className="px-6 py-3 bg-white/5 text-white rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
            >
            Previous
            </button>
        ) : <div />}

        {currentStep < totalSteps - 1 ? (
            <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
            Next
            </button>
        ) : (
            <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
            Calculate Results
            </button>
        )}
        </div>
        </form>
        </div>
        </div>
        </div>
    );
};

export default InputForm;
