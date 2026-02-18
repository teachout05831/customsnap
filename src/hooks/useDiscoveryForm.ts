"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  DiscoveryQuestionnaire,
  initialQuestionnaire,
  isStepValid,
  StyleDirection,
  ServiceCount,
  Timeline,
} from '@/types/questionnaire';

const STORAGE_KEY = 'discovery-questionnaire';
const TOTAL_STEPS = 5;

export function useDiscoveryForm() {
  const [data, setData] = useState<DiscoveryQuestionnaire>(initialQuestionnaire);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData({ ...initialQuestionnaire, ...parsed });
      } catch {
        // If parsing fails, use defaults
        setData(initialQuestionnaire);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  // Navigation
  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setData(prev => ({ ...prev, currentStep: step }));
    }
  }, []);

  const nextStep = useCallback(() => {
    setData(prev => {
      if (prev.currentStep < TOTAL_STEPS) {
        return { ...prev, currentStep: prev.currentStep + 1 };
      }
      return prev;
    });
  }, []);

  const prevStep = useCallback(() => {
    setData(prev => {
      if (prev.currentStep > 1) {
        return { ...prev, currentStep: prev.currentStep - 1 };
      }
      return prev;
    });
  }, []);

  // Validation
  const canProceed = isStepValid(data.currentStep, data);
  const isComplete = data.currentStep === TOTAL_STEPS && canProceed;

  // Step 1 setters
  const setStyleDirection = useCallback((style: StyleDirection) => {
    setData(prev => ({ ...prev, styleDirection: style }));
  }, []);

  const toggleStyleReason = useCallback((reason: string) => {
    setData(prev => {
      const current = prev.styleReasons;
      const updated = current.includes(reason)
        ? current.filter(r => r !== reason)
        : [...current, reason];
      return { ...prev, styleReasons: updated };
    });
  }, []);

  const setInspirationUrls = useCallback((urls: string[]) => {
    setData(prev => ({ ...prev, inspirationUrls: urls }));
  }, []);

  // Step 2 setters
  const toggleAvoidFeature = useCallback((feature: string) => {
    setData(prev => {
      const current = prev.avoidFeatures;
      const updated = current.includes(feature)
        ? current.filter(f => f !== feature)
        : [...current, feature];
      return { ...prev, avoidFeatures: updated };
    });
  }, []);

  const setDealbreakers = useCallback((text: string) => {
    setData(prev => ({ ...prev, dealbreakers: text }));
  }, []);

  // Step 3 setters
  const setBiggestChallenge = useCallback((challenge: string) => {
    setData(prev => ({ ...prev, biggestChallenge: challenge }));
  }, []);

  const toggleFrustration = useCallback((frustration: string) => {
    setData(prev => {
      const current = prev.otherFrustrations || [];
      const updated = current.includes(frustration)
        ? current.filter(f => f !== frustration)
        : [...current, frustration];
      return { ...prev, otherFrustrations: updated };
    });
  }, []);

  const setProblemImpact = useCallback((text: string) => {
    setData(prev => ({ ...prev, problemImpact: text }));
  }, []);

  // Step 4 setters
  const togglePage = useCallback((page: string) => {
    // Home is always included and cannot be toggled
    if (page === 'home') return;
    setData(prev => {
      const current = prev.pagesNeeded;
      const updated = current.includes(page)
        ? current.filter(p => p !== page)
        : [...current, page];
      return { ...prev, pagesNeeded: updated };
    });
  }, []);

  const toggleFeature = useCallback((feature: string) => {
    setData(prev => {
      const current = prev.mustHaveFeatures;
      const updated = current.includes(feature)
        ? current.filter(f => f !== feature)
        : [...current, feature];
      return { ...prev, mustHaveFeatures: updated };
    });
  }, []);

  const setServiceCount = useCallback((count: ServiceCount) => {
    setData(prev => ({ ...prev, serviceCount: count }));
  }, []);

  // Step 5 setters
  const setPrimaryGoal = useCallback((goal: string) => {
    setData(prev => ({ ...prev, primaryGoal: goal }));
  }, []);

  const setTimeline = useCallback((timeline: Timeline) => {
    setData(prev => ({ ...prev, timeline: timeline }));
  }, []);

  const setAdditionalNotes = useCallback((notes: string) => {
    setData(prev => ({ ...prev, additionalNotes: notes }));
  }, []);

  // Complete questionnaire
  const complete = useCallback(() => {
    setData(prev => ({
      ...prev,
      completedAt: new Date().toISOString(),
    }));
  }, []);

  // Reset questionnaire
  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(initialQuestionnaire);
  }, []);

  return {
    // State
    data,
    isLoaded,
    currentStep: data.currentStep,
    totalSteps: TOTAL_STEPS,
    canProceed,
    isComplete,

    // Navigation
    goToStep,
    nextStep,
    prevStep,

    // Step 1
    setStyleDirection,
    toggleStyleReason,
    setInspirationUrls,

    // Step 2
    toggleAvoidFeature,
    setDealbreakers,

    // Step 3
    setBiggestChallenge,
    toggleFrustration,
    setProblemImpact,

    // Step 4
    togglePage,
    toggleFeature,
    setServiceCount,

    // Step 5
    setPrimaryGoal,
    setTimeline,
    setAdditionalNotes,

    // Actions
    complete,
    reset,
  };
}
