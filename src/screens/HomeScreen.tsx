import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { usePlayer } from '../context/PlayerContext';
import { MOCK_TRACKS } from '../data/mockData';
import { Track } from '../types';
import { storageService } from '../services/storageService';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentTrack, isPlaying, playTrack, togglePlayPause, isLiked, toggleLike } = usePlayer();

  const userProfile = storageService.getUserProfile();
  const userName = userProfile.name || 'Riyad';
  const firstName = userName.split(' ')[0] || userName;

  const [activeGenre, setActiveGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [waveWiggle, setWaveWiggle] = useState<boolean>(false);
  const [historyCleared, setHistoryCleared] = useState<boolean>(false);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({
    'sid-sriram': false,
    'arijit-singh': true,
    'anirudh': false,
    'shreya-ghoshal': false,
    'devi-sri-prasad': false,
  });

  const filterChips = [
    { id: 'all', label: 'All Vibes' },
    { id: 'telugu', label: 'Telugu 🎧' },
    { id: 'hindi', label: 'Bollywood ✨' },
    { id: 'tamil', label: 'Tamil 🔥' },
    { id: 'english', label: 'Indie & English' },
  ];

  // 4 Trending Hits directly from Stitch melody_home_discover
  const trendingHits = [
    {
      id: '1',
      title: 'Kurchi Madathapetti',
      artist: 'Thaman S, Sri Krishna • Guntur Kaaram',
      durationText: '3:38 mins',
      tag: '#1 Telugu',
      genre: 'telugu',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDsY8F9Q-oqDxstZd09gLnDoG4whuaP-_DM_FDi9oOjNqGnTpg_-59mlgY3Kz7K1ZvT4YHB_eo0G1VPAnVEj0WviRSWZCB4wDDxLFl55l56nOcqjoo9-cXQnoSfsxfAgQ-_iWj1XNj4pE95CAGJ4gMZLTq-_dqoqhlzjx1SxHpX5VCsZT3lsBySkqH39QqG56SxOIZaxiOSmLxA-NgiLOj_Evid0ZAkuK87ucUPZ8WqtCJ41HK5pVVXDw',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=electronic-future-beats-117997.mp3',
    },
    {
      id: '2',
      title: 'Chaleya',
      artist: 'Arijit Singh, Shilpa Rao • Jawan',
      durationText: '3:20 mins',
      tag: 'Top Global',
      genre: 'hindi',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCCHq9T7hVT0Z-VCjOYIF2uiyjLY7ORWcjcIT-gIGC1VgtfMX6R-abZdfwWosOtudIQe1qx6zpa1xIGSCOO7x27PGsQZCh1PPOAPPbLLWBNk3Tx9eO0dO5bHqGnGjH8Bktsk-uImaIfOvAb6pj86cdmzWB2GIZl36TIFZq9v-eZ_wX7yR2G0eHZnlM3z5IfUpILGMXTpAbyjlzNXyTEFm_nyzPuMLBFpvvbRyzTtTt66GzMGauR99XlCw',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3',
    },
    {
      id: '3',
      title: 'Ta Takkara',
      artist: 'Santhosh Narayanan • Kalki 2898 AD',
      durationText: '3:42 mins',
      tag: 'Trending',
      genre: 'telugu',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDWqXvrOtab-j0sC7hA09bgpwC7on6N3ls1sb7oN1YDOT9koiS52dKU2duMWFRkgSSxnTZn03tgiHYs5OUVqWGyI7cKLJx1RS31u52HmRmreNRcw5tGLyu7ROpSwVRGt4VldWc8k8X7PfmVKh7iGYiP3yCaBJ2AYj15I1oj75mS0Zw10-yVN12R7lIZCca23uIYPjb3kURP6Cm_H0DSEKAF2hlD9vxlnomXXwhN84Z46bWJhGgD3vAeag',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=tomp3cc-sound-of-the-future-112199.mp3',
    },
    {
      id: '4',
      title: 'Kesariya',
      artist: 'Arijit Singh, Pritam • Brahmāstra',
      durationText: '4:28 mins',
      tag: 'Soulful',
      genre: 'hindi',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC2RQqfWGJAWJe-4YLzjbmiK88zzdl0JS-Tcd4CpabaD30QmeibSxbNWigdzdYSTdKSo4QqPc6DezdDEFetfaw-9DDliC2ZcV0rZFbZiJIR0zMYUZqBwxZyCc3iGwNQ7O-yLe7yvy7mBUDx5XISGCxqlLyAYJ50sh7rYCMu_RmR5bylu1BAbEwvM_n5RWQI6nfO3dGPYCUk4FNicvqkcgx1BL_jO1SQEhogkqQONaI7eV3ucyjMMZRQjg',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=lofi-study-112191.mp3',
    },
  ];

  // 3 Recently Played tracks from Stitch melody_home_discover
  const recentPlayedList = [
    {
      id: '5',
      title: 'Samajavaragamana',
      artist: 'Sid Sriram • Ala Vaikunthapurramuloo',
      statusText: 'Playing now • 1:45 remaining',
      isPlayingNow: true,
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD1YRagYFH4WjVIrlCgPpkAF_YM7suouUbHYdgGKU6gtLOYWtYEPXPwLGrwbLA2cl8C7_fMOVPpo94O0l7TC3ADCAx0mJljuCdv1LRhTZpeAirFcIe9k1KOaf2i3lTvbqn3c8e53cODnQ_O0bRWEM-2Ucev1lkGXbDTty_glQjv8_RYREy4FExV9ZvFuzZBqQlTQtzY8n_4Yk0CVPSpUc0z_Q0AnlA6LuQpwjqSf2FKy-iHTZmyrcNOJw',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=lofi-study-112191.mp3',
    },
    {
      id: '6',
      title: 'Jawan Title Track',
      artist: 'Anirudh Ravichander • Jawan',
      statusText: 'Finished • Played 2 hrs ago',
      isPlayingNow: false,
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBOquY11bQIe5tJsGEcZJn9G4iv7keEtn2RKxRzbfg7AYYtMvrFD4zXdNIUVFXSSN6NX9rUiXy9Wo9tX2hV6Z_n96-tPuj8qeqlgqryFslRcWQjer6V7bfs9WJxm5xw5WNluE-yDqNqAzoWCZnoGOqFlt7W7xdJzkNMAM4ae7cmucZW5PFPKajkLHjLkfcP0Mqe_V_hdDSmNiFCvPJ1Y1C77acm3Ig42Ua-1mTqV_fXAJrjucoq-ipfsQ',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=tomp3cc-sound-of-the-future-112199.mp3',
    },
    {
      id: '7',
      title: 'Inkem Inkem Inkem Kaavaale',
      artist: 'Sid Sriram, Gopi Sundar • Geetha Govindam',
      statusText: '2:14 remaining',
      isPlayingNow: false,
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDmigC7mUDVEcBZRIhFoqZfBKpO-3ir9rAZ72Zlk11htbHZY6fQTS3QYbDQ0Vy9c9kkqivacTsedPMGEGreACQxn7n1e95-LsbsymUYyZT-WpTW9bR2wXTHhOLy8YewNEw5WfuDAaK8UHobRFx3U_k_A_D9WRSgwPU5EbJqqgxQfNUXHjQQutnEdyvNAoIaZh60sTlPzhTHkA3IXIiBuPh5vZ-OjNhlMawW8-g-1BoINYk_wJ6s5YXtHQ',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3',
    },
  ];

  // 5 Recommended Artists from Stitch melody_home_discover
  const recommendedArtists = [
    {
      id: 'sid-sriram',
      name: 'Sid Sriram',
      role: 'Playback & Carnatic',
      bgPlateClass: 'bg-tertiary-fixed -rotate-3',
      portraitUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBPQHlmtGP8nNqTZaSXp9acvc8Cni9JM9pYKDK2cv4MuGvPFU30JLP4O2Kq6tXjHNETiIay80MvYgPylhziJPL-W71EohGFnpQYjSuRWqLKhOlx9AWFTRVVliwMDlSte-0oBhljWCESk3a1QgLXWAxykYUpnQ4sSFOoZqVbYfGrYatjkjMUzhEf-cQaJrw5hlbAUUbdG7PtgSVu12Aw0oid-SYqrqY-4zSOfEz2lUNBIxOMoOly0cUBQg',
      doodle: (
        <svg className="absolute -top-1 -right-1 w-8 h-8 text-secondary-container pointer-events-none" viewBox="0 0 40 40">
          <path d="M5 20 Q 20 5, 35 20 Q 20 35, 5 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
        </svg>
      ),
    },
    {
      id: 'arijit-singh',
      name: 'Arijit Singh',
      role: 'Bollywood Soul',
      bgPlateClass: 'bg-secondary-fixed rotate-3',
      portraitUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAfUSvtRzkPeYHmd4rxAwHSu06XV4pOYjQYlizjsuIua6o9pMCEuJSzk6S9q3kejmC_6_mR0x0VzCD0fk86Fbx7VucXc_BSs6uWyEPeQQdk8LYUF_milIksiUeCdXTcKMttuO81TvMl5Np1l3sTL9_IlPvCNFss57d_057yVVa9AWOR_nD0m20lGxozyLRSASdUV1aoSbkjol9kHYDIqkaF0AQO5t-9IEMxgiCD3XvkFdREToT5s0fTxA',
      doodle: (
        <svg className="absolute -bottom-1 -left-1 w-7 h-7 text-primary pointer-events-none" viewBox="0 0 30 30">
          <circle cx="15" cy="15" fill="none" r="10" stroke="currentColor" strokeDasharray="4 3" strokeWidth="2"></circle>
        </svg>
      ),
    },
    {
      id: 'anirudh',
      name: 'Anirudh',
      role: 'Rockstar Beats',
      bgPlateClass: 'bg-primary-fixed -rotate-6',
      portraitUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC_NGMLLyuoG3e9jU5pJQBg8eXV7iGwreWCJ19UIiBD6TRW9CbSJH5EkXUXSBVMMlVQ76Iwv8fMmwPhjSz9mEQrzYnEtvW3Sd5tlHHwDEI7hVYJoHeRMqnIN5LXOKw6MM1icpYJBBGfqeWLB_MKG4-z3nmo-Ym4bXZjnxaGggrF5Ju9AHncxvgvhRZBaqxaBCbXE5O3rxd-pDMzgREQnOkQdkxt7OG2FoZNS4v9cbwuF4FXGwFdW-WANg',
      doodle: (
        <div className="absolute top-0 right-1 w-4 h-4 text-secondary-container">
          <span className="material-symbols-outlined text-[18px]">flare</span>
        </div>
      ),
    },
    {
      id: 'shreya-ghoshal',
      name: 'Shreya Ghoshal',
      role: 'Melody Queen',
      bgPlateClass: 'bg-[#FFE5B4] rotate-4',
      portraitUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCVcISLRM6TotRr-NaOBQMuaBteuCaHUoWA8T2v6tmM_uCX7bL4TYxKVzZRZPh_vIzKJ0CnD8iugJaziAxzuhNS19aVddv4e8H0F-7GKuaAxwshZYEYf_8E9cbIEzBERWrf0aH88zjeaZCyekgMo9S8YnAXb5NI_AnBgMTTDGniZi2TAPQseXK-CEqGX3A9j6vGWenkGdIQ6_IKFLkwjEX_es0ewy1HoumHdKyxZzAibvVjJRdt2s6GDQ',
    },
    {
      id: 'devi-sri-prasad',
      name: 'Devi Sri Prasad',
      role: 'Mass Maestro',
      bgPlateClass: 'bg-tertiary-fixed-dim -rotate-2',
      portraitUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDDWwak3Yn-E-wuUtmEV5RYEDCARYBfFPx-1wcKmp8djyGlqM0hGXwO6YQIaFwpQSIJxtZJaxEzBOZnAhIsAXUYDTC8WzFalD3WYEJumpMILAxVK_kk70mlX1RosNLPMif607fKnZofZ8sX8NXMFSL80uspebQ8aHJjSYBsIG7H6AZvUlTGF13ZSlNVX3V4Pjx1pKIX6kaxz8NMz1plPVo4rxagYV_5lFRj52tIMg9x2hSva8xSDiCuuA',
    },
  ];

  const handlePlaySong = (song: {
    id: string;
    title: string;
    artist: string;
    coverUrl: string;
    audioUrl?: string;
  }) => {
    const trackToPlay: Track = {
      id: song.id,
      title: song.title,
      artist: song.artist,
      movieOrAlbum: 'Melody Hits',
      duration: 218,
      coverUrl: song.coverUrl,
      audioUrl: song.audioUrl || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=electronic-future-beats-117997.mp3',
      genre: 'telugu',
    };

    if (currentTrack.id === song.id) {
      togglePlayPause();
    } else {
      playTrack(trackToPlay, MOCK_TRACKS);
    }
  };

  const toggleFollow = (artistId: string) => {
    setFollowingMap((prev) => ({
      ...prev,
      [artistId]: !prev[artistId],
    }));
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-16 pb-[140px] bg-surface select-none">
      <Header />

      <main className="flex flex-col w-full">
        {/* Top Greeting & Search Zone (Electric Lavender Surface Accent) */}
        <section className="px-margin pt-space-sm pb-space-md flex flex-col gap-space-md">
          {/* Header Greeting with Personal Touch & Doodle Accent */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
                  Hey {firstName}!
                </span>
                <span
                  onClick={() => {
                    setWaveWiggle(true);
                    setTimeout(() => setWaveWiggle(false), 400);
                  }}
                  id="wave-emoji"
                  className={`text-xl inline-block origin-bottom-right transition-transform cursor-pointer ${
                    waveWiggle ? 'rotate-45 scale-125' : 'hover:rotate-12 active:rotate-45'
                  }`}
                >
                  👋
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Your next favourite starts here 🎵
              </p>
            </div>

            {/* Quick Action / Mood Sparkle Badge */}
            <button
              aria-label="Mood Station"
              id="mood-station-btn"
              onClick={() => navigate('/onboarding')}
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shadow-sm hover:scale-105 active:scale-90 transition-all cursor-pointer"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </button>
          </div>

          {/* Expressive Pill Search Bar */}
          <div className="relative w-full flex items-center bg-surface-container rounded-full px-space-md py-space-sm shadow-[0_4px_16px_rgba(91,66,243,0.05)] focus-within:bg-surface-container-lowest focus-within:shadow-[0_6px_20px_rgba(91,66,243,0.12)] transition-all">
            <span className="material-symbols-outlined text-outline text-[22px] mr-space-xs">
              search
            </span>
            <input
              id="main-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Telugu, Bollywood, artists..."
              className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
              type="text"
            />
            <button
              aria-label="Audio & Filters"
              id="search-filter-btn"
              onClick={() => navigate('/search')}
              className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-primary transition-colors flex-shrink-0 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>
          </div>

          {/* Language Quick-Filter Chips */}
          <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar -mx-margin px-margin py-1">
            {filterChips.map((chip) => {
              const isActive = activeGenre === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setActiveGenre(chip.id)}
                  className={`lang-chip px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all duration-200 flex-shrink-0 active:scale-95 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Editorial Spotlight Hero: Telugu Chartbusters 2024 */}
        <section className="px-margin mb-space-lg" data-genre="telugu">
          <div className="relative w-full rounded-xl overflow-hidden bg-gradient-to-br from-tertiary-fixed via-[#FFE29A] to-secondary-fixed shadow-[0_12px_32px_rgba(254,93,57,0.18)] p-space-md flex flex-col justify-between min-h-[220px]">
            {/* Whimsical Rainbow / Audio Wave Arches Graphic */}
            <div className="absolute -top-10 -right-8 w-44 h-44 rounded-full pointer-events-none opacity-80">
              <svg className="w-full h-full" viewBox="0 0 160 160">
                <circle cx="80" cy="80" fill="none" opacity="0.4" r="70" stroke="#5B42F3" strokeDasharray="14 8" strokeWidth="10"></circle>
                <circle cx="80" cy="80" fill="none" opacity="0.6" r="54" stroke="#FE5D39" strokeWidth="12"></circle>
                <circle cx="80" cy="80" fill="none" opacity="0.7" r="38" stroke="#155544" strokeWidth="10"></circle>
                <circle cx="80" cy="80" fill="#FE5D39" r="22"></circle>
              </svg>
            </div>

            {/* Playful Cutout Halo & Doodles Behind Artist */}
            <div className="absolute right-3 bottom-0 w-44 h-48 pointer-events-none flex items-end justify-center">
              <div className="absolute bottom-0 w-36 h-40 bg-tertiary-fixed-dim/70 rounded-t-full -z-0"></div>
              <img
                alt="Telugu Chartbusters"
                className="relative z-10 w-40 h-44 object-contain object-bottom drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF_3Q1gpSrNvrNkdJBawGlPvnFS8Xvl3W-2LfP9OLYPaEBXkUQH_u96RUREjsYLw62E_OYC6Nwj7wgSSEsoEU_9e1dDyumCK2f_YovzWeNwcMY3WAW71Yilawc3dvOIT5Jo9FTKfkM0PPertgALyIlVUx0xEmmmi6YafkbbdYTYH6cU328qz3pz1DeLitXXQ454Vas-VyW1l-4H7f2j3d-pNWXxGzvcDx4U_YKI3DysHy8iioy8ymXqw"
              />
              <div className="absolute top-4 left-2 flex gap-1 z-20">
                <span className="w-1 h-3 bg-secondary-container rounded-full rotate-[-15deg]"></span>
                <span className="w-1 h-4 bg-primary rounded-full rotate-[-5deg]"></span>
                <span className="w-1 h-2 bg-secondary-container rounded-full rotate-[12deg]"></span>
              </div>
            </div>

            {/* Hero Card Typography & Badges */}
            <div className="relative z-20 max-w-[58%] flex flex-col gap-space-xs">
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-on-secondary-fixed text-surface font-label-sm text-label-sm tracking-wider uppercase font-bold">
                  Curated Mix
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-container"></span>
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-secondary-fixed leading-tight tracking-tight mt-1 font-bold">
                Telugu Chartbusters
              </h2>
              <p className="font-body-sm text-body-sm text-on-secondary-fixed-variant font-medium">
                Top 50 high-octane mass beats &amp; soulful acoustic hits of 2024.
              </p>
            </div>

            {/* Floating Primary Play Pill */}
            <div className="relative z-20 flex items-center justify-between pt-space-md">
              <div className="flex items-center gap-space-xs bg-surface/70 backdrop-blur-md px-3 py-1 rounded-full">
                <span className="material-symbols-outlined text-[16px] text-tertiary">
                  graphic_eq
                </span>
                <span className="font-label-sm text-label-sm text-on-surface font-medium">
                  Updated Today • 3.2M Plays
                </span>
              </div>
              <button
                aria-label="Play Telugu Chartbusters"
                id="hero-play-btn"
                onClick={() => handlePlaySong(trendingHits[0])}
                className="w-13 h-13 px-4 py-3 rounded-full bg-secondary-container text-on-secondary flex items-center justify-center gap-1.5 shadow-[0_6px_20px_rgba(254,93,57,0.4)] active:scale-95 transition-all group cursor-pointer hover:shadow-xl"
              >
                <span
                  className="material-symbols-outlined text-[24px] hero-icon"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_arrow
                </span>
                <span className="font-label-lg text-label-lg pr-1 hero-text font-bold">Play</span>
              </button>
            </div>
          </div>
        </section>

        {/* Horizontal Carousel: Trending Telugu & Bollywood Hits */}
        <section className="mb-space-lg">
          <div className="px-margin flex items-center justify-between mb-space-sm">
            <div className="flex items-center gap-space-xs">
              <div className="w-2.5 h-6 rounded-full bg-secondary-container"></div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Trending Hits
              </h3>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="font-label-md text-label-md text-primary font-bold hover:underline flex items-center gap-0.5 active:translate-x-0.5 transition-transform cursor-pointer"
            >
              <span>See All</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          {/* Scrollable Reel */}
          <div className="flex gap-space-md overflow-x-auto no-scrollbar px-margin pb-2">
            {trendingHits.map((song) => {
              const isSongPlaying = currentTrack.id === song.id && isPlaying;
              const songLiked = isLiked(song.id);

              return (
                <div
                  key={song.id}
                  onClick={() => handlePlaySong(song)}
                  className="song-card flex-shrink-0 w-44 flex flex-col gap-space-xs group cursor-pointer active:scale-98 transition-transform"
                >
                  <div className="relative w-44 h-44 rounded-xl overflow-hidden bg-surface-container shadow-[0_8px_20px_rgba(91,66,243,0.08)]">
                    <img
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src={song.coverUrl}
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-on-surface/60 backdrop-blur-md text-surface font-label-sm text-label-sm font-semibold">
                      {song.tag}
                    </span>

                    {/* Like button */}
                    <button
                      aria-label={`Like ${song.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(song.id);
                      }}
                      className={`like-btn absolute top-2 right-2 w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all active:scale-75 ${
                        songLiked
                          ? 'bg-secondary-container text-white'
                          : 'bg-on-surface/50 text-surface hover:bg-secondary-container hover:text-white'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[16px] like-icon"
                        style={songLiked ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        {songLiked ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>

                    {/* Play button */}
                    <button
                      aria-label={`Play ${song.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySong(song);
                      }}
                      className="track-play-btn absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-secondary-container text-on-secondary flex items-center justify-center shadow-lg active:scale-90 transition-transform hover:shadow-xl hover:scale-105"
                    >
                      <span
                        className="material-symbols-outlined text-[20px] play-icon"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {isSongPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                  </div>

                  <div className="flex flex-col text-left">
                    <h4 className="font-title-md text-title-md text-on-surface truncate group-hover:text-primary transition-colors font-semibold">
                      {song.title}
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {song.artist}
                    </p>
                    <span className="font-label-sm text-label-sm text-outline mt-0.5">
                      {song.durationText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recently Played with Tactile Wave & Audio State */}
        <section className="px-margin mb-space-lg">
          <div className="flex items-center justify-between mb-space-sm">
            <div className="flex items-center gap-space-xs">
              <div className="w-2.5 h-6 rounded-full bg-primary"></div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Recently Played
              </h3>
            </div>
            {!historyCleared && (
              <button
                id="clear-history-btn"
                onClick={() => setHistoryCleared(true)}
                className="font-label-md text-label-md text-outline hover:text-on-surface transition-colors active:scale-95 cursor-pointer font-medium"
              >
                Clear History
              </button>
            )}
          </div>

          {historyCleared ? (
            <div className="p-6 text-center rounded-xl bg-surface-container-high/40 flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[28px] text-outline">history</span>
              <p className="font-body-md text-on-surface-variant">History cleared for today.</p>
              <button
                onClick={() => setHistoryCleared(false)}
                className="mt-1 px-3.5 py-1 rounded-full bg-primary text-on-primary font-label-sm font-bold active:scale-95 transition-all"
              >
                Restore
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-space-xs" id="recent-tracks-container">
              {recentPlayedList.map((track) => {
                const isCurrentlyPlaying = currentTrack.id === track.id ? isPlaying : track.isPlayingNow;

                return (
                  <div
                    key={track.id}
                    onClick={() => handlePlaySong(track)}
                    className={`track-row flex items-center justify-between p-space-sm rounded-xl transition-colors group cursor-pointer active:scale-98 ${
                      track.isPlayingNow
                        ? 'bg-surface-container-high/60 hover:bg-surface-container-high'
                        : 'hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center gap-space-sm min-w-0">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                        <img
                          alt={track.title}
                          className="w-full h-full object-cover"
                          src={track.coverUrl}
                        />
                        {/* Animated Soundwave overlay */}
                        {isCurrentlyPlaying && (
                          <div className="eq-overlay absolute inset-0 bg-primary/40 flex items-center justify-center gap-0.5">
                            <span className="w-0.5 h-4 bg-surface rounded-full eq-bar-1"></span>
                            <span className="w-0.5 h-6 bg-surface rounded-full eq-bar-2"></span>
                            <span className="w-0.5 h-3 bg-surface rounded-full eq-bar-3"></span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col min-w-0 text-left">
                        <h4
                          className={`font-title-md text-title-md truncate transition-colors row-title font-semibold ${
                            track.isPlayingNow ? 'text-primary font-bold' : 'text-on-surface group-hover:text-primary'
                          }`}
                        >
                          {track.title}
                        </h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                          {track.artist}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5 row-status">
                          {track.isPlayingNow && (
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary-container pulse-dot animate-pulse"></span>
                          )}
                          <span
                            className={`font-label-sm text-label-sm status-text ${
                              track.isPlayingNow ? 'text-secondary-container font-semibold' : 'text-outline'
                            }`}
                          >
                            {track.statusText}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      aria-label={track.isPlayingNow ? 'Pause track' : 'Play track'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySong(track);
                      }}
                      className={`row-play-btn w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-105 active:scale-90 transition-all ${
                        track.isPlayingNow
                          ? 'bg-surface-container-lowest text-secondary-container shadow-sm'
                          : 'bg-surface-container text-on-surface-variant hover:text-secondary-container hover:bg-surface-container-high'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[20px] row-icon"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {isCurrentlyPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Recommended Artists & Curators (Doodle Halos & Cutout Style from Inspiration) */}
        <section className="mb-space-lg">
          <div className="px-margin flex items-center justify-between mb-space-sm">
            <div className="flex items-center gap-space-xs">
              <div className="w-2.5 h-6 rounded-full bg-tertiary"></div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Recommended Artists
              </h3>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="font-label-md text-label-md text-primary font-bold hover:underline flex items-center gap-0.5 active:translate-x-0.5 transition-transform cursor-pointer"
            >
              <span>Explore All</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <div className="flex gap-space-md overflow-x-auto no-scrollbar px-margin pb-2">
            {recommendedArtists.map((artist) => {
              const isFollowed = followingMap[artist.id];

              return (
                <div
                  key={artist.id}
                  onClick={() => navigate('/album/pushpa-2')}
                  className="flex-shrink-0 w-32 flex flex-col items-center text-center group cursor-pointer active:scale-98 transition-transform"
                >
                  <div className="relative w-28 h-28 mb-space-xs">
                    {/* Playful retro background arch plate */}
                    <div
                      className={`absolute inset-0 rounded-full transform group-hover:rotate-0 transition-transform ${artist.bgPlateClass}`}
                    ></div>
                    {/* Whimsical hand drawn doodle rings */}
                    {artist.doodle}
                    {/* Stylized duotone portrait */}
                    <div className="relative w-full h-full rounded-full overflow-hidden flex items-end justify-center">
                      <img
                        alt={artist.name}
                        className="w-24 h-24 object-cover object-top rounded-full"
                        src={artist.portraitUrl}
                      />
                    </div>
                  </div>

                  <h4 className="font-title-md text-title-md text-on-surface truncate w-full font-semibold">
                    {artist.name}
                  </h4>
                  <p className="font-body-sm text-body-sm text-outline truncate w-full">
                    {artist.role}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollow(artist.id);
                    }}
                    className={`follow-btn mt-2 px-3.5 py-1 rounded-full font-label-sm text-label-sm transition-colors active:scale-90 font-medium ${
                      isFollowed
                        ? 'bg-surface-container text-on-surface hover:bg-on-surface hover:text-surface'
                        : 'bg-on-surface text-surface hover:bg-primary'
                    }`}
                  >
                    {isFollowed ? 'Following' : 'Follow'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Made For You: Curated Pastel Mood Mixes */}
        <section className="px-margin mb-space-xl">
          <div className="flex items-center justify-between mb-space-sm">
            <div className="flex items-center gap-space-xs">
              <div className="w-2.5 h-6 rounded-full bg-secondary-container"></div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Made For You
              </h3>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full font-medium">
              Daily Personalized
            </span>
          </div>

          {/* 2-Card Asymmetric Bento Mix Grid */}
          <div className="grid grid-cols-2 gap-space-md">
            {/* Bento Card 1: Acoustic Telugu Chill */}
            <div
              onClick={() => handlePlaySong(recentPlayedList[2])}
              className="bento-card relative rounded-xl p-space-md bg-gradient-to-br from-tertiary-fixed via-surface-container to-surface-container-high overflow-hidden shadow-[0_8px_20px_rgba(21,85,68,0.08)] flex flex-col justify-between h-48 group cursor-pointer active:scale-98 transition-transform"
            >
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-tertiary/10 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>
              <div className="flex justify-between items-start">
                <span className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-tertiary shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">spa</span>
                </span>
                <span className="font-label-sm text-label-sm text-tertiary font-bold bg-tertiary-fixed-dim/60 px-2 py-0.5 rounded-full">
                  Chillout
                </span>
              </div>
              <div className="relative z-10 text-left">
                <h4 className="font-headline-sm text-headline-sm text-on-surface leading-snug group-hover:text-primary transition-colors font-bold">
                  Acoustic Telugu Chill
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-1">
                  Sid Sriram, Anurag Kulkarni, Chinmayi
                </p>
              </div>
              <div className="flex items-center justify-between mt-space-xs pt-space-xs border-t-0">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  28 Tracks • 1 hr 45m
                </span>
                <span className="bento-play-pill w-7 h-7 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center group-hover:scale-110 active:scale-90 transition-transform">
                  <span
                    className="material-symbols-outlined text-[16px] bento-icon"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    play_arrow
                  </span>
                </span>
              </div>
            </div>

            {/* Bento Card 2: Bollywood Lo-Fi Evenings */}
            <div
              onClick={() => handlePlaySong(recentPlayedList[1])}
              className="bento-card relative rounded-xl p-space-md bg-gradient-to-br from-primary-fixed via-surface-container to-secondary-fixed overflow-hidden shadow-[0_8px_20px_rgba(91,66,243,0.08)] flex flex-col justify-between h-48 group cursor-pointer active:scale-98 transition-transform"
            >
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/10 rounded-full blur-xl group-hover:scale-125 transition-transform"></div>
              <div className="flex justify-between items-start">
                <span className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">bedtime</span>
                </span>
                <span className="font-label-sm text-label-sm text-primary font-bold bg-primary-fixed/80 px-2 py-0.5 rounded-full">
                  Lo-Fi
                </span>
              </div>
              <div className="relative z-10 text-left">
                <h4 className="font-headline-sm text-headline-sm text-on-surface leading-snug group-hover:text-primary transition-colors font-bold">
                  Bollywood Lo-Fi Evenings
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-1">
                  Arijit, Jasleen Royal, Prateek Kuhad
                </p>
              </div>
              <div className="flex items-center justify-between mt-space-xs pt-space-xs border-t-0">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  32 Tracks • 2 hr 10m
                </span>
                <span className="bento-play-pill w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center group-hover:scale-110 active:scale-90 transition-transform">
                  <span
                    className="material-symbols-outlined text-[16px] bento-icon"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    play_arrow
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
