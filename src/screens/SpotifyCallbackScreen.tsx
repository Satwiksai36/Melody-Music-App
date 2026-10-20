/**
 * Spotify OAuth Callback Screen
 *
 * Handles the redirect from Spotify after the user grants authorization.
 * Exchanges the authorization code for tokens using PKCE, fetches the user
 * profile, initialises the player SDK, then redirects to /home.
 *
 * Route: /callback
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyAuth, spotifyPlayer } from '../services/spotify';
import { usePlayer } from '../context/PlayerContext';

type CallbackState = 'processing' | 'success' | 'error';

const SpotifyCallbackScreen: React.FC = () => {
  const navigate = useNavigate();
  const { connectSpotify: _connectSpotify } = usePlayer();
  const [state, setState] = useState<CallbackState>('processing');
  const [message, setMessage] = useState('Connecting to Spotify…');

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        setState('error');
        setMessage(
          error === 'access_denied'
            ? 'Spotify access was denied. You can try connecting again from Settings.'
            : `Spotify returned an error: ${error}`
        );
        return;
      }

      if (!code) {
        setState('error');
        setMessage('No authorization code received. Please try connecting again.');
        return;
      }

      try {
        setMessage('Exchanging authorization code…');
        const tokens = await spotifyAuth.exchangeCode(code);

        setMessage('Fetching your Spotify profile…');
        const user = await spotifyAuth.fetchUser(tokens.accessToken);

        setMessage(
          user.isPremium
            ? 'Initialising full-track playback (Spotify Premium)…'
            : 'Setting up preview playback…'
        );
        await spotifyPlayer.initialize(tokens.accessToken);

        setState('success');
        setMessage(`Connected as ${user.name}!`);

        // Small visual pause before redirect
        setTimeout(() => navigate('/home', { replace: true }), 1200);
      } catch (err: unknown) {
        setState('error');
        const msg = err instanceof Error ? err.message : 'Connection failed';
        setMessage(msg);
      }
    };

    handleCallback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0118] via-[#1a0533] to-[#0d0118] flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6 text-center max-w-sm w-full">
        {/* Melody logo */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a855f7] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-purple-500/40">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 18V5l12-2v13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="6" cy="18" r="3" stroke="white" strokeWidth="2"/>
              <circle cx="18" cy="16" r="3" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Melody</span>
        </div>

        {/* Status indicator */}
        {state === 'processing' && (
          <div className="w-14 h-14 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" />
        )}
        {state === 'success' && (
          <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        {state === 'error' && (
          <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}

        <p className={`text-base font-medium ${
          state === 'success' ? 'text-green-400' : state === 'error' ? 'text-red-400' : 'text-white/80'
        }`}>
          {message}
        </p>

        {state === 'error' && (
          <button
            onClick={() => navigate('/home', { replace: true })}
            className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors"
          >
            Go to Melody
          </button>
        )}
      </div>
    </div>
  );
};

export default SpotifyCallbackScreen;

