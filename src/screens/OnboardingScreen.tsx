import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';

export const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const saved = storageService.getSelectedLanguages();
    return saved && saved.length > 0 ? saved : ['sid-sriram', 'arijit-singh'];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Exact 8 Artists & Languages from Stitch melody_sound_languages_artists/code.html
  const languageCards = [
    {
      id: 'sid-sriram',
      name: 'Sid Sriram',
      languageBadge: 'Telugu • తెలుగు',
      tagline: 'Top Telugu Vocalist',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBSMKkMCdeElVoyh29Cn16YV4JUDMvPSbqIxQJ_OgGaV6i1CBQr_mchrHUtifLc7tQs6t3y6khQXbQAf67GsBEliFo1W5feASn0CsRdLPOUJntFf8zx3j_mKumbevH6pBFxEKeWEWNzdYw42ia5XUSOqcI5Otv50lLoJiwfOe83j3iBqYLRhomvJilY-l9HcDz14aFI-Dz_uZ1hAAT-DNtdfNAz1kX2a1OWFOg-3YLvtbBL8rjPg2tAQw',
    },
    {
      id: 'arijit-singh',
      name: 'Arijit Singh',
      languageBadge: 'Hindi • हिंदी',
      tagline: 'Soulful Hindi Melodies',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCUTAuaDj79pwgxIqfEJ7lAuhn0YhJ_bITQAuPEOaRVLsfboHh-zv5drcTBcSRQAqub6Hw8EhL_XDala_WS6SJSIRVmJccZA_mzNo034JSzWA9SvrRur88XQuA_IIvyIp9y94xSB7OiI6SaDRioJuCRI4UNLgrScK0TuCdrgWSF6hsQUHX97rZ286LFUWMielldQWboehamiM6dKTIlpZy96wBsBSisXrlQOHEaqfU2oHBP1_Gx6HHLNQ',
    },
    {
      id: 'anirudh',
      name: 'Anirudh',
      languageBadge: 'Tamil • தமிழ்',
      tagline: 'High-Energy Tamil Hits',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAiFxCJmyku9_SkVzcqefrSCppkMbgUCJIzlYX5AcrBWBDhtvYLa_xctTSALYtdLxpFeRbgcp0TfIuX5fTNoSLgphJ1ZrzfIyLj8nUIVvKlzXhIwIF82A1JE9y6srXiNL-ya5jJuGSnJij_r8ex-VAuMPTpikiS-lICjtUqJNjCx81oc28qfeqMdli76C-E1UL_9VVehjHTwBsgi58FJcgHQyvzDCt4L9cdtab2rr82VL2kPI13vVu5gg',
    },
    {
      id: 'diljit-dosanjh',
      name: 'Diljit Dosanjh',
      languageBadge: 'Punjabi • ਪੰਜਾਬੀ',
      tagline: 'Global Punjabi Beats',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCkGHTm1Wp9hvKqVKOD1x2Isg_ogXVGtFi8kEzvxTHGE15PLmFzCEoUdnwSXP7F5LK9mWYE0vodD0ZT1TcXqXm5juehbcFN9EjuvC0-kGU62hi2sSw9NGx8Y0dmu2LfrQNBUM_du1VASgMmpqVDMlScBsQT6RUv3gBw8ha_D64WMxPjXzj-yjCcGeVKCNRqLm48RzucaYSc0NUCi4fRX1Qsrk1eb139tK_x5oj6a4tabeZEEaJQ1CbVtw',
    },
    {
      id: 'yesudas',
      name: 'K.J. Yesudas',
      languageBadge: 'Malayalam • മലയാളം',
      tagline: 'Celestial Classics',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDuI_0sRKBWrpervaOoVW_3_Hj9b1lf8CpqVGLbchknSCscJ14LICuW4ch0ozUAXqTQWu2tbVAD0bAd3RBVdPQYQVnAb0KcXT8kcd_AI4iy0fMZXNYoLt1ub_vHMcqgscbTojLGTLmM5uhoiSJ6aPfxh_qQPkmctvfczgJQKfX5kxAJeg5SqyV5sdBBumvqZ51LS6qtLjPCm7qjsxQvLxu-c9bUYsKGnRVDcUnt_mAEFtyL3dlZwoCslQ',
    },
    {
      id: 'the-weeknd',
      name: 'The Weeknd',
      languageBadge: 'English • Global',
      tagline: 'Global Pop & R&B',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBVbAj36Jsl7PHHgB31M6YuJX4ta-PpYrnSRRlC8hAA5u1CCI8bahc1V0NXyhNuxBWruE7sQjm3zTnx48j4Xaha8DHkJHFAPqItpDKBfPKx45iG8YFnPP8jPhd1IGPXGhlN1O4Q4DZJvdxXaJN-C7ErtCMJyBrZHrrfxNH9qjceMnPJoKFOEYPpf_bB2694fC1ED-wxVfCFDr67NylHThfaNyn2OqaxHGLT_8XRDDjtHNXSAhg3zWLxCA',
    },
    {
      id: 'vijay-prakash',
      name: 'Vijay Prakash',
      languageBadge: 'Kannada • ಕನ್ನಡ',
      tagline: 'Kannada Superhits',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDq6WFkucba0ZOv0kWEZmkA6j0shOIM0-6JtETj816KHUhbx3qKagzr-_o6nPPxd1k33fNuczqzFe3MVI-RjnqjsOhEnhj_wzYSSuY2pvzvSXzbRMB4AEMGQ0322UB1QEVYQ1ltZmWXwNMPoBmyHPP9ZouqlGRFADuwvnubbTmF74DACW6AZ5UaX7raZ3qqS6MIscUHuReI8pyXXZF65sA7gMJVDT73dN4J4jP7E8V72IQE3KTvcaWfNA',
    },
    {
      id: 'shreya-ghoshal',
      name: 'Shreya Ghoshal',
      languageBadge: 'Bengali • বাংলা',
      tagline: 'Evergreen Melodies',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDDgOyIj9qxTUJN2bxoPwOqzq9HH7Ud060-HWnVzYuZmLc7bX1aYD1G9JgzbyHBDaSJxpvmcL_6Fwx848BWxBjEN9gu1ie7yw5DT8vdbouors-tiDasghPrayTinofcnZD-kWM-G1Q9VI6wnCsQGaLvyQs774JJuNU9ZcezqiR9f-ufy1Tln3GQ6fhJkvm7pjssCrVhqSeRggaaCWqYW8rKSAuPv8a-tcs_Ye8RJwyclHsRuvT5NrF7Dg',
    },
  ];

  const toggleCard = (id: string, name: string) => {
    setSelectedIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(exists ? `Deselected ${name}` : `Selected ${name}`);
      return updated;
    });
  };

  const filteredCards = languageCards.filter(
    (card) =>
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.languageBadge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleComplete = (idsToSave: string[]) => {
    storageService.setSelectedLanguages(idsToSave);
    idsToSave.forEach((id) => {
      const currentFollowed = storageService.getFollowedArtistIds();
      if (!currentFollowed.includes(id)) {
        storageService.toggleFollowArtist(id);
      }
    });
    navigate('/home');
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pb-32 pt-safe bg-surface min-h-screen select-none overflow-y-auto no-scrollbar">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[70] px-4 py-2.5 rounded-full bg-inverse-surface/90 backdrop-blur-md text-inverse-on-surface text-body-sm shadow-xl flex items-center gap-2 animate-fadeIn whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">
            verified
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 flex flex-col relative w-full bg-surface">
        <div className="flex flex-col w-full min-w-0 pb-16">
          {/* Top Navigation & Stepper Header */}
          <div className="px-margin pt-2 pb-2 flex items-center justify-between">
            <button
              aria-label="Go back"
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-transform active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <button
              onClick={() => handleComplete(selectedIds)}
              className="text-body-md font-semibold text-on-surface-variant hover:text-on-surface transition-colors py-1 px-3 rounded-full hover:bg-surface-container cursor-pointer"
            >
              Skip
            </button>
          </div>

          {/* Title & Subtitle */}
          <div className="px-margin mt-3 flex flex-col gap-1 text-left">
            <h1 className="font-display-lg-mobile text-[30px] leading-[36px] tracking-tight text-on-surface font-bold">
              Choose your languages
            </h1>
            <p className="font-body-md text-[14px] text-on-surface-variant leading-relaxed">
              Pick the singers and sounds you love to customize your daily mixes
            </p>
          </div>

          {/* Search Bar */}
          <div className="px-margin mt-4">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                id="languageSearch"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search languages or artists..."
                type="text"
                className="w-full bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-body-md text-[14px] pl-10 pr-10 py-3 rounded-xl placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
              />
              <button
                aria-label="Voice search"
                onClick={() => showToast('Voice search listening...')}
                className="material-symbols-outlined absolute right-3.5 text-on-surface-variant hover:text-primary text-[20px] transition-colors cursor-pointer"
              >
                mic
              </button>
            </div>
          </div>

          {/* Popular Artists Quick Preview Filter Chips */}
          <div className="mt-4 pl-margin overflow-x-auto no-scrollbar flex items-center gap-2 pr-margin py-1">
            <span className="text-xs font-bold uppercase tracking-wider text-outline shrink-0 mr-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-primary">
                local_fire_department
              </span>{' '}
              Trending
            </span>
            {['Arijit Singh', 'Sid Sriram', 'Anirudh', 'Diljit Dosanjh', 'Shreya Ghoshal'].map(
              (name) => (
                <span
                  key={name}
                  onClick={() => setSearchQuery(name)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-surface-container text-on-surface whitespace-nowrap cursor-pointer hover:bg-surface-container-high transition-colors active:scale-95"
                >
                  {name}
                </span>
              )
            )}
          </div>

          {/* Section Header */}
          <div className="px-margin mt-4 flex items-center justify-between mb-4">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-bold">
              Featured Languages
            </span>
            <span
              id="selectedCount"
              className="font-label-md text-label-md text-primary font-bold bg-primary-fixed/60 px-2.5 py-0.5 rounded-full"
            >
              {selectedIds.length} Selected
            </span>
          </div>

          {/* Full Artist Cards Grid (2 columns, aspect-[4/3]) */}
          <div className="px-margin grid grid-cols-2 gap-3.5" id="languageGrid">
            {filteredCards.map((card) => {
              const isSelected = selectedIds.includes(card.id);

              return (
                <div
                  key={card.id}
                  onClick={() => toggleCard(card.id, card.name)}
                  className={`artist-card relative cursor-pointer select-none rounded-2xl overflow-hidden aspect-[4/3] transition-all duration-200 active:scale-[0.97] group flex flex-col justify-between p-3 border ${
                    isSelected
                      ? 'is-selected ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg shadow-primary/25 border-primary'
                      : 'border-outline-variant/40 shadow-sm hover:shadow-md'
                  }`}
                >
                  <img
                    alt={card.name}
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    src={card.imageUrl}
                  />
                  <div
                    className={`gradient-overlay absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-black/20 mix-blend-multiply transition-opacity ${
                      isSelected ? 'opacity-90' : 'hidden'
                    }`}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                  {/* Top Badges & Checkmark */}
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold text-white tracking-wide border ${
                        isSelected
                          ? 'bg-white/20 border-white/25 backdrop-blur-md'
                          : 'bg-black/40 border-white/20 backdrop-blur-md'
                      }`}
                    >
                      {card.languageBadge}
                    </span>
                    <div
                      className={`check-pill w-6 h-6 rounded-full bg-white text-primary flex items-center justify-center shadow-md transition-all ${
                        isSelected ? 'opacity-100 scale-100' : 'hidden'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="relative z-10 mt-auto flex flex-col text-left">
                    <h3 className="font-headline-sm text-[16px] font-bold leading-tight text-white drop-shadow-sm artist-name">
                      {card.name}
                    </h3>
                    <p className="font-body-sm text-[11px] text-white/80 font-medium tracking-wide">
                      {card.tagline}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Floating Bottom Button */}
      <div className="absolute bottom-0 left-0 right-0 p-margin bg-gradient-to-t from-surface via-surface/90 to-transparent pt-6 z-40 w-full">
        <button
          id="continueBtn"
          onClick={() => handleComplete(selectedIds)}
          className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-[0_8px_24px_rgba(91,66,243,0.35)] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <span>Continue with {selectedIds.length} Languages</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
