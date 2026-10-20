import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MelodyAnimatedLogo } from '../components/common/MelodyAnimatedLogo';
import { storageService } from '../services/storageService';

export const AuthScreen: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const fillDemoPhone = () => {
    setFullName('Riyad');
    setIdentifier('riyad@melody.in');
    setPassword('Tollywood2026!');
    showToast('Demo credentials filled: Riyad');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = identifier.trim();
    if (!cleanId) {
      showToast('Please enter your email or mobile number');
      return;
    }
    if (cleanId.includes('@') && !cleanId.includes('.')) {
      showToast('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      showToast('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const isEmail = cleanId.includes('@');
      let displayName = fullName.trim();
      if (!displayName) {
        if (isEmail) {
          const rawName = cleanId.split('@')[0];
          displayName = rawName
            .split(/[._-]+/)
            .filter(Boolean)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
        } else {
          displayName = 'Riyad';
        }
      }
      storageService.updateUserProfile({
        name: displayName,
        email: isEmail ? cleanId : `${displayName.toLowerCase().replace(/\s+/g, '')}@melody.in`,
        phone: !isEmail ? cleanId : '+91 98765 43210',
        isLoggedIn: true,
      });
      showToast(tab === 'signin' ? `Welcome back, ${displayName}!` : `Account created for ${displayName}!`);
      setTimeout(() => {
        navigate('/onboarding');
      }, 700);
    }, 800);
  };

  const handleSocialAuth = (provider: string) => {
    setIsLoading(true);
    showToast(`Connecting with ${provider}...`);
    setTimeout(() => {
      setIsLoading(false);
      storageService.updateUserProfile({
        name: 'Riyad',
        email: 'riyad@melody.in',
        isLoggedIn: true,
      });
      navigate('/onboarding');
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pb-safe bg-surface pt-safe min-h-screen select-none overflow-y-auto no-scrollbar">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[70] px-4 py-2.5 rounded-full bg-inverse-surface/90 backdrop-blur-md text-inverse-on-surface text-body-sm shadow-xl flex items-center gap-2 animate-fadeIn whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">
            verified
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 flex flex-col relative w-full pb-safe bg-surface">
        <div className="flex flex-col w-full px-margin pb-space-xl">
          {/* Interactive Visual Hero & Soundmark Banner */}
          <div className="relative w-full pb-space-md flex flex-col items-center text-center pt-10">
            {/* Playful Ambient Graphic Accent with Animated Logo */}
            <div className="relative mb-space-sm flex items-center justify-center">
              <MelodyAnimatedLogo size="lg" showBolt={true} isAnimated={true} />

              {/* Tiny Playful Music Sparkle Badges */}
              <div className="absolute -top-1 -right-2 bg-tertiary-fixed text-on-tertiary-fixed px-space-xs py-0.5 rounded-full shadow-sm flex items-center gap-0.5 z-20">
                <span
                  className="material-symbols-outlined text-[13px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  graphic_eq
                </span>
                <span className="font-label-sm text-label-sm font-bold">Lossless</span>
              </div>
            </div>

            {/* Punchy Headings */}
            <div className="space-y-space-xs max-w-xs">
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                Feel the Beat.
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Your vibrant gateway to Telugu, Bollywood, and authentic Indian indie soundscapes.
              </p>
            </div>
          </div>

          {/* Segmented Pill Auth Mode Switcher */}
          <div className="w-full bg-surface-container-high p-1 rounded-full flex items-center relative mb-space-lg shadow-inner">
            <button
              type="button"
              id="tab-signin"
              onClick={() => {
                setTab('signin');
                showToast('Switched to Sign In');
              }}
              className={`flex-1 py-space-sm rounded-full font-label-lg text-label-lg transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                tab === 'signin'
                  ? 'text-on-primary bg-primary shadow-[0_4px_14px_rgba(66,29,219,0.3)] font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>Sign In</span>
            </button>
            <button
              type="button"
              id="tab-signup"
              onClick={() => {
                setTab('signup');
                showToast('Switched to Create Account');
              }}
              className={`flex-1 py-space-sm rounded-full font-label-lg text-label-lg transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                tab === 'signup'
                  ? 'text-on-primary bg-primary shadow-[0_4px_14px_rgba(66,29,219,0.3)] font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>Create Account</span>
            </button>
          </div>

          {/* Primary Interactive Credentials Form Card */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-[0_10px_26px_rgba(91,66,243,0.06)] mb-space-lg text-left border border-outline-variant/30">
            <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
              {/* Email or Phone Input */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-label-md text-label-md text-on-surface-variant flex items-center justify-between"
                  htmlFor="auth-identifier"
                >
                  <span className="font-bold">EMAIL OR MOBILE NUMBER</span>
                  <span
                    onClick={fillDemoPhone}
                    className="text-primary font-body-sm text-body-sm cursor-pointer hover:underline font-bold"
                  >
                    Use Demo
                  </span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-space-md text-outline text-[20px] pointer-events-none">
                    mail
                  </span>
                  <input
                    id="auth-identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="arjun.reddy@melody.in"
                    type="text"
                    className="w-full bg-surface-container-low text-on-surface font-body-lg text-body-lg rounded-xl py-space-sm pl-11 pr-space-md outline-none focus:bg-surface-container focus:ring-2 focus:ring-primary-container/40 transition-all placeholder:text-outline/60"
                  />
                </div>
              </div>

              {/* Password Input with Interactive Toggle */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    className="font-label-md text-label-md text-on-surface-variant font-bold"
                    htmlFor="auth-password"
                  >
                    PASSWORD
                  </label>
                  <button
                    type="button"
                    onClick={fillDemoPhone}
                    className="font-body-sm text-body-sm text-secondary hover:text-secondary-container transition-colors font-medium"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-space-md text-outline text-[20px] pointer-events-none">
                    lock
                  </span>
                  <input
                    id="auth-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secure password"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-surface-container-low text-on-surface font-body-lg text-body-lg rounded-xl py-space-sm pl-11 pr-11 outline-none focus:bg-surface-container focus:ring-2 focus:ring-primary-container/40 transition-all placeholder:text-outline/60"
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-space-md text-outline hover:text-on-surface flex items-center justify-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                id="submit-btn"
                disabled={isLoading}
                className="w-full py-space-md px-space-lg rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg tracking-wide shadow-[0_8px_20px_rgba(91,66,243,0.35)] flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all hover:brightness-105 font-bold cursor-pointer"
              >
                {isLoading && (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                )}
                <span>{tab === 'signin' ? 'Sign In to Melody' : 'Create Free Account'}</span>
                <span className="material-symbols-outlined text-[20px] transition-transform">
                  arrow_forward
                </span>
              </button>
            </form>
          </div>

          {/* Clearly Identified Demo Authentication Banner */}
          <div className="w-full bg-surface-container-high/60 border border-outline-variant/30 rounded-xl px-3 py-2 mb-space-md flex items-center justify-between text-left text-xs text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-tertiary">info</span>
              <span><strong>Demo Auth:</strong> Local session mode active. Real auth integration in Phase 3.</span>
            </div>
            <button
              type="button"
              onClick={fillDemoPhone}
              className="text-primary font-bold hover:underline shrink-0 pl-2"
            >
              Auto-Fill
            </button>
          </div>

          {/* Divider Section */}
          <div className="relative w-full flex items-center justify-center my-space-xs">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full bg-outline-variant/50 h-px"></div>
            </div>
            <div className="relative px-space-md bg-surface text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              or continue with
            </div>
          </div>

          {/* Social & Fast Authorization Grid */}
          <div className="grid grid-cols-3 gap-space-sm mt-space-md mb-space-md">
            {/* Google Auth */}
            <button
              type="button"
              aria-label="Continue with Google"
              onClick={() => handleSocialAuth('Google')}
              className="flex flex-col items-center justify-center p-space-sm bg-surface-container-lowest hover:bg-surface-container rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-all text-on-surface border border-outline-variant/30 cursor-pointer"
            >
              <svg className="w-6 h-6 mb-1" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                ></path>
              </svg>
              <span className="font-label-sm text-label-sm font-semibold">Google</span>
            </button>

            {/* Apple Auth */}
            <button
              type="button"
              aria-label="Continue with Apple"
              onClick={() => handleSocialAuth('Apple')}
              className="flex flex-col items-center justify-center p-space-sm bg-surface-container-lowest hover:bg-surface-container rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-all text-on-surface border border-outline-variant/30 cursor-pointer"
            >
              <svg className="w-6 h-6 mb-1 fill-current text-on-surface" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2.02.6-2.66 1.34-.56.64-1.06 1.71-.92 2.74 1.01.08 2.05-.48 2.66-1.23z"></path>
              </svg>
              <span className="font-label-sm text-label-sm font-semibold">Apple</span>
            </button>

            {/* Mobile OTP Quick */}
            <button
              type="button"
              aria-label="Instant Phone OTP"
              onClick={() => handleSocialAuth('Fast OTP')}
              className="flex flex-col items-center justify-center p-space-sm bg-surface-container-lowest hover:bg-surface-container rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-all text-on-surface border border-outline-variant/30 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px] text-secondary-container mb-1">
                sms
              </span>
              <span className="font-label-sm text-label-sm font-semibold">Fast OTP</span>
            </button>
          </div>

          {/* Music Cloud Seamless Sync Callout */}
          <div className="w-full bg-tertiary-fixed text-on-tertiary-fixed p-space-sm rounded-xl flex items-center gap-space-sm mb-space-lg shadow-sm text-left">
            <div className="w-8 h-8 rounded-full bg-tertiary/20 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[18px] text-tertiary">cloud_sync</span>
            </div>
            <p className="font-body-sm text-body-sm leading-tight text-on-tertiary-fixed">
              <strong>Instant Library Sync:</strong> Imports your liked tracks, regional playlists & daily mixes automatically.
            </p>
          </div>

          {/* Dynamic Alternate Prompt Footer */}
          <div className="flex flex-col items-center text-center gap-space-xs mt-auto">
            <div className="font-body-md text-body-md text-on-surface-variant">
              <span>{tab === 'signin' ? "Don't have an account yet?" : "Already have a Melody profile?"}</span>
              <button
                type="button"
                onClick={() => setTab(tab === 'signin' ? 'signup' : 'signin')}
                className="font-title-md text-title-md text-secondary ml-1 hover:underline font-bold"
              >
                {tab === 'signin' ? 'Sign Up Free' : 'Sign In'}
              </button>
            </div>
            {/* Legal Terms */}
            <p className="font-body-sm text-body-sm text-outline max-w-xs mt-space-sm leading-normal">
              By signing in, you agree to Melody's{' '}
              <a
                onClick={() => showToast('Terms of Service')}
                className="underline hover:text-on-surface cursor-pointer"
              >
                Terms of Service
              </a>{' '}
              &{' '}
              <a
                onClick={() => showToast('Privacy Policy')}
                className="underline hover:text-on-surface cursor-pointer"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
