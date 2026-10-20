import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { storageService, UserProfile } from '../services/storageService';
import { usePlayer } from '../context/PlayerContext';
import { setSupabaseAnonKey } from '../services/supabaseClient';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const {
    spotifyStatus,
    spotifyUser,
    isSpotifyPremium,
    playbackError,
    connectSpotify,
    disconnectSpotify,
  } = usePlayer();

  // Load profile & preferences from storageService with live reactivity
  const [userProfile, setUserProfile] = useState<UserProfile>(() => storageService.getUserProfile());
  const userName = userProfile.name || '';
  const userHandle = userName ? `@${userName.toLowerCase().replace(/[^a-z0-9]/g, '.')}.melody` : '';

  useEffect(() => {
    return storageService.subscribeToProfile((updated) => {
      setUserProfile(updated);
    });
  }, []);

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(userName);
  const [editEmail, setEditEmail] = useState<string>(userProfile.email || '');
  const [showSupabaseModal, setShowSupabaseModal] = useState<boolean>(false);
  const [supabaseAnonKeyInput, setSupabaseAnonKeyInput] = useState<string>(
    localStorage.getItem('melody_supabase_anon_key') || ''
  );
  const [isSyncingSupabase, setIsSyncingSupabase] = useState<boolean>(false);

  const initialPrefs = storageService.getPreferences();
  const [crossfadeActive, setCrossfadeActive] = useState<boolean>(initialPrefs.crossfadeSeconds > 0);
  const [normalizeActive, setNormalizeActive] = useState<boolean>(initialPrefs.normalizeVolume);
  const [explicitActive, setExplicitActive] = useState<boolean>(true);
  const [offlineActive, setOfflineActive] = useState<boolean>(initialPrefs.offlineDownloads);
  const [isSoundbarConnected, setIsSoundbarConnected] = useState<boolean>(true);
  const [isClearingCache, setIsClearingCache] = useState<boolean>(false);
  const [cacheSize, setCacheSize] = useState<string>('380 MB');
  const [storageText, setStorageText] = useState<string>('4.2 GB of 64 GB');
  const [showPlanModal, setShowPlanModal] = useState<boolean>(false);

  // Languages state
  const languages = storageService
    .getSelectedLanguages()
    .map((l) => `${l.charAt(0).toUpperCase() + l.slice(1)}`);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleClearCache = () => {
    setIsClearingCache(true);
    storageService.clearAppCache();
    setTimeout(() => {
      setIsClearingCache(false);
      setCacheSize('0 MB');
      setStorageText('3.8 GB of 64 GB');
      showToast('Cache cleared successfully (380 MB freed)');
    }, 600);
  };

  const handleLogout = () => {
    storageService.updateUserProfile({ isLoggedIn: false });
    showToast('Signed out of Melody');
    setTimeout(() => {
      navigate('/auth');
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-16 pb-52 bg-surface select-none">
      {/* Top Header Matching Stitch code.html */}
      <Header title="Settings & Profile" showBack />

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[70] px-4 py-2.5 rounded-full bg-inverse-surface/90 backdrop-blur-md text-inverse-on-surface text-body-sm shadow-xl flex items-center gap-2 animate-fadeIn whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex flex-col w-full pb-20">
        {/* Top Profile Card Section */}
        <section className="px-margin pt-space-md">
          <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-outline-variant/20">
            {/* Decorative Backdrop Aura */}
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-gradient-to-br from-primary-fixed via-secondary-fixed to-transparent opacity-60 blur-2xl pointer-events-none"></div>
            <div className="absolute -left-10 bottom-0 w-36 h-36 rounded-full bg-tertiary-fixed opacity-40 blur-xl pointer-events-none"></div>

            <div className="relative flex flex-col items-center text-center">
              {/* Avatar with Tactile Ring & Edit Badge */}
              <div className="relative mb-space-sm group">
                <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-secondary-container via-primary-container to-primary shadow-md">
                  <img
                    alt={userName}
                    className="w-full h-full rounded-full object-cover"
                    src={userProfile.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuB_Nca8Wryg-0g7h4gBFqPVv1UPDP5UmCGwM5xFNrhfEzvncZlNrLjwwHm7YFoQT8Z_hMaPjO9g-P-hLU_4jm5SrOA-7i5p6UtaiZijMPu3PD-cWHXuOt_Qp3yLliS6iiMFh6dH8xEgudGQAbLPQx8aW2Pdiqd58gLxfvO2Xfa8JNaV0EHwEqlfLlif6yxxdiv4flgqG5vOh5ocg9xavF4CnwGX6e9hLxRXE6P1RHPuITjZUqivdZQ6cw"}
                  />
                </div>
                <button
                  aria-label="Edit Profile Picture"
                  onClick={() => showToast('Avatar change dialog opened')}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                </button>
              </div>

              {/* Name & Identity */}
              <div className="flex items-center gap-space-xs mb-1">
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                  {userName}
                </h2>
                <span
                  className="material-symbols-outlined text-primary text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                {userHandle}
              </p>

              {/* Membership Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-on-primary shadow-sm mb-space-md">
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  graphic_eq
                </span>
                <span className="font-label-md text-label-md tracking-wider uppercase font-bold">
                  Melody HiFi Pro
                </span>
              </div>

              {/* Quick Stats Pill Container */}
              <div className="w-full grid grid-cols-3 gap-space-xs py-space-sm px-space-md rounded-lg bg-surface-container-low mb-space-md">
                <button
                  onClick={() => showToast(`Opened ${userName}'s 34 Playlists`)}
                  className="flex flex-col items-center active:scale-95 transition-transform"
                >
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">34</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Playlists</span>
                </button>
                <button
                  onClick={() => showToast('1,240 Total Listeners Following')}
                  className="flex flex-col items-center active:scale-95 transition-transform"
                >
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">1.2k</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Followers</span>
                </button>
                <button
                  onClick={() => showToast('Following 248 Artists & Friends')}
                  className="flex flex-col items-center active:scale-95 transition-transform"
                >
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">248</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Following</span>
                </button>
              </div>

              {/* Profile Actions */}
              <div className="w-full flex items-center gap-space-sm">
                <button
                  onClick={() => {
                    setEditName(userName);
                    setEditEmail(userProfile.email || '');
                    setShowEditModal(true);
                  }}
                  className="flex-1 h-11 rounded-full bg-on-surface text-surface-container-lowest font-label-lg text-label-lg flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform font-bold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Edit Profile
                </button>
                <button
                  aria-label="Share Profile"
                  onClick={() => showToast('Profile link copied to clipboard')}
                  className="w-11 h-11 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-[20px]">ios_share</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Subscription Plan Card */}
        <section className="px-margin pt-space-lg">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary via-primary-container to-secondary-container p-space-md text-on-primary shadow-md">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-secondary-fixed-dim opacity-30 blur-2xl"></div>
            <div className="relative z-10 flex flex-col gap-space-sm text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary-fixed text-[24px]">
                    workspace_premium
                  </span>
                  <span className="font-label-sm text-label-sm tracking-widest uppercase bg-surface-container-lowest/20 px-2 py-0.5 rounded-full backdrop-blur-sm font-bold">
                    Active Plan
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-primary-container">
                  Renews Nov 2026
                </span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-primary mb-0.5 font-bold">
                  HiFi Family Lossless
                </h3>
                <p className="font-body-sm text-body-sm text-on-primary-container">
                  Master Quality Audio • 6 Connected Profiles • Atmos Ready
                </p>
              </div>
              <div className="pt-space-xs flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-surface-container-lowest/30 backdrop-blur-sm flex items-center justify-center text-label-sm font-bold">
                    A
                  </div>
                  <div className="w-7 h-7 rounded-full bg-surface-container-lowest/30 backdrop-blur-sm flex items-center justify-center text-label-sm font-bold">
                    R
                  </div>
                  <div className="w-7 h-7 rounded-full bg-surface-container-lowest/30 backdrop-blur-sm flex items-center justify-center text-label-sm font-bold">
                    K
                  </div>
                  <div className="w-7 h-7 rounded-full bg-surface-container-lowest/40 backdrop-blur-sm flex items-center justify-center text-label-sm font-bold">
                    +3
                  </div>
                </div>
                <button
                  onClick={() => setShowPlanModal(true)}
                  className="px-space-md py-1.5 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md shadow-sm active:scale-95 transition-transform flex items-center gap-1 hover:bg-surface-container-low font-bold"
                >
                  Manage
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Audio & Playback Preferences */}
        <section className="px-margin pt-space-lg">
          <div className="flex items-center justify-between mb-space-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Audio & Playback
            </h3>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-bold">
              Studio Grade
            </span>
          </div>
          <div className="flex flex-col gap-space-xs bg-surface-container-lowest rounded-xl p-space-xs shadow-sm text-left">
            {/* Streaming Quality */}
            <button
              onClick={() => showToast('Streaming Quality: Lossless HiFi (24-bit / 96kHz)')}
              className="w-full flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container-low active:bg-surface-container-high transition-colors text-left group"
            >
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">music_note</span>
                </div>
                <div className="min-w-0">
                  <p className="font-title-md text-title-md text-on-surface font-semibold">
                    Streaming Quality
                  </p>
                  <p className="font-body-sm text-body-sm text-primary truncate">
                    Lossless HiFi (24-bit / 96kHz)
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant text-[20px] group-hover:text-on-surface transition-colors">
                chevron_right
              </span>
            </button>

            {/* Download Quality */}
            <button
              onClick={() => showToast('Download Quality: Very High (320 kbps)')}
              className="w-full flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container-low active:bg-surface-container-high transition-colors text-left group"
            >
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">download_for_offline</span>
                </div>
                <div className="min-w-0">
                  <p className="font-title-md text-title-md text-on-surface font-semibold">
                    Download Quality
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    Very High (320 kbps)
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant text-[20px] group-hover:text-on-surface transition-colors">
                chevron_right
              </span>
            </button>

            {/* Equalizer Setting */}
            <button
              onClick={() => showToast('Equalizer: Custom - Vocal Boost active')}
              className="w-full flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container-low active:bg-surface-container-high transition-colors text-left group"
            >
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-secondary-container flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                </div>
                <div className="min-w-0">
                  <p className="font-title-md text-title-md text-on-surface font-semibold">
                    Equalizer Preset
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="flex items-end gap-[2px] h-3">
                      <span className="w-[2px] h-2 bg-secondary-container rounded-full animate-pulse"></span>
                      <span className="w-[2px] h-3 bg-secondary-container rounded-full animate-pulse"></span>
                      <span className="w-[2px] h-1.5 bg-secondary-container rounded-full animate-pulse"></span>
                      <span className="w-[2px] h-2.5 bg-secondary-container rounded-full animate-pulse"></span>
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      Custom - Vocal Boost
                    </p>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant text-[20px] group-hover:text-on-surface transition-colors">
                chevron_right
              </span>
            </button>

            {/* Crossfade & Gapless Toggle */}
            <div className="flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">sync_alt</span>
                </div>
                <div className="min-w-0">
                  <p className="font-title-md text-title-md text-on-surface font-semibold">
                    Crossfade Playback
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {crossfadeActive ? 'Active (4s blend between tracks)' : 'Disabled'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setCrossfadeActive(!crossfadeActive);
                  showToast(crossfadeActive ? 'Crossfade turned Off' : 'Crossfade Enabled (4s)');
                }}
                className={`w-12 h-7 rounded-full relative p-0.5 transition-colors focus:outline-none flex-shrink-0 cursor-pointer ${
                  crossfadeActive ? 'bg-primary' : 'bg-surface-variant'
                }`}
              >
                <span
                  className={`w-6 h-6 bg-on-primary rounded-full block shadow-sm transform transition-transform duration-200 ${
                    crossfadeActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></span>
              </button>
            </div>

            {/* Normalize Volume Toggle */}
            <div className="flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">volume_up</span>
                </div>
                <div className="min-w-0">
                  <p className="font-title-md text-title-md text-on-surface font-semibold">
                    Normalize Volume
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Standardized volume for all tracks
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setNormalizeActive(!normalizeActive);
                  showToast(normalizeActive ? 'Volume normalization Off' : 'Volume normalization On');
                }}
                className={`w-12 h-7 rounded-full relative p-0.5 transition-colors focus:outline-none flex-shrink-0 cursor-pointer ${
                  normalizeActive ? 'bg-primary' : 'bg-surface-variant'
                }`}
              >
                <span
                  className={`w-6 h-6 bg-on-primary rounded-full block shadow-sm transform transition-transform duration-200 ${
                    normalizeActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></span>
              </button>
            </div>
          </div>
        </section>

        {/* Regional & Content Preferences */}
        <section className="px-margin pt-space-lg">
          <div className="flex items-center justify-between mb-space-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Regional & Discovery
            </h3>
          </div>
          <div className="flex flex-col gap-space-xs bg-surface-container-lowest rounded-xl p-space-md shadow-sm text-left">
            {/* Sound Languages Selector */}
            <div className="flex flex-col gap-space-xs pb-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">language</span>
                  <span className="font-title-md text-title-md text-on-surface font-semibold">
                    Music Languages
                  </span>
                </div>
                <button
                  onClick={() => showToast('Language preference selector')}
                  className="font-label-md text-label-md text-primary font-semibold hover:underline"
                >
                  Change
                </button>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-xs">
                Fine-tune your daily mixes, charts, and smart recommendations
              </p>

              {/* Language Badges */}
              <div className="flex flex-wrap gap-space-xs">
                {languages.map((lang, idx) => {
                  const colors = [
                    'bg-tertiary-fixed text-on-tertiary-fixed ring-tertiary/20',
                    'bg-secondary-fixed text-on-secondary-fixed ring-secondary-container/20',
                    'bg-primary-fixed text-on-primary-fixed ring-primary/20',
                  ];
                  const dotColors = ['bg-tertiary', 'bg-secondary-container', 'bg-primary'];

                  return (
                    <button
                      key={lang}
                      onClick={() => showToast(`Selected language: ${lang}`)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 cursor-pointer ring-1 ${
                        colors[idx % colors.length]
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${dotColors[idx % dotColors.length]}`}></span>
                      <span>{lang}</span>
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </button>
                  );
                })}
                <button
                  aria-label="Add music language"
                  onClick={() => showToast('More languages: Malayalam, Kannada, Punjabi')}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface-container text-on-surface hover:bg-surface-variant active:scale-90 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
            </div>

            {/* Explicit Content Toggle */}
            <div className="flex items-center justify-between pt-space-xs rounded-lg hover:bg-surface-container-low transition-colors px-1 border-t border-surface-variant/30">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">explicit</span>
                </div>
                <div className="min-w-0">
                  <p className="font-title-md text-title-md text-on-surface font-semibold">
                    Explicit Content
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Allow playback of explicit music
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setExplicitActive(!explicitActive);
                  showToast(explicitActive ? 'Explicit content blocked' : 'Explicit content allowed');
                }}
                className={`w-12 h-7 rounded-full relative p-0.5 transition-colors focus:outline-none flex-shrink-0 cursor-pointer ${
                  explicitActive ? 'bg-primary' : 'bg-surface-variant'
                }`}
              >
                <span
                  className={`w-6 h-6 bg-on-primary rounded-full block shadow-sm transform transition-transform duration-200 ${
                    explicitActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></span>
              </button>
            </div>

            {/* Offline Mode Toggle */}
            <div className="flex items-center justify-between pt-space-xs rounded-lg hover:bg-surface-container-low transition-colors px-1">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">cloud_off</span>
                </div>
                <div className="min-w-0">
                  <p className="font-title-md text-title-md text-on-surface font-semibold">
                    Offline Mode
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Stream downloaded library only
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setOfflineActive(!offlineActive);
                  showToast(offlineActive ? 'Online streaming enabled' : 'Offline Mode enabled');
                }}
                className={`w-12 h-7 rounded-full relative p-0.5 transition-colors focus:outline-none flex-shrink-0 cursor-pointer ${
                  offlineActive ? 'bg-primary' : 'bg-surface-variant'
                }`}
              >
                <span
                  className={`w-6 h-6 bg-on-primary rounded-full block shadow-sm transform transition-transform duration-200 ${
                    offlineActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></span>
              </button>
            </div>
          </div>
        </section>

        {/* Storage & Device Cache Section */}
        <section className="px-margin pt-space-lg text-left">
          <div className="flex items-center justify-between mb-space-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Device Storage
            </h3>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Internal Flash</span>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md">
            <div>
              <div className="flex justify-between items-center mb-space-xs">
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                  Downloaded Music & Cache
                </span>
                <span className="font-label-md text-label-md text-primary font-bold transition-all duration-300">
                  {storageText}
                </span>
              </div>

              {/* Segmented Storage Meter */}
              <div className="w-full h-3 rounded-full bg-surface-container-high overflow-hidden flex transition-all duration-500">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: '22%' }}
                  title="Offline Audio"
                ></div>
                <div
                  className="h-full bg-secondary-container transition-all duration-500"
                  style={{ width: cacheSize === '0 MB' ? '0%' : '8%' }}
                  title="Melody Cache"
                ></div>
                <div
                  className="h-full bg-tertiary-fixed-dim transition-all duration-500"
                  style={{ width: '14%' }}
                  title="App Assets"
                ></div>
              </div>

              {/* Legend indicators */}
              <div className="flex items-center gap-space-md pt-space-xs flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Songs (3.4 GB)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Cache ({cacheSize})
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Other</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-space-xs gap-space-sm">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Clearing cache won't delete downloaded offline tracks.
              </p>
              <button
                onClick={handleClearCache}
                disabled={isClearingCache || cacheSize === '0 MB'}
                className="px-space-md py-2 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-variant active:scale-95 transition-all flex-shrink-0 flex items-center justify-center gap-1.5 min-w-[104px] font-semibold"
              >
                {isClearingCache && (
                  <span className="material-symbols-outlined text-[16px] animate-spin">
                    progress_activity
                  </span>
                )}
                <span>{cacheSize === '0 MB' ? 'Cleared' : 'Clear Cache'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Authorized Music Service Integration */}
        <section className="px-margin pt-space-lg text-left">
          <div className="flex items-center justify-between mb-space-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Music Streaming Service
            </h3>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-bold">
              {spotifyStatus === 'connected' ? 'Authorized' : 'Optional'}
            </span>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                  spotifyStatus === 'connected'
                    ? 'bg-[#1DB954] text-white'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.494 17.306c-.215.353-.677.466-1.03.251-2.825-1.726-6.381-2.117-10.569-1.161-.403.092-.806-.157-.899-.56-.092-.403.157-.806.56-.899 4.593-1.049 8.528-.609 11.687 1.339.353.215.466.677.251 1.03zm1.467-3.26c-.27.441-.849.58-1.29.31-3.235-1.988-8.167-2.563-11.994-1.401-.497.151-1.026-.134-1.177-.631-.151-.497.134-1.026.631-1.177 4.38-1.329 9.809-.691 13.52 1.599.441.27.58.849.31 1.29zm.126-3.396C15.215 8.35 8.831 8.139 5.137 9.261c-.596.181-1.229-.158-1.41-.754-.181-.596.158-1.229.754-1.41 4.249-1.29 11.298-1.044 15.753 1.601.536.318.71 1.011.392 1.547-.318.536-1.011.71-1.547.392z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-title-md text-title-md text-on-surface font-semibold">
                      Spotify Service
                    </p>
                    {spotifyStatus === 'connected' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1DB954]/15 text-[#1DB954]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse"></span>
                        {isSpotifyPremium ? 'Premium SDK' : 'Free Preview'}
                      </span>
                    )}
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {spotifyStatus === 'connected' && spotifyUser
                      ? `${spotifyUser.name || spotifyUser.id} (${spotifyUser.email || 'Authorized'})`
                      : spotifyStatus === 'connecting'
                      ? 'Connecting to Spotify...'
                      : 'Not connected • Local fallback audio active'}
                  </p>
                </div>
              </div>

              {spotifyStatus === 'connected' ? (
                <button
                  onClick={() => {
                    disconnectSpotify();
                    showToast('Disconnected from Spotify');
                  }}
                  className="px-space-sm py-1.5 rounded-full bg-surface-container text-on-surface hover:bg-surface-variant text-label-sm font-semibold active:scale-95 transition-all flex-shrink-0"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={async () => {
                    try {
                      await connectSpotify();
                    } catch (err: any) {
                      showToast(err?.message || 'Could not initiate Spotify connection');
                    }
                  }}
                  disabled={spotifyStatus === 'connecting'}
                  className="px-space-md py-1.5 rounded-full bg-[#1DB954] text-white hover:bg-[#1AA34A] text-label-sm font-bold active:scale-95 transition-all shadow-sm flex items-center gap-1 flex-shrink-0"
                >
                  {spotifyStatus === 'connecting' ? (
                    <span className="material-symbols-outlined text-[16px] animate-spin">
                      progress_activity
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[16px]">login</span>
                  )}
                  Connect
                </button>
              )}
            </div>

            {/* Mode & Engine details */}
            <div className="p-space-xs px-space-sm rounded-lg bg-surface-container-low text-label-sm text-on-surface-variant flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                {spotifyStatus === 'connected'
                  ? isSpotifyPremium
                    ? 'Spotify Web Playback SDK • Full Song Playback'
                    : 'Spotify Web API • 30s High-Quality Previews'
                  : 'Melody Native Audio Engine • Lossless Indian & Telugu Hits'}
              </span>
              <span className="text-[11px] text-primary font-bold uppercase tracking-wider">
                Active
              </span>
            </div>

            {playbackError && (
              <p className="text-body-sm text-error flex items-center gap-1 pt-1">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                {playbackError}
              </p>
            )}
          </div>
        </section>

        {/* Supabase Cloud Data Storage Section */}
        <section className="px-margin pt-space-lg text-left">
          <div className="flex items-center justify-between mb-space-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Cloud Database Storage
            </h3>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-bold">
              Supabase PostgreSQL
            </span>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-11 h-11 rounded-full bg-[#3ECF8E]/20 text-[#3ECF8E] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">database</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-title-md text-title-md text-on-surface font-semibold">
                      Supabase Cloud Storage
                    </p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#3ECF8E]/15 text-[#3ECF8E]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E] animate-pulse"></span>
                      Connected (IPv4)
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    aws-0-ap-south-1.pooler.supabase.com:6543 • yskjjmebwulfrqnkmaoa
                  </p>
                </div>
              </div>

              <button
                onClick={async () => {
                  setIsSyncingSupabase(true);
                  await storageService.syncWithSupabase();
                  setTimeout(() => {
                    setIsSyncingSupabase(false);
                    showToast('Supabase cloud tables synchronized!');
                  }, 600);
                }}
                disabled={isSyncingSupabase}
                className="px-space-md py-1.5 rounded-full bg-primary text-on-primary text-label-sm font-bold active:scale-95 transition-all shadow-sm flex items-center gap-1 flex-shrink-0 cursor-pointer"
              >
                {isSyncingSupabase ? (
                  <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-[16px]">cloud_sync</span>
                )}
                Sync Now
              </button>
            </div>

            {/* Cloud Storage Details */}
            <div className="p-space-xs px-space-sm rounded-lg bg-surface-container-low text-label-sm text-on-surface-variant flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                7 Tables Configured: Profiles, Playlists, Liked, Preferences
              </span>
              <button
                onClick={() => setShowSupabaseModal(true)}
                className="text-primary hover:underline font-bold text-[11px] cursor-pointer"
              >
                Config
              </button>
            </div>
          </div>
        </section>

        {/* Connected Ecosystem */}
        <section className="px-margin pt-space-lg text-left">
          <div className="flex items-center justify-between mb-space-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Devices & Cast
            </h3>
          </div>
          <div className="flex flex-col gap-space-xs bg-surface-container-lowest rounded-xl p-space-xs shadow-sm">
            {/* Connected Device Item */}
            <div className="w-full flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container-low transition-colors">
              <div className="flex items-center gap-space-sm min-w-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSoundbarConnected
                      ? 'bg-tertiary-fixed text-tertiary'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">speaker</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-title-md text-title-md text-on-surface font-semibold">
                      Studio Living Soundbar
                    </p>
                    {isSoundbarConnected && (
                      <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                    )}
                  </div>
                  <p
                    className={`font-body-sm text-body-sm truncate ${
                      isSoundbarConnected ? 'text-tertiary' : 'text-on-surface-variant'
                    }`}
                  >
                    {isSoundbarConnected ? 'Connected • AirPlay Hi-Res' : 'Disconnected'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsSoundbarConnected(!isSoundbarConnected);
                  showToast(
                    isSoundbarConnected
                      ? 'Disconnected from Studio Soundbar'
                      : 'Connected to Studio Soundbar'
                  );
                }}
                className="px-space-sm py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm active:scale-90 hover:bg-surface-variant transition-all font-semibold"
              >
                {isSoundbarConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>

            {/* Apple CarPlay */}
            <button
              onClick={() => showToast('Apple CarPlay: Ready to auto-connect in vehicle')}
              className="w-full flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container-low active:bg-surface-container-high transition-colors text-left group"
            >
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">directions_car</span>
                </div>
                <div className="min-w-0">
                  <p className="font-title-md text-title-md text-on-surface font-semibold">
                    Apple CarPlay
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    Auto-connect when driving
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant text-[20px] group-hover:text-on-surface transition-colors">
                chevron_right
              </span>
            </button>

            {/* Notifications & Smart Recommendations */}
            <button
              onClick={() => showToast('Artist Radar & Telugu/Hindi release alerts active')}
              className="w-full flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container-low active:bg-surface-container-high transition-colors text-left group"
            >
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                </div>
                <div className="min-w-0">
                  <p className="font-title-md text-title-md text-on-surface font-semibold">
                    Artist Radar & Alerts
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    New Telugu/Bollywood releases
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant text-[20px] group-hover:text-on-surface transition-colors">
                chevron_right
              </span>
            </button>
          </div>
        </section>

        {/* Danger Zone & Account Exit */}
        <section className="px-margin pt-space-lg flex flex-col gap-space-sm">
          <button
            onClick={handleLogout}
            className="w-full h-12 rounded-xl bg-surface-container-lowest text-secondary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm active:bg-secondary-fixed/40 active:scale-[0.99] transition-all cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Log Out
          </button>
          <button
            onClick={() => showToast('Account deletion request initiated')}
            className="w-full py-2 text-center text-outline hover:text-error active:text-error font-label-md text-label-md transition-colors cursor-pointer"
          >
            Delete Account & Vault Data
          </button>
        </section>

        {/* Footer Branding Details */}
        <footer className="px-margin pt-space-md pb-space-lg flex flex-col items-center text-center">
          <button
            onClick={() => showToast('Melody SoundCore™ v2.4.0 (Lossless 24-bit Engine)')}
            className="flex items-center gap-1.5 mb-1 text-primary active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[16px]">graphic_eq</span>
            <span className="font-label-sm text-label-sm tracking-widest uppercase font-bold">
              Melody SoundCore™ v2.4.0
            </span>
          </button>
          <p className="font-body-sm text-body-sm text-outline">
            Build 382 • Lossless Spatial Audio Engine
          </p>
          <p className="font-label-sm text-label-sm text-outline-variant mt-1">
            Crafted with rhythm for Telugu & Indian Cinema Sound
          </p>
        </footer>
      </main>

      {/* Plan Management Modal Sheet */}
      {showPlanModal && (
        <div
          onClick={() => setShowPlanModal(false)}
          className="absolute inset-0 z-50 bg-inverse-surface/50 backdrop-blur-sm flex items-end justify-center p-0 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-surface-container-lowest rounded-t-2xl p-space-lg shadow-2xl flex flex-col gap-space-md text-left"
          >
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container text-[24px]">
                  workspace_premium
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Manage HiFi Plan
                </h3>
              </div>
              <button
                aria-label="Close modal"
                onClick={() => setShowPlanModal(false)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <div className="p-3 rounded-xl bg-surface-container-high/60 border border-primary/30">
                <p className="font-title-md font-bold text-on-surface">HiFi Family Lossless</p>
                <p className="font-body-sm text-on-surface-variant">₹199 / month • Next billing 20 Nov 2026</p>
              </div>
              <button
                onClick={() => {
                  setShowPlanModal(false);
                  showToast('Family members invite link generated');
                }}
                className="w-full py-2.5 rounded-full bg-primary text-on-primary font-label-md font-bold"
              >
                Invite Family Members (3 spots left)
              </button>
              <button
                onClick={() => {
                  setShowPlanModal(false);
                  showToast('Payment method update opened');
                }}
                className="w-full py-2.5 rounded-full bg-surface-container text-on-surface font-label-md font-semibold cursor-pointer"
              >
                Update Payment Method
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal Sheet */}
      {showEditModal && (
        <div
          onClick={() => setShowEditModal(false)}
          className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-end justify-center p-0 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl p-space-lg shadow-2xl flex flex-col gap-space-md text-left border-t border-outline-variant/30"
          >
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">
                  manage_accounts
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Edit Profile
                </h3>
              </div>
              <button
                aria-label="Close modal"
                onClick={() => setShowEditModal(false)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const trimmedName = editName.trim() || 'Riyad';
                const trimmedEmail =
                  editEmail.trim() ||
                  `${trimmedName.toLowerCase().replace(/\s+/g, '')}@melody.in`;
                storageService.updateUserProfile({
                  name: trimmedName,
                  email: trimmedEmail,
                });
                setShowEditModal(false);
                showToast(`Profile name updated to ${trimmedName}`);
              }}
              className="flex flex-col gap-4 pt-1"
            >
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant font-bold">
                  DISPLAY NAME
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">
                    person
                  </span>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-surface-container-low text-on-surface font-body-lg text-body-lg rounded-xl py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-primary/40 border border-outline-variant/30"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant font-bold">
                  EMAIL ADDRESS
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none">
                    mail
                  </span>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full bg-surface-container-low text-on-surface font-body-lg text-body-lg rounded-xl py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-primary/40 border border-outline-variant/30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 rounded-full bg-surface-container text-on-surface font-label-md font-semibold cursor-pointer active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-primary text-on-primary font-label-md font-bold shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supabase Configuration Modal */}
      {showSupabaseModal && (
        <div
          onClick={() => setShowSupabaseModal(false)}
          className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-end justify-center p-0 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl p-space-lg shadow-2xl flex flex-col gap-space-md text-left border-t border-outline-variant/30"
          >
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3ECF8E] text-[24px]">
                  database
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Supabase Database
                </h3>
              </div>
              <button
                aria-label="Close modal"
                onClick={() => setShowSupabaseModal(false)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-body-sm text-on-surface flex flex-col gap-1">
                <p className="font-bold text-[#3ECF8E] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  PostgreSQL Pooler Active
                </p>
                <p className="text-on-surface-variant font-mono text-xs break-all">
                  aws-0-ap-south-1.pooler.supabase.com:6543
                </p>
                <p className="text-on-surface-variant font-mono text-xs">
                  Project: yskjjmebwulfrqnkmaoa
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant font-bold">
                  SUPABASE ANON PUBLIC KEY (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={supabaseAnonKeyInput}
                  onChange={(e) => setSupabaseAnonKeyInput(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full bg-surface-container-low text-on-surface font-mono text-xs rounded-xl py-2.5 px-3 outline-none focus:ring-2 focus:ring-primary/40 border border-outline-variant/30"
                />
                <p className="text-[11px] text-on-surface-variant">
                  Find in Supabase Dashboard &gt; Project Settings &gt; API &gt; anon public
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSupabaseModal(false)}
                  className="flex-1 py-3 rounded-full bg-surface-container text-on-surface font-label-md font-semibold cursor-pointer active:scale-95 transition-all"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (supabaseAnonKeyInput.trim()) {
                      setSupabaseAnonKey(supabaseAnonKeyInput.trim());
                      showToast('Supabase Client Key saved!');
                    } else {
                      showToast('Database pooler is connected via backend');
                    }
                    setShowSupabaseModal(false);
                  }}
                  className="flex-1 py-3 rounded-full bg-primary text-on-primary font-label-md font-bold shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
