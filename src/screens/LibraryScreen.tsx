import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { usePlayer } from '../context/PlayerContext';
import { MOCK_TRACKS } from '../data/mockData';
import { Track } from '../types';
import { storageService } from '../services/storageService';

export const LibraryScreen: React.FC = () => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = usePlayer();

  const [activeCategory, setActiveCategory] = useState<string>('playlists');
  const [sortOption, setSortOption] = useState<string>('Recently Added');
  const [isSortOpen, setSortOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeOfflineIndex, setActiveOfflineIndex] = useState<number>(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const categories = [
    { id: 'playlists', label: 'Playlists', icon: 'queue_music' },
    { id: 'liked', label: 'Liked Songs' },
    { id: 'albums', label: 'Albums' },
    { id: 'artists', label: 'Artists' },
    { id: 'downloads', label: 'Downloads' },
  ];

  // Exact 4 Playlists from Stitch melody_library_playlists
  const [playlists, setPlaylists] = useState([
    {
      id: 'midnight-telugu',
      title: 'Midnight Telugu',
      tag: 'Chill Vibes',
      tagDotColor: 'bg-secondary-container',
      trackInfo: '48 tracks • By You',
      icon: 'graphic_eq',
      iconColor: 'text-primary/70',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBLH1C8lxmTe3GaxO1lXA1aTrstiFvFZoczJ2kOP0CaxHtVdc7YZTqqXYMnvefk9AyclcWLDbG180u64XTKuOQR_yG_aIxnt3wru2Jkxg5Cv01nDx9NNq0FH4pgqB1voXe3QbtJ7iWH6OAFfAT1fSEifrnyBOsxe7ZW5-LUO4S8dSugwYxEJYlloGVt6aqP6PKNvajaZ4Dv4fUFonB_fizyQsXlltzOb5gxPgaGUmG8JORye-mTK7gCGw',
      playBtnColor: 'text-primary group-hover:bg-primary group-hover:text-white',
    },
    {
      id: 'bollywood-90s',
      title: 'Bollywood 90s & 00s',
      tag: '90s Retro',
      tagDotColor: 'bg-[#ff5e3a]',
      trackInfo: '86 tracks • Nostalgia',
      icon: 'auto_awesome',
      iconColor: 'text-secondary-container/70',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD4qAb91Q1zi9eADatG8U4R4oGmxaPtFUH9Xy-ilbfJw8Wrx-W4PJ_QNsa2gt01K8SOB9M2ToBO8QG11dzeE39pPGAEqjCbeNaVv7oAcwjtfTOHZhwX-Pyk1IrvFUMZu77eyjQKd1ZR1MzX5n-VXlAAfKKPqSg_u9_yTgsbhnkCBZALM7yzFeY1Aw2Em4U8vRidmKd7dsUKEIgGZFPJUok0FlWlRNcIWvvsRgixkcFMWyBZYXAkZgu5Gg',
      playBtnColor: 'text-secondary-container group-hover:bg-secondary-container group-hover:text-white',
    },
    {
      id: 'south-masala-beats',
      title: 'South Masala Beats',
      tag: 'Mass Beats',
      tagDotColor: 'bg-tertiary-fixed',
      trackInfo: '32 tracks • 140+ BPM',
      icon: 'bolt',
      iconColor: 'text-tertiary',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC2jP557y-0JGmwPea1WkzTCE2biJeR2hBmYVuNrDypFTUQZFJEXh1XZFRiPLoHQj72Eu1vlDgz7LuuYEEeRp_Q7Cpt7sV7kP3LuJLsmlxXRTBtM25FRmeWwzr8z_acsMLnydev4TA5Bkpp78HGjdT_H5Ri-zrk-hiCVt6QPC04de5jC2FEKBSjHya2Yjkf0WMrNuI8Dh8F9v6mtEQkUlMDpv74kLDzttVBPbybtI0-hdlzg5Lc1J5RNA',
      playBtnColor: 'text-tertiary group-hover:bg-tertiary group-hover:text-white',
    },
    {
      id: 'sid-sriram-unplugged',
      title: 'Sid Sriram Unplugged',
      tag: 'Live Acoustic',
      tagDotColor: 'bg-inverse-primary',
      trackInfo: '18 tracks • Acoustic',
      icon: 'mic',
      iconColor: 'text-outline',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC76IYx_H2NCccgk-wECexFTvPBOMnN7lp6AIjspAI9nG05Y4xY5vnSMS7eNuXrjIAfma2o-Kul72RT9i4hrGKW-qfyeFUAZWEWeQbd8rcOs4Km7UHrb_NExc6zOsLTi4evmG_0h4pAvntwwB2WQbKZz56yYuAK98Jd33liUZ-ToyG8sBcAQ3anPYgntnyX1J-GsDmUboYvO9GfD5RfhNKJi1ynUqK6Roi8Mk6LRCfZK_JpxvZJf1avNg',
      playBtnColor: 'text-primary group-hover:bg-primary group-hover:text-white',
    },
  ]);

  // Exact 5 Artists You Follow from Stitch melody_library_playlists
  const artistsFollowed = [
    {
      id: 'sid-sriram',
      name: 'Sid Sriram',
      subtitle: 'New Single',
      subtitleColor: 'text-secondary-container font-semibold',
      hasBadge: true,
      ringClass: 'bg-gradient-to-tr from-secondary-container to-primary',
      portraitUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBICdl7CDf9JhiPu1HsHfmqDlms3Hr8O5-Gd_Og5bEmHIenHHmc4Cgh-LF-YiXQV08DEk1BY_Rj-O_67ZmZ5KJPt2zmfWP882E384qEw6i4jIfneI0kRrPluyecZ__z9ml3Y5Sw_4_SXrnIgyDvJRGfsefMIhewNx0kprFkjVoJ2_fAIKKK1cxfPKFN6JOCWXL9CJGrP1Jb4FiCPxmhR5MWJpKsvzy88kqN_AuBye4Pk5T98KfjQfeVCg',
    },
    {
      id: 'shreya-ghoshal',
      name: 'Shreya G.',
      subtitle: 'Artist',
      subtitleColor: 'text-on-surface-variant',
      hasBadge: false,
      ringClass: 'bg-primary-fixed',
      portraitUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBc5UnvqWxVISoEPgrv2fKX4-7NXW15O4f-YZfosC-OOnaNkZSbmkII96l9NwBum8IEcdEO-9zO6C-9EuT6IBg-pUR8NM591iPfloAH-7uuzfu1Jqaea5_XgaQJn9qvqCHQA4PR6ITdcsuOgnz2aeiSmCAysYvY3XtE4kArZF2jXw2J9m5uTPJifrsMeU-P8fdEadtn8rs0P9-YXF0N5e5GFDuOVLfvBtmN1sEw_1bO0Ms4O9cRuXjLJA',
    },
    {
      id: 'anirudh',
      name: 'Anirudh',
      subtitle: 'New Album',
      subtitleColor: 'text-secondary-container font-semibold',
      hasBadge: true,
      ringClass: 'bg-gradient-to-tr from-secondary-container to-primary',
      portraitUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA00Zic0ZUcFr5IWnFwntyHPutfsKwRnWrkGkOI1dANcF01En8d8sStkh7tjcNlM_2S4tbEwY6-rp4EuDu-XUu65XLhoJKUvUWb4kiQWrKdwYtjbX0kHQ1AUjoR4PCEBm-FN8sQoYITvTgJ1IzyLuk1QaxF5ZBstCmbqUXErbtJP-pu4mzKXAQlpThPap_9Lcx7JJYM7ns3c2NvF37EyilAs0H4N9n-mDkvs4Oa0cCRstHQfh3TEedn4g',
    },
    {
      id: 'ar-rahman',
      name: 'A.R. Rahman',
      subtitle: 'Artist',
      subtitleColor: 'text-on-surface-variant',
      hasBadge: false,
      ringClass: 'bg-tertiary-fixed',
      portraitUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ6tlcQZVlHiCW03vyG-7mP6zAz_HRAionOmUr8diXB24QMSjpCZVY8mBHP9Q-wTdfh9EAu8Yyu3x9OsdeF3GbUFRo3TR5AyMiwnN6RWUIfXUX0CgCl6JNn9DGrNvMyw5833TvllZXKkufoIGQjaVP5Vv2gnAOq1OtH5Q9MX6GIKksSX50BMk0iTelbwk98NfLWYG0kxrc34j3LpeuWbNOQvWXlW967lWRDtI91P109Lox9E4CyHS0kQ',
    },
    {
      id: 'anurag-kulkarni',
      name: 'Anurag K.',
      subtitle: 'Artist',
      subtitleColor: 'text-on-surface-variant',
      hasBadge: false,
      ringClass: 'bg-surface-container-high',
      portraitUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBaMjW3MQ_2Ob-K1BpldUB_La1wjld0BN4HlF8-NksflXvNfDe-rIRIy9aCAe5OmBWdi8Uug7Um9cOX8CfdKHUZ-w1xndFDP4rPb8AHCV7cyIXyI-yYvhDrNYQWAgiRDxvCzeGgv-cPrPC5LZFGLCyc4fDj87KBaTFprwcPc09O8j4bhEKdR-Du_JMQV1aK2gtzOqUUNZIou8GwyK5sWyl7UnUELN2efwuXMafzjS1LRKqub5Y--uOcwA',
    },
  ];

  // Exact 3 Offline Telugu Hits from Stitch melody_library_playlists
  const offlineSongs = [
    {
      id: 'offline-1',
      title: 'Samajavaragamana',
      artist: 'Sid Sriram • Ala Vaikunthapurramuloo',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDwHUqs-A__PNpvqW232yTKk7UurU-WUcw4nnKsAXSjn3CZWosTGuwGb-EaMfjfdIYzcARmIZMAoZ2EIP5z9mDxQ_sIRGxeVdBOqaGoulcohAu2eg2FGvRlHyWmku_gw7isaynyoZxvQAWBVMlih9vn3JXXRgLOL5yDTzzkZTtxRLePzDO-q8Sd7oIfoLDsn55wxH4BdfIGBZTpjy_VPJGRyWchE28PUY5tf8yH9WsTyIfrTLwmiKopjw',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=lofi-study-112191.mp3',
    },
    {
      id: 'offline-2',
      title: 'Butta Bomma',
      artist: 'Armaan Malik • Thaman S',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBTo1S5aTQXOvbpig14bbu5gpbCYPqfWNYk4z44HRyv0bM1rn1BJZbqJ5tu-6eHdDSIXxp9PSBpyGt79Mu-EcXySfQlRdEiqpqGvpAlqOAzb70RKGiswJp921z1TEtFNFN8eq1OREmMC4RqU7rO2Zi6V_g4IdAb1ChiJ2WmQX_hIgTOmJlQaDh6xKk0cs90DmD4Cc8luIFshOVTtZ9h8ReDPonNpq5DQ76d_plQU7JgfBLe6vb_rS4DXw',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=electronic-future-beats-117997.mp3',
    },
    {
      id: 'offline-3',
      title: 'Inkem Inkem Inkem Kaavaale',
      artist: 'Sid Sriram • Geetha Govindam',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAvxNWQF-OMKURUFUU-dcXW_lVp6yClVm4aXajq51epi1ZQ8JLUGiUN8ei_AJ3PcRgUFcGoM_sf1pUf7gbiiLFY29X7B_zKYArI9ez35tYaRSdJehdBdy_bTQjZz0QHtqpglBB495W_t7zD5jQTjnJbxR-ciDchtp_6uqENtLkLTkold63Z3gajiShkERTwcjsnXmY6pl37UIHWEf_SHPGDUoyBogjnQS6FMl6nDfRxiXAIp2RrYjdbEA',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3',
    },
  ];

  const handlePlaySong = (song: (typeof offlineSongs)[0], index: number) => {
    setActiveOfflineIndex(index);
    const trackToPlay: Track = {
      id: song.id,
      title: song.title,
      artist: song.artist,
      movieOrAlbum: 'Telugu Blockbusters',
      duration: 218,
      coverUrl: song.coverUrl,
      audioUrl: song.audioUrl,
      genre: 'telugu',
    };

    if (currentTrack.id === song.id) {
      togglePlayPause();
    } else {
      playTrack(trackToPlay, MOCK_TRACKS);
    }
  };

  const handleToggleArtistFollow = (artistId: string, artistName: string) => {
    const updated = storageService.toggleFollowArtist(artistId);
    const isNowFollowing = updated.includes(artistId);
    showToast(isNowFollowing ? `Following ${artistName}` : `Unfollowed ${artistName}`);
  };

  const handleCreatePlaylistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistTitle.trim()) return;

    const newCreated = storageService.createPlaylist(newPlaylistTitle.trim());
    const newPl = {
      id: newCreated.id,
      title: newCreated.title,
      tag: 'New Mix',
      tagDotColor: 'bg-primary',
      trackInfo: '0 tracks • By You',
      icon: 'queue_music',
      iconColor: 'text-primary',
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDF_3Q1gpSrNvrNkdJBawGlPvnFS8Xvl3W-2LfP9OLYPaEBXkUQH_u96RUREjsYLw62E_OYC6Nwj7wgSSEsoEU_9e1dDyumCK2f_YovzWeNwcMY3WAW71Yilawc3dvOIT5Jo9FTKfkM0PPertgALyIlVUx0xEmmmi6YafkbbdYTYH6cU328qz3pz1DeLitXXQ454Vas-VyW1l-4H7f2j3d-pNWXxGzvcDx4U_YKI3DysHy8iioy8ymXqw',
      playBtnColor: 'text-primary group-hover:bg-primary group-hover:text-white',
    };

    setPlaylists([newPl, ...playlists]);
    showToast(`Playlist "${newPlaylistTitle.trim()}" created!`);
    setNewPlaylistTitle('');
    setCreateModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-16 pb-[140px] bg-surface select-none">
      {/* Header identical to Home (Melody Logo + Script + Search + Profile) */}
      <Header />

      {/* Floating Toast Message */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[70] px-4 py-2 rounded-full bg-inverse-surface/95 text-inverse-on-surface text-label-md font-label-md shadow-xl backdrop-blur-md flex items-center gap-2 border border-white/10 animate-fade-in whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex flex-col w-full">
        {/* Interactive Pill Tabs Carousel */}
        <div
          id="library-tabs-container"
          className="px-margin pt-space-xs pb-space-sm flex items-center gap-space-sm overflow-x-auto no-scrollbar"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`filter-tab px-space-md py-space-xs rounded-full font-label-md text-label-md whitespace-nowrap transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-[0_4px_12px_rgba(66,29,219,0.2)]'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                }`}
              >
                {cat.icon && (
                  <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Spotlight Card: Liked Telugu & Bollywood Anthems */}
        <div className="px-margin mb-space-md">
          <div
            onClick={() => handlePlaySong(offlineSongs[0], 0)}
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-container via-primary to-surface-tint p-space-md text-on-primary shadow-[0_12px_28px_rgba(91,66,243,0.22)] cursor-pointer group"
          >
            {/* Playful Decorative Arc Shapes in Background */}
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none"></div>
            <div className="absolute right-4 -top-6 w-24 h-24 rounded-full bg-tertiary-fixed/30 blur-lg pointer-events-none"></div>

            <div className="relative z-10 flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-lowest/20 backdrop-blur-md text-on-primary font-label-sm text-label-sm uppercase tracking-wider font-bold">
                  <span className="material-symbols-outlined text-[14px] text-secondary-fixed">
                    favorite
                  </span>
                  Pinned Collection
                </span>
                <span className="font-body-sm text-body-sm text-on-primary-container/90">
                  Updated today
                </span>
              </div>

              <div className="flex items-center justify-between gap-space-md mt-space-xs">
                <div className="flex-1 min-w-0 text-left">
                  <h2 className="font-headline-md text-headline-md font-bold tracking-tight text-on-primary leading-tight">
                    Liked Telugu &amp; Bollywood Anthems
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary font-label-sm text-label-sm font-bold">
                      142 Songs
                    </span>
                    <span className="text-on-primary-container font-body-sm text-body-sm">
                      • 8h 45m
                    </span>
                  </div>
                </div>

                {/* Mosaic Collage Preview Stack with Play Floating Badge */}
                <div className="relative w-20 h-20 flex-shrink-0">
                  <div className="w-20 h-20 rounded-lg overflow-hidden grid grid-cols-2 grid-rows-2 gap-0.5 shadow-md bg-surface-container-lowest/15 p-0.5">
                    <img
                      className="w-full h-full object-cover rounded-sm"
                      alt="Cover 1"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbUWiuyE0aL6_6Awf3-TkiJgzB0jD3FZjyabCiUnb9igvLC5VWdego5EpzfUXo9KZiHvLgVAmvby9fIGj0PpLK7p-EiVIjHggzYoaCTlQnGhqZmwadiUpi5QjRlUqPC_Ak_HRml_9KkXi4NnKdX8dnRxw1cO1J2PmayvtEPGMbcdeC3qev255Osp5Mn8nR8H8qgkojUgNGc9h31pCDouxoyq-O3UZP8hNVKOD6J77ZUAhOHXLWZ0B3Vw"
                    />
                    <img
                      className="w-full h-full object-cover rounded-sm"
                      alt="Cover 2"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB73wY1uVjqsCW_uUHSsWsinczjH8zL7Xvt7OargaPEAb93PBsLMuJqUkEePzhdeRL1AVbZjNi3JHEuv73XUfAugnDhZMJNlYdAuLJaSx5Wy-wKfLcmDXBD_afk-Yyp9oyNA8L5BCERprLriDwe7AKAtmQKYTeRG8TyVOgNonVqE7dTXKO3iN-LPY7rNloonM9rWfztpOZHqsKtTRs9zyJe2irKtITp6IVwj_PxWpUU5_dKtZO4_PXPQQ"
                    />
                    <img
                      className="w-full h-full object-cover rounded-sm"
                      alt="Cover 3"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAjJdJfFti9LXx4mwKkv9QvP8tb_VZxL5cMi9vbumrU9v1gDXrTZMXtbV9V_nHRrgypCjAGygtkv05Pr_Dmn8VrQhCfboctWsralomX6uEBIQS1_AnZE0O5AmYawhdJkfwRrlzJT7-zzwRFv9N6Cky1dX2jF8_CRFmC4nbOpA_J7FKOUBMKOPN9xv5tkh06YPyENcje_viz6LIdxyi61cTZf3OMycoMSi3rQwqYqf3HbfQoN_DAMWbHg"
                    />
                    <img
                      className="w-full h-full object-cover rounded-sm"
                      alt="Cover 4"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7VqJqPRQChLKU2jj108FnZeJtCYKL_fSVTFyry7Z1GJcrFVmyS6L4Hk8RR4XuuQJEiW3iBa5NBaxqnXUa5mdy3hq7yMQvX92V_JEE4zprtJ0p4EeSZlXHDNpHU5PPS2lNxwt3J4BvyOnrj_xgbKwqMzeMJuGMEtAnM8WCl0y8hzzEqehNvni6lKlB8ee0Kj-uURCEWtJ8qCsyc8ZqcFdh6qzRBoGjJrlpMxQ8LVnIxrBo4NoF9MA_KA"
                    />
                  </div>
                  <button
                    aria-label="Play Liked Songs"
                    id="pinned-play-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaySong(offlineSongs[0], 0);
                    }}
                    className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-secondary-container text-on-secondary shadow-[0_4px_12px_rgba(254,93,57,0.4)] flex items-center justify-center transition-transform active:scale-90 cursor-pointer hover:scale-105"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      id="pinned-play-icon"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {currentTrack.id === offlineSongs[0].id && isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Waveform Sneak Peek */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  showToast('Melody Smart Radio Active');
                }}
                className="flex items-center justify-between pt-space-xs border-t border-on-primary/10 mt-1 cursor-pointer hover:opacity-90 active:scale-98 transition-all"
              >
                <div className="flex items-center gap-1.5 text-on-primary-container font-label-md text-label-md">
                  <span
                    className="material-symbols-outlined text-[16px] text-tertiary-fixed transition-transform duration-300"
                    id="radio-icon"
                  >
                    graphic_eq
                  </span>
                  <span id="radio-text">Shuffled by Melody Smart Radio</span>
                </div>
                <span
                  className="material-symbols-outlined text-on-primary text-[20px] transition-transform duration-300"
                  id="radio-chevron"
                >
                  chevron_right
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar: Create Playlist + Filter Dropdown */}
        <div className="px-margin mb-space-md flex items-center justify-between gap-space-sm relative">
          {/* Tactile Create Button */}
          <button
            id="create-playlist-btn"
            onClick={() => setCreateModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-space-xs py-2.5 px-space-md rounded-full bg-surface-container-high text-primary font-label-md text-label-md shadow-sm transition-all active:scale-95 hover:bg-surface-container-highest cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>New Playlist</span>
          </button>

          {/* Sort Dropdown Pill */}
          <div className="relative">
            <button
              id="sort-filter-btn"
              onClick={() => setSortOpen(!isSortOpen)}
              className="flex items-center gap-1.5 py-2.5 px-space-md rounded-full bg-surface-container-lowest shadow-sm text-on-surface font-label-md text-label-md transition-colors active:scale-95 border border-outline-variant/30 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-outline">swap_vert</span>
              <span id="sort-filter-label">{sortOption}</span>
              <span
                className={`material-symbols-outlined text-[16px] text-outline transition-transform duration-200 ${
                  isSortOpen ? 'rotate-180' : ''
                }`}
                id="sort-arrow"
              >
                expand_more
              </span>
            </button>

            {/* Dropdown Menu */}
            {isSortOpen && (
              <div
                id="sort-menu"
                className="absolute right-0 top-12 z-40 w-48 rounded-xl bg-surface-container-lowest p-1.5 shadow-[0_10px_24px_rgba(24,24,36,0.12)] border border-outline-variant/30 flex flex-col gap-1"
              >
                {['Recently Added', 'Alphabetical (A-Z)', 'Most Played'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSortOption(opt);
                      setSortOpen(false);
                      showToast(`Sorted by ${opt}`);
                    }}
                    className={`sort-option w-full text-left px-3 py-2 rounded-lg font-body-sm text-body-sm transition-colors flex items-center justify-between cursor-pointer ${
                      sortOption === opt
                        ? 'text-primary font-semibold bg-surface-container-low'
                        : 'text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <span>{opt}</span>
                    {sortOption === opt && (
                      <span className="material-symbols-outlined text-[16px] text-primary sort-check">
                        check
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Personal Playlists Grid (Exact 4 Cards from Stitch melody_library_playlists) */}
        <div className="px-margin mb-space-lg">
          <div className="flex items-center justify-between mb-space-sm">
            <div className="flex items-center gap-2">
              <h3 className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
                Your Playlists
              </h3>
              <span
                id="playlists-count-badge"
                className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-[11px] font-bold"
              >
                {playlists.length} Custom
              </span>
            </div>
            <button
              onClick={() => showToast('Manage Playlists')}
              className="flex items-center gap-1 font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant transition-colors group active:scale-95 font-semibold cursor-pointer"
            >
              <span>Manage</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-space-sm" id="playlists-grid">
            {playlists.map((pl, idx) => (
              <div
                key={pl.id}
                onClick={() => handlePlaySong(offlineSongs[idx % offlineSongs.length], idx % offlineSongs.length)}
                className="playlist-card group relative flex flex-col rounded-2xl bg-surface-container-lowest p-2.5 shadow-[0_4px_20px_rgba(24,24,36,0.06)] border border-outline-variant/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97] cursor-pointer text-left"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-[#3c10d7]/30 to-primary/40 shadow-inner mb-2.5">
                  <img
                    alt={pl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={pl.coverUrl}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-70 group-hover:opacity-60 transition-opacity"></div>

                  {/* Floating Category Pill */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center gap-1 shadow-sm">
                    <span className={`w-1.5 h-1.5 rounded-full ${pl.tagDotColor}`}></span>
                    <span className="text-[10px] font-bold text-white tracking-wide">{pl.tag}</span>
                  </div>

                  {/* Floating Frosted Glass Play Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaySong(offlineSongs[idx % offlineSongs.length], idx % offlineSongs.length);
                    }}
                    className={`playlist-card-play-btn absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center shadow-[0_4px_12px_rgba(66,29,219,0.25)] border border-white/60 group-hover:scale-110 transition-all duration-300 ${pl.playBtnColor}`}
                  >
                    <span
                      className="material-symbols-outlined text-[20px] ml-0.5"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      play_arrow
                    </span>
                  </button>
                </div>

                <div className="flex flex-col px-0.5">
                  <h4 className="font-title-md text-[15px] font-bold text-on-surface truncate leading-tight group-hover:text-primary transition-colors">
                    {pl.title}
                  </h4>
                  <div className="flex items-center justify-between mt-1 text-on-surface-variant text-[12px]">
                    <span className="truncate">{pl.trackInfo}</span>
                    <span className={`material-symbols-outlined text-[14px] shrink-0 ${pl.iconColor}`}>
                      {pl.icon}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* "Artists You Follow" Horizontal Avatar Row */}
        <div className="mb-space-lg">
          <div className="px-margin flex items-center justify-between mb-space-sm">
            <div className="flex items-center gap-2">
              <h3 className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
                Artists You Follow
              </h3>
              <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
            </div>
            <button
              onClick={() => showToast('Viewing All Followed Artists')}
              className="font-label-md text-label-md text-primary hover:underline cursor-pointer font-semibold"
            >
              View All
            </button>
          </div>

          {/* Scrolling Artist Cards */}
          <div className="flex items-start gap-space-md px-margin overflow-x-auto no-scrollbar pb-1">
            {artistsFollowed.map((artist) => (
              <div
                key={artist.id}
                onClick={() => handleToggleArtistFollow(artist.id, artist.name)}
                className="artist-item flex flex-col items-center w-20 flex-shrink-0 group cursor-pointer"
              >
                <div
                  className={`relative w-18 h-18 p-0.5 rounded-full transition-transform duration-300 group-hover:scale-105 active:scale-95 artist-ring ring-2 ring-transparent ${artist.ringClass}`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-surface-container-lowest p-0.5">
                    <img
                      alt={artist.name}
                      className="w-full h-full object-cover rounded-full"
                      src={artist.portraitUrl}
                    />
                  </div>
                  {/* New Release Badge */}
                  {artist.hasBadge && (
                    <span className="artist-badge absolute top-0 right-0 w-3.5 h-3.5 bg-secondary-container rounded-full ring-2 ring-surface shadow-sm"></span>
                  )}
                </div>
                <span className="mt-1.5 font-label-md text-label-md text-on-surface text-center truncate w-full group-hover:text-primary transition-colors font-medium">
                  {artist.name}
                </span>
                <span className={`font-label-sm text-label-sm ${artist.subtitleColor}`}>
                  {artist.subtitle}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access: Recently Downloaded Songs List (Offline Telugu Hits) */}
        <div className="px-margin pb-space-lg">
          <div className="flex items-center justify-between mb-space-sm">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">
                offline_pin
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
                Offline Telugu Hits
              </h3>
            </div>
            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-semibold">
              Saved Locally
            </span>
          </div>

          {/* Song Items Container */}
          <div className="space-y-space-xs" id="offline-songs-list">
            {offlineSongs.map((song, idx) => {
              const isSelected = activeOfflineIndex === idx;
              const isSongPlaying = currentTrack.id === song.id && isPlaying;

              return (
                <div
                  key={song.id}
                  onClick={() => handlePlaySong(song, idx)}
                  className={`song-item group flex items-center justify-between p-space-xs rounded-xl transition-all cursor-pointer active:scale-[0.99] border border-transparent hover:border-outline-variant/30 ${
                    isSelected ? 'bg-surface-container-low' : 'hover:bg-surface-container-lowest'
                  }`}
                >
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-container flex-shrink-0 shadow-sm song-thumb">
                      <img
                        alt={song.title}
                        className="w-full h-full object-cover"
                        src={song.coverUrl}
                      />
                      {(isSelected || isSongPlaying) && (
                        <div className="song-overlay absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <span className="song-icon material-symbols-outlined text-on-primary text-[20px]">
                            volume_up
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <p
                        className={`song-title font-title-md text-title-md truncate font-semibold ${
                          isSelected ? 'text-primary' : 'text-on-surface'
                        }`}
                      >
                        {song.title}
                      </p>
                      <p className="song-artist font-body-sm text-body-sm text-on-surface-variant truncate">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  {/* Equalizer / Play Action Container */}
                  <div className="song-trailing flex items-center justify-end">
                    {isSelected ? (
                      <div className="eq-bars flex items-end gap-0.5 h-4 px-2">
                        <span className="w-1 bg-secondary-container rounded-full h-3 eq-bar-1"></span>
                        <span className="w-1 bg-secondary-container rounded-full h-4 eq-bar-2"></span>
                        <span className="w-1 bg-secondary-container rounded-full h-2 eq-bar-3"></span>
                      </div>
                    ) : (
                      <button
                        aria-label={`Play ${song.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySong(song, idx);
                        }}
                        className="play-btn w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Create Playlist Modal */}
      {isCreateModalOpen && (
        <div
          id="playlist-modal"
          onClick={() => setCreateModalOpen(false)}
          className="absolute inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end justify-center p-4 transition-all duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-2xl border border-outline-variant/30 transform transition-transform"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">playlist_add</span>
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  New Playlist
                </h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="w-8 h-8 rounded-full text-outline hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleCreatePlaylistSubmit}>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">
                  Playlist Name
                </label>
                <input
                  autoFocus
                  id="playlist-name-input"
                  value={newPlaylistTitle}
                  onChange={(e) => setNewPlaylistTitle(e.target.value)}
                  placeholder="e.g., Telugu Drive Beats"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface placeholder:text-outline/70 focus:outline-none focus:ring-2 focus:ring-primary text-body-md"
                  type="text"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full bg-surface-container text-on-surface font-label-md active:scale-95 transition-all cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-primary text-on-primary font-label-md font-bold shadow-[0_4px_12px_rgba(66,29,219,0.25)] active:scale-95 transition-all cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
