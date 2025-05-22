import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { CKDStage, ReferralSource } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const OnboardingForm: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    referralSource: '',
    ckdStage: '',
    onDialysis: '',
    hasDiabetes: '',
    hasHighBloodPressure: '',
  });

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const steps = [
    {
      title: 'How did you hear about us?',
      field: 'referralSource',
      options: Object.values(ReferralSource).map((source) => ({
        value: source,
        label: source,
      })),
    },
    {
      title: 'What stage is your kidney disease?',
      field: 'ckdStage',
      options: Object.values(CKDStage).map((stage) => ({
        value: stage,
        label: stage,
      })),
    },
    {
      title: 'Are you on dialysis?',
      field: 'onDialysis',
      options: [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
      ],
    },
    {
      title: 'Do you have diabetes?',
      field: 'hasDiabetes',
      options: [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
      ],
    },
    {
      title: 'Do you have high blood pressure?',
      field: 'hasHighBloodPressure',
      options: [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
      ],
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save all data and complete onboarding
      updateUser({
        referralSource: formData.referralSource as ReferralSource,
        ckdStage: formData.ckdStage as CKDStage,
        onDialysis: formData.onDialysis === 'true',
        hasDiabetes: formData.hasDiabetes === 'true',
        hasHighBloodPressure: formData.hasHighBloodPressure === 'true',
      });
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const canProceed = formData[currentStepData.field as keyof typeof formData] !== '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-xl mx-auto px-4 py-10"
    >
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-neutral-900">Tell us about yourself</h1>
        <p className="text-neutral-600 mt-2">
          This information helps us personalize your experience
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-600">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium text-neutral-600">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <motion.div
            className="bg-primary-500 h-2 rounded-full"
            initial={{ width: '0%' }}
            animate={{
              width: `${Math.round(((currentStep + 1) / steps.length) * 100)}%`,
            }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        </div>
      </div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg p-6 shadow-elevation-2"
      >
        <h2 className="text-xl font-semibold text-neutral-800 mb-6">
          {currentStepData.title}
        </h2>

        <Select
          options={currentStepData.options}
          value={formData[currentStepData.field as keyof typeof formData]}
          onChange={(value) => updateFormData(currentStepData.field, value)}
          className="mb-6"
        />

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            icon={<ChevronLeft className="h-4 w-4" />}
          >
            Back
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!canProceed}
            icon={currentStep === steps.length - 1 ? <Check className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            iconPosition="right"
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};