import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { usePlayer } from '../context/PlayerContext';
import { Track } from '../types';
import { MOCK_TRACKS, MOCK_ARTISTS, MOCK_ALBUM_PUSHPA2 } from '../data/mockData';
import { storageService } from '../services/storageService';
import { spotifyApi, musicTrackToInternalTrack } from '../services/spotify';

export const SearchScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentTrack, isPlaying, playTrack, togglePlayPause, isLiked, toggleLike } = usePlayer();

  const [query, setQuery] = useState<string>(() => searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState<string>('songs');
  const [isSearchingSpotify, setIsSearchingSpotify] = useState<boolean>(false);
  const [spotifySongs, setSpotifySongs] = useState<Track[]>([]);
  const [spotifyArtists, setSpotifyArtists] = useState<any[]>([]);
  const [spotifyAlbums, setSpotifyAlbums] = useState<any[]>([]);
  const [defaultTrendingSongs, setDefaultTrendingSongs] = useState<Track[]>([]);

  useEffect(() => {
    spotifyApi.getTopIndianHits(15).then((tracks) => {
      if (tracks && tracks.length > 0) {
        setDefaultTrendingSongs(tracks.map(musicTrackToInternalTrack));
      }
    }).catch(() => {});
  }, []);

  const [trendingTags, setTrendingTags] = useState<string[]>([
    'Pushpa 2 The Rule',
    'Arijit Singh Romantic',
    'Kalki BGM',
    'Anirudh EDM',
    'Devara',
    'Taylor Swift',
    'Coldplay',
    'Naatu Naatu',
  ]);

  const tabs = [
    { id: 'all', label: 'All Results' },
    { id: 'songs', label: 'Songs', hasDot: true },
    { id: 'artists', label: 'Artists' },
    { id: 'albums', label: 'Albums' },
    { id: 'playlists', label: 'Playlists' },
  ];

  // Base curated song results from Stitch melody_search_song_results
  const baseSearchSongs: Track[] = useMemo(() => {
    return [
      {
        id: 'search-1',
        title: 'Samajavaragamana',
        artist: 'Sid Sriram, Thaman S',
        movieOrAlbum: 'Ala Vaikunthapurramuloo',
        duration: 222,
        genre: 'telugu',
        isLossless: true,
        playsCount: '48.2M',
        coverUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCwC3oacJ3C9D6XTXJqn-jNemxw8iJtfusTLqFyRMTX4na26vw11t6r4z9vz96SudjVvXARgArzJV-xDEaTqpDgkQ_MFZMUxslChGEQLg3lGoOIgu4ospjaMThXs14G8Z2GpdKfzD7TFI9eG0PrU2RIX9jCRPBdfFcTcEnTLP6Gyk6WZS21p8eBLAEe0lht0DyMUKbLEBIYKfxtHaQcY5b7Y68JdugtMs_goDQhkHtHfTZ9LfTYyoJdKg',
      },
      {
        id: 'search-2',
        title: 'Inkem Inkem Inkem Kaavaale',
        artist: 'Sid Sriram, Gopi Sundar',
        movieOrAlbum: 'Geetha Govindam',
        duration: 268,
        genre: 'telugu',
        isLossless: true,
        playsCount: '92.1M',
        coverUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCvNRNZhQ91agBmSg5LsLTci9FwfCSFjbmS2OjCMoGyDFD37lDPqJtEKpnzBBR2EV9UHs9kLuFA5A-rBDh8ToAFnDh21m_YG1r0y5QgCeI-5vqivkxpBRMveutAVrwvlJe6bCAEIKvpMqdpTBDH57PVF2sFk3xiLKx8tdpoXUsO-W2vJxF3JXTo8A25iWVt9k5dUi2zXcEPx7vTe9fRXEptz5MRMxBF3e26D0TWRF5YdvKaHHHRp5jktQ',
      },
      {
        id: 'search-3',
        title: 'Srivalli',
        artist: 'Sid Sriram, Devi Sri Prasad',
        movieOrAlbum: 'Pushpa',
        duration: 224,
        genre: 'telugu',
        isLossless: true,
        playsCount: '62.5M',
        coverUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuC2d3nBsNvZlxoxyrDss4o_HqdqjF5HV7gF8aYFKnbsu7fUWZ0mqrACoEDSHDWSgssWXtb3cCogD7O4sClK-YZ_xpgNKG0U6EnBOn9_QDjwAST0wM9d3hn5GdOUTKjgw4-DZpT2Ff9oroZaakOHkgd3TFWNYir6C3T1DNVvMLqId9FZ2vtSkhMx4wnPmxG-Viu9tFjDj74kodlUaEOijuxGrhTp7knsdbScDCNUEdFmK3D7pYtjRzR9CQ',
      },
      {
        id: 'search-4',
        title: 'Kadhaippoma',
        artist: 'Sid Sriram, Leon James',
        movieOrAlbum: 'Oh My Kadavule',
        duration: 258,
        genre: 'tamil',
        isLossless: true,
        playsCount: '34.8M',
        coverUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAOKTO0u7jmOrtHELtipmKmJEG7r6pwKpogZiKrh5jy5awyI2aDWeCjbuDdAW-OA3MYxP5lH3YWrzqw1VatTzfJIjdqDs675bvsPMr7M3QAhLiWYyQ5VmmoAEzoZLNnfrSmoLC4iiRfMC7vQmfQhHZ2PQd1hfgQl8wauDwUR4tQgKk11lIimGfxR3KBmVHObHkCBFYDCxTK5pAXQqeIpXRI2DeOeqi3idq4iAG9pEtraA_8MIuVr5xiUg',
      },
      {
        id: 'search-5',
        title: 'Urike Urike',
        artist: 'Sid Sriram, John Stewart Eduri',
        movieOrAlbum: 'HIT 2',
        duration: 236,
        genre: 'telugu',
        isLossless: true,
        playsCount: '28.4M',
        coverUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAl-utKZIyq86zud87Fg3RiTUeDXnEIUxNFb-NsEhOPm2dajKkiFslCnZQIVHEzSWT-8LH7ETDkzNKSlfVDjEBPZ0tJWBtOO_z8ffRRBJsyfF5xgSSD5WSzb2tgx2MhJs7onzZFMrPa6UCJYE1a_Y4_SsqXhuDDQtSMs5VOsVzR3Qgby_1CmAtAwf_nHcieh_oAN5fr5NHKnW8u8aeMt7EGEyg904B_qGoUsZvh11-0UdiUMuDTNrnShg',
      },
      ...MOCK_TRACKS,
    ];
  }, []);

  // Sync query when URL query parameter changes
  useEffect(() => {
    const qFromUrl = searchParams.get('q');
    if (qFromUrl && qFromUrl !== query) {
      setQuery(qFromUrl);
    }
  }, [searchParams]);

  // Debounced live Spotify search
  useEffect(() => {
    const cleanQ = query.trim();
    if (!cleanQ || cleanQ.length < 2) {
      setSpotifySongs([]);
      setSpotifyArtists([]);
      setSpotifyAlbums([]);
      setIsSearchingSpotify(false);
      return;
    }

    setIsSearchingSpotify(true);
    const timer = setTimeout(async () => {
      try {
        const res = await spotifyApi.search(cleanQ, 25);
        if (res && res.tracks && res.tracks.length > 0) {
          const mapped = res.tracks.map(musicTrackToInternalTrack);
          setSpotifySongs(mapped);
          setSpotifyArtists(
            (res.artists || []).map((a) => ({
              id: `spotify:${a.providerId}`,
              name: a.name,
              language: a.genres?.slice(0, 2).join(' • ') || 'Spotify Artist',
              tagline: 'Verified Artist on Spotify',
              imageUrl:
                a.artworkUrl ||
                'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500',
              isSelected: false,
            }))
          );
          setSpotifyAlbums(
            (res.albums || []).map((alb) => ({
              id: `spotify:${alb.providerId}`,
              title: alb.title,
              artist: alb.artist,
              description: `${alb.releaseYear || '2024'} • ${alb.trackCount || 0} Tracks`,
              coverUrl:
                alb.artworkUrl ||
                'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500',
              trackCount: alb.trackCount || 0,
              durationText: 'Album',
              tracks: [],
            }))
          );
        } else {
          setSpotifySongs([]);
        }
      } catch (err) {
        console.warn('[SearchScreen] Spotify search error:', err);
      } finally {
        setIsSearchingSpotify(false);
      }
    }, 320);

    return () => clearTimeout(timer);
  }, [query]);

  // Filtered tracks based on query and live Spotify results
  const filteredSongs = useMemo(() => {
    if (spotifySongs.length > 0) {
      return spotifySongs;
    }
    const cleanQ = query.trim().toLowerCase();
    if (!cleanQ) {
      return defaultTrendingSongs.length > 0 ? defaultTrendingSongs : baseSearchSongs.slice(0, 5);
    }
    return baseSearchSongs.filter((t) => {
      const matchTitle = t.title.toLowerCase().includes(cleanQ);
      const matchArtist = t.artist.toLowerCase().includes(cleanQ);
      const matchMovie = (t.movieOrAlbum || '').toLowerCase().includes(cleanQ);
      const matchGenre = (t.genre || '').toLowerCase().includes(cleanQ);
      return matchTitle || matchArtist || matchMovie || matchGenre;
    });
  }, [baseSearchSongs, defaultTrendingSongs, query, spotifySongs]);

  // Filtered artists based on query and live Spotify artists
  const filteredArtists = useMemo(() => {
    if (spotifyArtists.length > 0) {
      return spotifyArtists;
    }
    const cleanQ = query.trim().toLowerCase();
    if (!cleanQ) return MOCK_ARTISTS;
    return MOCK_ARTISTS.filter(
      (a) =>
        a.name.toLowerCase().includes(cleanQ) ||
        a.language.toLowerCase().includes(cleanQ) ||
        a.tagline.toLowerCase().includes(cleanQ)
    );
  }, [query, spotifyArtists]);

  // Filtered playlists and albums
  const userPlaylists = useMemo(() => storageService.getPlaylists(), []);
  const filteredPlaylists = useMemo(() => {
    const cleanQ = query.trim().toLowerCase();
    if (!cleanQ) return userPlaylists;
    return userPlaylists.filter(
      (p) =>
        p.title.toLowerCase().includes(cleanQ) ||
        p.description.toLowerCase().includes(cleanQ)
    );
  }, [userPlaylists, query]);

  // Exact 4 Explore Vibes from Stitch melody_search_song_results
  const exploreVibes = [
    {
      id: 'vibe-1',
      title: 'Bollywood Romance',
      badge: 'Trending Mood',
      tracksText: '84 Tracks',
      badgeBg: 'bg-secondary-container/90',
      icon: 'favorite',
      coverUrl: '/assets/romance.png',
      shadowClass: 'shadow-[0_6px_16px_rgba(254,93,57,0.18)]',
      query: 'Bollywood Romance',
    },
    {
      id: 'vibe-2',
      title: 'Telugu Masala',
      badge: 'Dance & Energy',
      tracksText: '112 Tracks',
      badgeBg: 'bg-secondary/90',
      icon: 'local_fire_department',
      coverUrl: '/assets/mass-celebration.png',
      shadowClass: 'shadow-[0_6px_16px_rgba(180,41,7,0.18)]',
      query: 'Telugu Masala',
    },
    {
      id: 'vibe-3',
      title: 'Monsoon Chai & Lo-Fi',
      badge: 'Chill & Rain',
      tracksText: '62 Tracks',
      badgeBg: 'bg-tertiary-container/90',
      icon: 'coffee',
      coverUrl: '/assets/monsoon.png',
      shadowClass: 'shadow-[0_6px_16px_rgba(21,85,68,0.18)]',
      query: 'Monsoon Chai',
    },
    {
      id: 'vibe-4',
      title: 'Gym & Energy Boost',
      badge: 'High Tempo',
      tracksText: '95 Tracks',
      badgeBg: 'bg-primary/90',
      icon: 'bolt',
      coverUrl: '/assets/workout.png',
      shadowClass: 'shadow-[0_6px_16px_rgba(66,29,219,0.22)]',
      query: 'Gym Workout',
    },
  ];

  const formatSecs = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  const handlePlaySong = (song: Track) => {
    if (currentTrack.id === song.id) {
      togglePlayPause();
    } else {
      playTrack(song, filteredSongs);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-16 pb-[140px] bg-surface select-none">
      {/* Exact Header matching Stitch (Melody script + Sonic emblem + Search + Profile) */}
      <Header />

      <main className="flex flex-col w-full">
        {/* Search Input & Filter Section */}
        <section className="px-margin pt-space-sm pb-space-md flex flex-col gap-space-sm">
          {/* Active Search Bar */}
          <div className="relative w-full flex items-center bg-surface-container-low rounded-full px-space-md py-space-xs shadow-sm">
            {isSearchingSpotify ? (
              <span className="material-symbols-outlined text-primary text-[20px] animate-spin flex-shrink-0">
                progress_activity
              </span>
            ) : (
              <span className="material-symbols-outlined text-primary text-[22px] flex-shrink-0">
                search
              </span>
            )}
            <input
              id="search-input"
              aria-label="Search songs, artists, albums"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search songs, artists, albums..."
              type="text"
              className="flex-1 bg-transparent px-space-sm py-space-xs text-on-surface font-title-md text-title-md outline-none placeholder:text-on-surface-variant/60"
            />
            <div className="flex items-center gap-space-xs flex-shrink-0">
              {query && (
                <button
                  id="clear-btn"
                  aria-label="Clear search"
                  onClick={() => setQuery('')}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
              <button
                id="mic-btn"
                aria-label="Voice search"
                onClick={() => setQuery('Pushpa 2 The Rule')}
                className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shadow-sm active:scale-95 transition-transform cursor-pointer"
                title="Voice Search"
              >
                <span className="material-symbols-outlined text-[18px]">mic</span>
              </button>
            </div>
          </div>

          {/* Filter Toggle Tabs (Horizontal Carousel) */}
          <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar pt-space-xs -mx-margin px-margin">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`filter-tab px-space-md py-space-xs rounded-full font-label-md text-label-md whitespace-nowrap active:scale-95 transition-all flex items-center gap-1 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-[0_4px_12px_rgba(66,29,219,0.22)]'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.hasDot && (
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Trending Tags Pills */}
          <div className="pt-space-xs flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-1 font-semibold">
                <span
                  className="material-symbols-outlined text-[14px] text-secondary-container"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  trending_up
                </span>
                Trending Now
              </span>
              <button
                id="clear-trending-btn"
                onClick={() => setTrendingTags([])}
                className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer font-medium"
              >
                Clear
              </button>
            </div>

            <div
              className="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-0.5"
              id="trending-tags-container"
            >
              {trendingTags.map((tag, idx) => {
                const isFirst = idx === 0;
                return (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className={`px-space-sm py-1 rounded-full font-label-sm text-label-sm whitespace-nowrap active:scale-95 transition-transform flex items-center gap-1 cursor-pointer ${
                      isFirst
                        ? 'bg-tertiary-fixed text-on-tertiary-fixed font-semibold'
                        : idx === 1
                        ? 'bg-secondary-fixed text-on-secondary-fixed'
                        : idx === 2
                        ? 'bg-primary-fixed text-on-primary-fixed'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {isFirst && <span>🔥</span>}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Dynamic Results Section According to Active Tab */}
        {(activeTab === 'all' || activeTab === 'songs') && (
          <section className="px-margin pt-space-xs pb-space-lg flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Top Songs
                </h2>
                {spotifySongs.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1DB954]/15 text-[#1DB954]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse"></span>
                    Spotify Live
                  </span>
                )}
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                {isSearchingSpotify ? (
                  <>
                    <span className="material-symbols-outlined text-[14px] animate-spin text-primary">
                      progress_activity
                    </span>
                    <span>Searching Spotify...</span>
                  </>
                ) : (
                  <span>{filteredSongs.length} results</span>
                )}
              </span>
            </div>

            {/* Empty State */}
            {filteredSongs.length === 0 ? (
              <div className="w-full py-8 px-4 rounded-2xl bg-surface-container-low text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl text-outline mb-2">
                  music_off
                </span>
                <p className="font-title-md text-on-surface font-bold">No songs found</p>
                <p className="font-body-sm text-outline mt-1 max-w-[260px]">
                  No songs match &ldquo;{query}&rdquo;. Try searching for &ldquo;Pushpa&rdquo;, &ldquo;Sid
                  Sriram&rdquo;, or &ldquo;Telugu&rdquo;.
                </p>
              </div>
            ) : (
              /* Track List */
              <div className="flex flex-col gap-space-xs" id="tracks-container">
                {filteredSongs.map((song, idx) => {
                  const isSongPlaying = currentTrack.id === song.id && isPlaying;
                  const songLiked = isLiked(song.id);

                  return (
                    <div
                      key={song.id}
                      onClick={() => handlePlaySong(song)}
                      className={`track-card relative overflow-hidden rounded-xl p-space-sm flex items-center gap-space-sm transition-all cursor-pointer text-left ${
                        idx === 0
                          ? 'bg-surface-container shadow-[0_6px_20px_rgba(91,66,243,0.08)]'
                          : 'bg-surface-container-lowest hover:bg-surface-container-low shadow-sm'
                      }`}
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-sm track-thumb-wrapper">
                        <img
                          alt={song.title}
                          className="w-full h-full object-cover"
                          src={song.coverUrl}
                        />
                        {isSongPlaying && (
                          <div className="track-equalizer absolute inset-0 bg-primary/30 backdrop-blur-[1px] flex items-center justify-center">
                            <div className="flex items-end gap-[2px] h-4">
                              <span className="w-[3px] bg-secondary-container rounded-full animate-bounce h-3.5"></span>
                              <span className="w-[3px] bg-secondary-container rounded-full animate-bounce h-4.5"></span>
                              <span className="w-[3px] bg-secondary-container rounded-full animate-bounce h-2.5"></span>
                              <span className="w-[3px] bg-secondary-container rounded-full animate-bounce h-4"></span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-space-xs">
                          <span
                            className={`track-title font-title-md text-title-md truncate ${
                              idx === 0
                                ? 'text-primary font-bold'
                                : 'text-on-surface font-semibold'
                            }`}
                          >
                            {song.title}
                          </span>
                          {idx === 0 && (
                            <span className="track-badge px-1.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[9px] uppercase tracking-wide font-bold">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                          {song.artist}{' '}
                          {song.movieOrAlbum && (
                            <span className="text-outline text-xs">• {song.movieOrAlbum}</span>
                          )}
                        </p>
                        <div className="flex items-center gap-space-xs pt-1">
                          <span className="px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-[10px] capitalize">
                            {song.genre}
                          </span>
                          <span className="track-time font-label-sm text-label-sm text-on-surface-variant">
                            {formatSecs(song.duration)}
                          </span>
                          {song.isLossless && (
                            <span className="font-label-sm text-[10px] text-primary font-bold">
                              • Lossless
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          aria-label="Favorite"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(song.id);
                          }}
                          className={`fav-btn w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform ${
                            songLiked
                              ? 'text-secondary-container'
                              : 'text-on-surface-variant/50 hover:text-secondary-container'
                          }`}
                        >
                          <span
                            className="material-symbols-outlined text-[20px]"
                            style={songLiked ? { fontVariationSettings: "'FILL' 1" } : undefined}
                          >
                            {songLiked ? 'favorite' : 'favorite_border'}
                          </span>
                        </button>

                        <button
                          aria-label={`Play ${song.title}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlaySong(song);
                          }}
                          className={`play-trigger rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            idx === 0
                              ? 'w-10 h-10 bg-secondary-container text-on-secondary shadow-[0_4px_12px_rgba(254,93,57,0.35)] active:scale-95'
                              : 'w-9 h-9 bg-surface-container text-primary hover:bg-primary hover:text-on-primary active:scale-95'
                          }`}
                        >
                          <span
                            className="material-symbols-outlined text-[20px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            {isSongPlaying ? 'pause' : 'play_arrow'}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Tab Artists View */}
        {(activeTab === 'all' || activeTab === 'artists') && (
          <section className="px-margin pb-space-lg flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Artists
              </h2>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {filteredArtists.length} found
              </span>
            </div>

            <div className="grid grid-cols-2 gap-space-sm">
              {filteredArtists.map((artist) => (
                <div
                  key={artist.id}
                  onClick={() => setQuery(artist.name)}
                  className="p-space-sm rounded-2xl bg-surface-container-lowest flex items-center gap-3 cursor-pointer shadow-sm hover:bg-surface-container-low transition-all active:scale-95 text-left"
                >
                  <img
                    alt={artist.name}
                    src={artist.imageUrl}
                    className="w-12 h-12 rounded-full object-cover shadow-sm ring-1 ring-outline-variant/30 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-title-md text-sm font-bold text-on-surface truncate">
                      {artist.name}
                    </p>
                    <p className="font-body-sm text-xs text-outline truncate">{artist.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab Playlists & Albums View */}
        {(activeTab === 'all' || activeTab === 'albums' || activeTab === 'playlists') && (
          <section className="px-margin pb-space-lg flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                {activeTab === 'albums' ? 'Albums' : 'Playlists & Albums'}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-space-sm">
              <div
                onClick={() => navigate('/album/pushpa-2')}
                className="p-3 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-2 cursor-pointer hover:bg-surface-container-low transition-all active:scale-95 text-left"
              >
                <img
                  alt={MOCK_ALBUM_PUSHPA2.title}
                  src={MOCK_ALBUM_PUSHPA2.coverUrl}
                  className="w-full aspect-square rounded-xl object-cover shadow-md"
                />
                <p className="font-title-md text-sm font-bold text-on-surface truncate">
                  {MOCK_ALBUM_PUSHPA2.title}
                </p>
                <p className="font-body-sm text-xs text-outline truncate">
                  {MOCK_ALBUM_PUSHPA2.artist}
                </p>
              </div>

              {filteredPlaylists.slice(0, 3).map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => navigate('/library')}
                  className="p-3 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-2 cursor-pointer hover:bg-surface-container-low transition-all active:scale-95 text-left"
                >
                  <img
                    alt={pl.title}
                    src={pl.coverUrl || pl.coverImages?.[0] || MOCK_ALBUM_PUSHPA2.coverUrl}
                    className="w-full aspect-square rounded-xl object-cover shadow-md"
                  />
                  <p className="font-title-md text-sm font-bold text-on-surface truncate">
                    {pl.title}
                  </p>
                  <p className="font-body-sm text-xs text-outline truncate">{pl.durationText}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Expressive Browse Categories: Explore Vibes (2x2 Grid) */}
        <section className="px-margin pb-space-lg flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary-container text-[20px]">
                auto_awesome
              </span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Explore Vibes
              </h2>
            </div>
            <button
              onClick={() => navigate('/library')}
              className="font-label-md text-label-md text-primary font-semibold hover:underline cursor-pointer"
            >
              See All
            </button>
          </div>

          <div className="grid grid-cols-2 gap-space-sm">
            {exploreVibes.map((vibe) => (
              <div
                key={vibe.id}
                onClick={() => setQuery(vibe.query)}
                className={`group relative overflow-hidden rounded-xl min-h-[140px] flex flex-col justify-between p-space-md active:scale-[0.98] transition-transform cursor-pointer ${vibe.shadowClass}`}
              >
                <img
                  alt={vibe.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={vibe.coverUrl}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                <div className="relative z-10 flex flex-col items-start">
                  <span
                    className={`px-2 py-0.5 rounded-full backdrop-blur-sm text-[10px] uppercase tracking-wider text-white font-bold ${vibe.badgeBg}`}
                  >
                    {vibe.badge}
                  </span>
                </div>

                <div className="relative z-10 flex flex-col gap-1 mt-auto text-left">
                  <span className="font-headline-sm text-headline-sm text-white leading-tight font-bold drop-shadow-md">
                    {vibe.title}
                  </span>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                      <span
                        className="material-symbols-outlined text-[14px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {vibe.icon}
                      </span>
                    </span>
                    <span className="font-label-sm text-label-sm text-white/90 drop-shadow-sm font-medium">
                      {vibe.tracksText}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SearchScreen;
