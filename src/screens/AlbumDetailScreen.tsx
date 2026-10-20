import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { Header } from '../components/common/Header';
import { Track } from '../types';

export const AlbumDetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentTrack, isPlaying, playTrack, togglePlayPause, setLyricsOpen } = usePlayer();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedTrackForOptions, setSelectedTrackForOptions] = useState<any | null>(null);
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);
  const [isInLibrary, setIsInLibrary] = useState<boolean>(true);
  const [isFollowingDSP, setIsFollowingDSP] = useState<boolean>(false);
  const [likedTrackIds, setLikedTrackIds] = useState<Record<string, boolean>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleTrackLike = (id: string) => {
    setLikedTrackIds((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      showToast(updated[id] ? 'Added to Liked Songs' : 'Removed from Liked Songs');
      return updated;
    });
  };

  // Exact 6 Tracks from Stitch melody_movie_album_playlist/code.html
  const albumTracks = [
    {
      id: 'pushpa-pushpa',
      title: 'Pushpa Pushpa',
      artist: 'Nakash Aziz, Deepak Blue, DSP',
      durationText: '4:18',
      quality: 'Lossless',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA80WV2wKezv6XAwcPqVilFr60vMGJ6-h0xzilWTSO1IwOlYqrFvu_xjy4iJ1OdtEMH44wsA-QrFy7oNmNYSKnOZl87MNilwMNCv_jpOFrNMoroHbTZLROKX_qK7Y60xwMr9XyQDIuWtqNS1SOCXtvPJPb9D4H3ovTQuU_iIy7TqOt9BkhwRiZYczZNCuO13PPVDHksJt28w_vZTE0Ri73r5o4ogBHKiqAh4djMnfJoq_be52gSXc4Pcg',
      hasLyrics: true,
    },
    {
      id: 'sooseki',
      title: 'Sooseki (The Couple Song)',
      artist: 'Shreya Ghoshal, Devi Sri Prasad',
      durationText: '4:21',
      quality: 'MelodyTune',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDsPiVeegk3_Jk9x0qIRtjX2mIIziqmpwo8eg0uEYIrT_ixDwxv-2jnl2i0Jl6g89e3xDeSVCrXQDIcRjeGOgf0wPQ0uKA0m74G6JTwWte4n0nKF9ZAsRPGbzFtdMupeZquu6eQx37hOk7sAOyxMdeZlhLO0pCtru3FF0y8wVMR922z009U-7-rn27fjJf8gBnBy9r3t1rGYbSbyZiiLAyvp3gZ5EVFNtVHmQo0CMVuLFq1zEoUkb-lNQ',
      hasLyrics: true,
    },
    {
      id: 'peelings',
      title: 'Peelings',
      artist: 'Devi Sri Prasad, Laxmi Dasi',
      durationText: '3:45',
      quality: 'Lossless',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAsd_MxB2Oa2JBBVtrGrNGkH6qd76EPWCSi1fS3HzPgz2Q9SgkyLIqL0d9-L2nRzFuJwDrDHbI9tr4Ogx6rp9vs6Anlj_a_5h173-u2l5-RqKF4YTfWcbAOZ2uKBJB-V63aesaVKm7rPa8aC-HWjyc6VwW_fzLgikqdD8LfaMQz4d5jzJ2pE57eFikjeQwrCuVzig8QkRP_2NErp3wcEBpJCloYMiN4upo_CiFDffLbHxUxBhHdpBQzwQ',
      hasLyrics: false,
    },
    {
      id: 'jaathara-theme',
      title: 'Jaathara Theme (Blood & Sand)',
      artist: 'Instrumental • DSP Brass & Percussion Ensemble',
      durationText: '3:12',
      quality: 'Dolby Atmos',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBhQ6kwTV5rw6g9FJCOt58AtSJlHtTgJ-_pBBms8NIRsF0ymKTdDkKJTKjMoeHvUbfxaoN4uBuzvoMh3fs74YLhfv-lMS6AzHNp3RXACUARH088ocrq1KMFJKrHe972hXA_JyBR3wuDzWWNU0CzNxIPiFGzbszL-G9MmxSBV1VeHMiO9Xk3NoicKg3z2Vp5-cqFanHtimODwKxZ3ilCSzVyM9XdumBfGARKQ9V7EWGTWq-cZ8pgC1SEHw',
      hasLyrics: false,
    },
    {
      id: 'dhammu-choopina-gunde',
      title: 'Dhammu Choopina Gunde',
      artist: 'Anurag Kulkarni, Chandrabose',
      durationText: '4:05',
      quality: 'Lossless',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB_ikTLU-FhaaKhHMHbw9--9Uy0bOmwc7Hk-xTxKBVCroIhDHNHM7wPbX0HahasxGL1D_qiVGhwYzsBg-5cRkKbNDGmKhKQi_W9SySJGQwK_xswxmGWeXkNF3ZVCtzg7rfdep_XqlZST8iVOUC-wCWWWCjFRljeNXihTzlfO4ylT3alJmvdXciOnuDhmfgMMsp-pvTi-JDvdR4MsOMUw2h-XrvtqOfJEtw2GN-2PxT0BnbQzXKmXTBLWA',
      hasLyrics: false,
    },
    {
      id: 'the-rule-climax-ost',
      title: 'The Rule Climax OST',
      artist: 'Devi Sri Prasad, Budapest Scoring Symphony',
      durationText: '4:40',
      quality: 'Dolby Atmos',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA3l8roofpTHxcxRHEnpIu04zMV8VHlUbLDhIma8KoyigPkERbrK9NwCW48ZaS5bkqzQSsE2JaE1ZHQzVRvAEnVAVi9YlwyLWx6U4kQmGp7iR0B2umaGQPVuuQSFcqT0o1TB4Dk0u3KLgWcxJq4C8bfwhfaPoIVy2YTa3kg-U8DaX1bOtsg8nvpnZJVQBXQROZskwxdWfKWiKf8Eu31QwhH-q0yk6qOPfZJAG3ln-efTtv0qOey8vMV5Q',
      hasLyrics: false,
    },
  ];

  // Exact 4 More Blockbusters by DSP from Stitch code.html
  const moreDspAlbums = [
    {
      id: 'pushpa-1',
      title: 'Pushpa: The Rise',
      subtitle: '2021 • 5 Tracks',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB9Fzy8Z931CZQLvqsPoCVolou0NR3pm-57GPRsUPQVCqHXXBDF-UEgETiPV6uXKUsE2pyagl8GN986mwZDFnZEcGfGrKcvfUMEee3bSPQeu9DI7IptiORGIKLZci443h7XZBft94vLkz6AatpHzISVXFlYLG8TulT17owdb0ly8szzBN5fGfhq_pq0G4fT_dwVKXkPTWpANQdK8MVWodyCFQiUnYDEEHvG4yb2INp_v0p3GvqEvFn0Zg',
    },
    {
      id: 'rangasthalam',
      title: 'Rangasthalam',
      subtitle: '2018 • 6 Tracks',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCfatw--MWmNnzjuQNoBHKYOwRXtwOFw5jyOBjyqVz-0tdLnvDogzPjoINSDHqn2CaVtuVGSRj2D3WldEbfvLXhSrc9kAWNjL6fWU9d1qj1ufCapDvrSEaALH443USLEN5O9N9zfGtePimhQLacSjI__TzEulvyQNtpGNxGwW3AefAZmwaP8Uh3KeDRt1x5IJBP67jU2ZaNKdq9rybQ1ozOLlV7DHDO4WybrZPBCzBNwUBlVg6zCjUcRQ',
    },
    {
      id: 'arya-2',
      title: 'Arya 2',
      subtitle: '2009 • 8 Tracks',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDsmpKGGw6KUuaoYP0M2pzC-SNpdpymsqpB0q0r8HPuTVwznaI9qk8Zpgbr16TfhtDfb26pmdV2TxxHuGjDSNlS6wIWtVMQvEuHhR7mRjcy_Fxy5MfzpKCIQ0f-kNJInIVSnUxZ-CFgQn4TmSt6-pRjN40CjFzbt8Z9zmIgD9IbKV81YaB4dRQu5F1NaEWpp4q71tMbfFEoNoB8gWZxsZixNyMdqWWLz5auk7lheTkkXCQC6_hCIOB0wQ',
    },
    {
      id: 'srimanthudu',
      title: 'Srimanthudu',
      subtitle: '2015 • 6 Tracks',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBGM8OdaDJfDVTk6gpFs2_1kXRMLhvl1luRsAOUc08ypbIAcZDnMDj0pFE8bF2TXUquGJSzCDKq7t-Xcv9UPq1ZLRgEUOtJoon5u8WzI2cO3hpcDG9dmiWZ5fegP8MYKBmXbHOWnCZmzxtmkpjpq4dGEGOCiM3q1dFVffR1EOjSJ0tocdBKg9RDQXtbqFekda0rxavSeeJh9l5rR-EanjOixe3p116VQ2UZm7Rqm-KrHEFvd_9C-dXDIA',
    },
  ];

  const handleTrackClick = (track: (typeof albumTracks)[0]) => {
    const trackObj: Track = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      duration: 258,
      coverUrl: track.coverUrl,
      genre: 'telugu',
      movieOrAlbum: 'Pushpa 2: The Rule',
    };

    if (currentTrack.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(trackObj);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-16 pb-[140px] bg-surface select-none">
      {/* Top Header Matching Stitch Header */}
      <Header />

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[70] px-4 py-2.5 rounded-full bg-inverse-surface/90 backdrop-blur-md text-inverse-on-surface text-body-sm shadow-xl flex items-center gap-2 animate-fadeIn whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal / Bottom Sheet for Track Options */}
      {selectedTrackForOptions && (
        <div
          onClick={() => setSelectedTrackForOptions(null)}
          className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-end justify-center animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-surface-container-lowest rounded-t-3xl p-5 shadow-2xl"
          >
            <div className="w-12 h-1.5 bg-surface-variant rounded-full mx-auto mb-4"></div>
            <div className="flex items-center gap-3 pb-4 border-b border-surface-container">
              <img
                alt={selectedTrackForOptions.title}
                className="w-12 h-12 rounded-lg object-cover"
                src={selectedTrackForOptions.coverUrl}
              />
              <div className="flex-1 min-w-0 text-left">
                <h4 className="font-title-md text-on-surface truncate font-bold">
                  {selectedTrackForOptions.title}
                </h4>
                <p className="font-body-sm text-on-surface-variant truncate">
                  {selectedTrackForOptions.artist}
                </p>
              </div>
              <button
                onClick={() => setSelectedTrackForOptions(null)}
                className="w-9 h-9 rounded-full bg-surface-container text-on-surface flex items-center justify-center active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-1 pt-3">
              <button
                onClick={() => {
                  showToast(`Added "${selectedTrackForOptions.title}" to Queue`);
                  setSelectedTrackForOptions(null);
                }}
                className="flex items-center gap-3.5 py-3 px-2 rounded-xl hover:bg-surface-container text-left active:scale-98 transition-all"
              >
                <span className="material-symbols-outlined text-primary text-[22px]">queue_music</span>
                <span className="font-body-md text-on-surface font-medium">Play Next / Add to Queue</span>
              </button>
              <button
                onClick={() => {
                  showToast(`Saved to Custom Playlist`);
                  setSelectedTrackForOptions(null);
                }}
                className="flex items-center gap-3.5 py-3 px-2 rounded-xl hover:bg-surface-container text-left active:scale-98 transition-all"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[22px]">playlist_add</span>
                <span className="font-body-md text-on-surface font-medium">Add to Custom Playlist</span>
              </button>
              <button
                onClick={() => {
                  showToast('Song Link copied to clipboard');
                  setSelectedTrackForOptions(null);
                }}
                className="flex items-center gap-3.5 py-3 px-2 rounded-xl hover:bg-surface-container text-left active:scale-98 transition-all"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[22px]">share</span>
                <span className="font-body-md text-on-surface font-medium">Share Song Link</span>
              </button>
              <button
                onClick={() => {
                  showToast('Viewing DSP credits & Dolby master certificates');
                  setSelectedTrackForOptions(null);
                }}
                className="flex items-center gap-3.5 py-3 px-2 rounded-xl hover:bg-surface-container text-left active:scale-98 transition-all"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[22px]">person</span>
                <span className="font-body-md text-on-surface font-medium">View Artist & Credits</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col relative w-full bg-surface">
        <div className="flex flex-col w-full">
          {/* Dynamic Gradient Glow Behind Header */}
          <div className="relative w-full overflow-hidden pb-4">
            <div className="absolute -top-20 -left-12 w-80 h-80 rounded-full bg-primary-container/20 blur-3xl pointer-events-none"></div>
            <div className="absolute top-10 -right-16 w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>

            {/* Poster Art Plaque */}
            <div className="px-margin pt-2">
              <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-[0_16px_36px_rgba(91,66,243,0.18)] bg-surface-container-high group">
                <img
                  alt="Pushpa 2: The Rule Poster"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe3zH4ND4-bZ3Z-ZhSrNzgGBZtjwWA3tIYl_G1LeN5nOmOjMIMJN045Km6zBT4x7Rh1-GN0sLoZwkcH_tsniD6eQVAixXwf_tr43DrCmks_2fw6FGEocjC2N8YXzfKGIvVVsiJzeZZw9SK86EQFXML719edvd8AQm74H5ysFgtP7v_Ki5TeSHwJE2gIvr38i9CzqpCVe2u9d9Uw1l6i4aZuSI9jEGWJfS8y0GP1mR2gbVSfIIBIdmnHQ"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-inverse-surface/40"></div>

                {/* Back / Share / More Buttons */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
                  <button
                    aria-label="Go back"
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full bg-inverse-surface/60 backdrop-blur-md text-surface flex items-center justify-center border border-surface/20 shadow-[0_2px_10px_rgba(26,26,39,0.06)] active:scale-90 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[22px]">arrow_back</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      aria-label="Share album"
                      onClick={() => showToast('Album share link copied!')}
                      className="w-10 h-10 rounded-full bg-inverse-surface/60 backdrop-blur-md text-surface flex items-center justify-center border border-surface/20 shadow-[0_2px_10px_rgba(26,26,39,0.06)] active:scale-90 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[20px]">share</span>
                    </button>
                    <button
                      aria-label="More options"
                      onClick={() => setSelectedTrackForOptions(albumTracks[0])}
                      className="w-10 h-10 rounded-full bg-inverse-surface/60 backdrop-blur-md text-surface flex items-center justify-center border border-surface/20 shadow-[0_2px_10px_rgba(26,26,39,0.06)] active:scale-90 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                  </div>
                </div>

                {/* Dolby Atmos Badge */}
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-inverse-surface/60 backdrop-blur-md text-surface flex items-center gap-1.5 border border-surface/20 shadow-sm z-10">
                  <span
                    className="material-symbols-outlined text-secondary-fixed text-[15px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    graphic_eq
                  </span>
                  <span className="font-label-sm text-[11px] font-semibold tracking-wider uppercase text-surface">
                    Dolby Atmos
                  </span>
                </div>
              </div>
            </div>

            {/* Album Metadata & Title */}
            <div className="px-margin w-full mt-4 text-left">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-[11px] uppercase tracking-wider font-bold">
                  Original Motion Picture Soundtrack
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">• 2024</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface mt-1 leading-tight tracking-tight font-bold">
                Pushpa 2: The Rule
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Telugu • 6 Tracks • 24 mins • Mythri Movie Makers
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant/80 mt-1 line-clamp-2">
                Music: <span className="font-semibold text-on-surface">Devi Sri Prasad (DSP)</span> • Starring: Allu Arjun, Rashmika Mandanna, Fahadh Faasil • Dir: Sukumar
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-space-sm pt-space-xs">
                <div className="flex items-center gap-space-xs">
                  <button
                    onClick={() => {
                      setIsDownloaded(!isDownloaded);
                      showToast(isDownloaded ? 'Removed album downloads' : 'Downloaded album for offline play');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all active:scale-95 font-semibold text-xs ${
                      isDownloaded
                        ? 'bg-primary text-white'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isDownloaded ? 'check_circle' : 'download_for_offline'}
                    </span>
                    <span>{isDownloaded ? 'Downloaded' : 'Download'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsInLibrary(!isInLibrary);
                      showToast(isInLibrary ? 'Removed from library' : 'Saved to your library');
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all active:scale-95 font-semibold text-xs ${
                      isInLibrary
                        ? 'bg-secondary-fixed text-on-secondary-fixed'
                        : 'bg-surface-container-low text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isInLibrary ? 'bookmark_added' : 'playlist_add'}
                    </span>
                    <span>{isInLibrary ? 'Saved' : 'Library'}</span>
                  </button>

                  <button
                    aria-label="Cast audio"
                    onClick={() => showToast('Casting audio to Living Room Soundstage')}
                    className="w-8 h-8 rounded-full bg-surface-container-low text-on-surface-variant flex items-center justify-center active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">cast</span>
                  </button>
                </div>

                <div className="flex items-center gap-1 text-tertiary">
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    trending_up
                  </span>
                  <span className="font-label-sm text-label-sm font-semibold">18.4M Plays</span>
                </div>
              </div>

              {/* Tags Carousel */}
              <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar py-0.5">
                <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1 whitespace-nowrap">
                  <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                  Official OST
                </span>
                <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1 whitespace-nowrap">
                  <span className="material-symbols-outlined text-[14px] text-tertiary">high_quality</span>
                  24-bit / 96kHz Lossless
                </span>
                <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1 whitespace-nowrap">
                  <span className="material-symbols-outlined text-[14px]">subtitles</span>
                  Live Telugu & Hindi Lyrics
                </span>
              </div>
            </div>
          </div>

          {/* Songs & Soundtracks List Section */}
          <div className="px-margin mt-space-xs flex flex-col">
            <div className="flex items-center justify-between py-space-xs">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Album Songs</h2>
              <button
                onClick={() => showToast('Sorted by Popularity')}
                className="font-label-md text-label-md text-primary flex items-center gap-0.5 active:scale-95 transition-transform font-semibold"
              >
                <span>Sort</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>
            </div>

            {/* Tracklist Items */}
            <div className="flex flex-col gap-1.5 mt-1">
              {albumTracks.map((track, index) => {
                const isCurrent = currentTrack.id === track.id || (index === 0 && currentTrack.id === 'pushpa-pushpa');
                const isTrackLiked = !!likedTrackIds[track.id];

                return (
                  <div
                    key={track.id}
                    onClick={() => handleTrackClick(track)}
                    className={`p-space-xs rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-primary-fixed/30 ring-1 ring-primary/20'
                        : 'hover:bg-surface-container'
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high">
                      <img
                        alt={track.title}
                        className="track-thumb w-full h-full object-cover"
                        src={track.coverUrl}
                      />
                      {/* Animated Sound Waveform on Current Track */}
                      {isCurrent && isPlaying && (
                        <div className="soundwave-overlay absolute inset-0 bg-primary/40 flex items-center justify-center">
                          <div className="flex items-end justify-center gap-[2.5px] h-4">
                            <span className="w-[2.5px] h-4 bg-on-primary rounded-full animate-pulse"></span>
                            <span className="w-[2.5px] h-2 bg-on-primary rounded-full animate-bounce"></span>
                            <span className="w-[2.5px] h-3 bg-on-primary rounded-full animate-pulse"></span>
                            <span className="w-[2.5px] h-1.5 bg-on-primary rounded-full"></span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-title-md text-title-md truncate ${
                            isCurrent ? 'text-primary font-bold' : 'text-on-surface font-semibold'
                          }`}
                        >
                          {track.title}
                        </span>
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-[10px] font-semibold tracking-wider whitespace-nowrap uppercase leading-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                            Playing
                          </span>
                        )}
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                        {track.artist}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`font-label-sm text-[10px] font-semibold ${
                            track.quality === 'MelodyTune'
                              ? 'text-secondary-container'
                              : track.quality === 'Dolby Atmos'
                              ? 'text-primary'
                              : 'text-tertiary'
                          }`}
                        >
                          {track.quality}
                        </span>
                        <span className="text-on-surface-variant text-[10px]">•</span>
                        <span className="font-label-sm text-[10px] text-on-surface-variant">
                          {track.durationText}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {track.hasLyrics ? (
                        <button
                          aria-label="Song lyrics"
                          onClick={() => {
                            handleTrackClick(track);
                            setLyricsOpen(true);
                          }}
                          className="w-8 h-8 rounded-full text-primary hover:bg-surface-container flex items-center justify-center active:scale-90 transition-transform"
                        >
                          <span className="material-symbols-outlined text-[18px]">lyrics</span>
                        </button>
                      ) : (
                        <button
                          aria-label="Like song"
                          onClick={() => toggleTrackLike(track.id)}
                          className="w-8 h-8 rounded-full text-on-surface-variant hover:text-secondary-container flex items-center justify-center active:scale-125 transition-transform"
                        >
                          <span
                            className={`material-symbols-outlined text-[18px] ${
                              isTrackLiked ? 'text-secondary-container' : ''
                            }`}
                            style={isTrackLiked ? { fontVariationSettings: "'FILL' 1" } : undefined}
                          >
                            {isTrackLiked ? 'favorite' : 'favorite_border'}
                          </span>
                        </button>
                      )}

                      <button
                        aria-label="Track options"
                        onClick={() => setSelectedTrackForOptions(track)}
                        className="w-8 h-8 rounded-full text-on-surface-variant hover:text-on-surface flex items-center justify-center active:scale-90 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Music Director & Cast Spotlight Card */}
          <div className="px-margin mt-space-lg">
            <div className="relative rounded-2xl p-space-md bg-gradient-to-br from-surface-container to-surface-container-high overflow-hidden shadow-[0_4px_16px_rgba(91,66,243,0.06)]">
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                  <img
                    alt="Devi Sri Prasad (DSP)"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_d1gpVAg8TQiMJyOE1uRC_Ipvc2HGexdxhjKXRcaEAyzz2c0NQdf0qfNJARBSWMSQyhFdUa1Ojoi3nMMfZtYUzM7PN_1dxNvVBdVsbX1FfLgK_N15MD9VstVSr4LVABQF0JQrUk_jBQDeS3IMcULa_-pSXvNMFJGnY_SpacYtKEjmBSHHKjVEVhZHLtHD1BuhGjZOlBFomZnxRd4-8-1XMa0NUZYHFqY9huQF3-mT5FEYPDbjXvzRXA"
                  />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
                    Music Director
                  </span>
                  <h3 className="font-title-md text-title-md text-on-surface font-bold truncate">
                    Devi Sri Prasad
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Rockstar DSP • 14.8M Monthly Listeners
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsFollowingDSP(!isFollowingDSP);
                    showToast(isFollowingDSP ? 'Unfollowed DSP' : 'Following Rockstar DSP');
                  }}
                  className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md font-semibold active:scale-95 transition-all shadow-sm ${
                    isFollowingDSP
                      ? 'bg-surface-container-lowest text-primary ring-1 ring-primary/30'
                      : 'bg-primary text-on-primary'
                  }`}
                >
                  {isFollowingDSP ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
          </div>

          {/* More OST Soundtracks by Devi Sri Prasad */}
          <div className="mt-space-lg flex flex-col">
            <div className="px-margin flex items-center justify-between pb-space-xs">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                More Blockbusters by DSP
              </h2>
              <button
                onClick={() => showToast('Opening Devi Sri Prasad full discography')}
                className="font-label-md text-label-md text-primary font-semibold hover:underline"
              >
                View All
              </button>
            </div>

            {/* Horizontal Swipeable Discography Carousel */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar px-margin pt-1 pb-space-sm">
              {moreDspAlbums.map((item) => (
                <div
                  key={item.id}
                  onClick={() => showToast(`Playing ${item.title}`)}
                  className="flex flex-col w-36 flex-shrink-0 cursor-pointer group active:scale-95 transition-transform text-left"
                >
                  <div className="w-36 h-36 rounded-xl overflow-hidden bg-surface-container-high shadow-[0_4px_14px_rgba(26,26,39,0.08)] relative">
                    <img
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src={item.coverUrl}
                    />
                    <span className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-surface-container-lowest/90 text-primary flex items-center justify-center shadow-sm">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        play_arrow
                      </span>
                    </span>
                  </div>
                  <span className="font-title-md text-[14px] leading-tight text-on-surface font-semibold mt-2 truncate">
                    {item.title}
                  </span>
                  <span className="font-body-sm text-[12px] text-on-surface-variant truncate">
                    {item.subtitle}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Copyright, Producer Info & Legal Note */}
          <div className="px-margin mt-space-md mb-space-md text-left text-on-surface-variant/70">
            <p className="font-label-sm text-[11px] leading-relaxed">
              ℗ 2024 Mythri Movie Makers & T-Series under exclusive license to Melody SoundCore™. All rights reserved. Mastered in 96kHz 24-bit Lossless Studio Audio.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
