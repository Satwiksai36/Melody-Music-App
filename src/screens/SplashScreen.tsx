import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MelodyAnimatedLogo } from '../components/common/MelodyAnimatedLogo';
import { storageService } from '../services/storageService';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  const statuses = [
    'Tuning your acoustic experience...',
    'Calibrating multi-channel soundstage...',
    'Connecting to 48kHz lossless stream...',
    'Harmonizing daily Telugu & Hindi charts...',
    'Ready to play.',
  ];

  const percentages = ['32%', '56%', '78%', '94%', '100%'];

  const [step, setStep] = useState<number>(0);
  const [textOpacity, setTextOpacity] = useState<number>(1);
  const autoNavTimeoutRef = useRef<number | null>(null);

  // Interval timer for 800ms calibration steps matching Stitch export
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((currentStep) => {
        const nextStep = currentStep + 1;
        if (nextStep < statuses.length) {
          // Fade text out slightly, then back in with new status
          setTextOpacity(0.2);
          setTimeout(() => {
            setTextOpacity(1);
          }, 200);
          return nextStep;
        } else {
          clearInterval(interval);
          return currentStep;
        }
      });
    }, 800);

    return () => clearInterval(interval);
  }, [statuses.length]);

  // Auto-redirect after calibration completes:
  // - First-time / not registered: redirect to /auth
  // - Registered user: redirect to /home
  useEffect(() => {
    if (step >= statuses.length - 1) {
      autoNavTimeoutRef.current = window.setTimeout(() => {
        const isRegistered = storageService.getUserProfile().isLoggedIn;
        navigate(isRegistered ? '/home' : '/auth');
      }, 900);
    }

    return () => {
      if (autoNavTimeoutRef.current) {
        clearTimeout(autoNavTimeoutRef.current);
      }
    };
  }, [step, statuses.length, navigate]);

  const handleSkip = () => {
    const isRegistered = storageService.getUserProfile().isLoggedIn;
    navigate(isRegistered ? '/home' : '/auth');
  };

  return (
    <main
      onClick={handleSkip}
      className="flex-1 flex flex-col relative w-full bg-surface pt-safe pb-safe h-full min-h-full justify-between items-center px-margin py-6 select-none overflow-hidden cursor-pointer"
    >
      {/* Ambient Gradient Light Pods (Pure CSS, Smooth & Lightweight) */}
      <div className="absolute -top-24 -left-20 w-72 h-72 rounded-full bg-primary-fixed blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-secondary-fixed blur-3xl opacity-40 pointer-events-none"></div>
      <div className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full bg-tertiary-fixed blur-3xl opacity-35 pointer-events-none"></div>

      {/* Central Brand Unit & Interactive Acoustic Core */}
      <div className="flex flex-col items-center justify-center text-center my-auto z-10 w-full max-w-sm px-2">
        {/* Floating Chip Above Emblem */}
        <div className="mb-space-md inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-surface-container-lowest text-on-surface shadow-sm border border-outline-variant/20">
          <span className="text-secondary-container text-xs">✦</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold tracking-wide">
            Lossless 24-bit Audio
          </span>
        </div>

        {/* Tactile Soundwave Emblem */}
        <div className="relative flex items-center justify-center mb-space-lg">
          {/* Outer Pulsing Glow Rings */}
          <div
            className="absolute w-44 h-44 rounded-full bg-primary-fixed-dim opacity-30 animate-ping"
            style={{ animationDuration: '3.2s' }}
          ></div>
          <div className="absolute w-36 h-36 rounded-full bg-surface-container-lowest shadow-md"></div>

          {/* Primary Core Disc */}
          <MelodyAnimatedLogo size="xl" showBolt={true} />
        </div>

        {/* Brand Typographic Identity - Stitch Logo Image */}
        <div className="flex items-center justify-center my-3">
          <img
            src="/melody-logo.png"
            onError={(e) => {
              // Fallback to Google Stitch Cloudfront URL if local is unavailable
              e.currentTarget.src =
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDFyQ5-3_l1wmMeKOxVeuYk_GWtjrMpoUVhlzBaDU1AZ4i75ocJN2t2LLr6gK8y3XT5G-ZYIMEwH8_2ez_9LqQX0htBtQ516_gwC6nFPZ6W26_isKzcDhzpLBh_XidOUXOQlVxaBHCI4Y0zrHvedT8ECEgAqCvD7b0iVNveTPGqZl6d-EWe3BroEe_YLqcC6sv_20UH5VxzM4lHOuc7GK-i4oVeW-lbOLseSjWcEcZl1O6L1ul4_R5xxp1VdlIFXpWTqZg';
            }}
            alt="Melody"
            className="h-10 w-auto object-contain select-none"
          />
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant max-w-[260px] mx-auto leading-relaxed">
          Feel the Beat. Stream Without Limits.
        </p>

        {/* Refined Dynamic Progress Unit */}
        <div className="w-full mt-4 sm:mt-6 px-space-md flex flex-col items-center">
          {/* Glow Track Progress Bar */}
          <div className="w-full h-2 rounded-full bg-surface-container relative overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-secondary-container to-tertiary shadow-sm transition-all duration-700 ease-out"
              style={{
                width: percentages[step],
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            ></div>
          </div>

          {/* Dynamic Reactive Status Text */}
          <span
            className="font-label-sm text-label-sm text-outline font-medium tracking-wide mt-2 min-h-[22px] transition-opacity duration-200"
            style={{ opacity: textOpacity }}
          >
            {statuses[step]}
          </span>
        </div>
      </div>

      {/* Bottom Brand Credibility & Audio Badges Footer */}
      <div className="w-full flex flex-col items-center text-center z-10 pb-space-sm">
        <p className="font-label-sm text-label-sm text-outline mb-1 font-medium tracking-wide">
          Powered by <span className="text-on-surface font-semibold">Melody SoundCore™</span>
        </p>
        <span className="font-label-sm text-label-sm text-outline-variant">
          v2.4.0 (Build 382)
        </span>
        <p className="font-label-sm text-label-sm text-outline mt-space-xs font-medium tracking-wide">
          Made by <span className="text-on-surface font-semibold">Satwik Sai</span>
        </p>
      </div>
    </main>
  );
};
