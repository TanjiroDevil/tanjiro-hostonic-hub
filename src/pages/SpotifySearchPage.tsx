import React, { useState, FormEvent } from 'react';
import { Search, Music, ExternalLink, Loader2, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionBackground } from '../components/SectionBackground';

interface Track {
  id: string;
  name: string;
  artist: string;
  url: string;
  image: string;
  duration_ms: number;
}

interface SpotifyResponse {
  status: string;
  total_results: number;
  tracks: Track[];
  dev?: string;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function SpotifySearchPage() {
  const [query, setQuery] = useState('');
  const [artist, setArtist] = useState('');
  const [limit, setLimit] = useState(10);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const params = new URLSearchParams({
        q: query.trim(),
        limit: String(limit),
      });
      if (artist.trim()) params.append('artist', artist.trim());

      const res = await fetch(`https://tanjirodev.online/api/spotify-search?${params.toString()}`);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data: SpotifyResponse = await res.json();

      if (data.status !== 'success') {
        throw new Error('API returned an error');
      }

      setTracks(data.tracks || []);
      setTotalResults(data.total_results || 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch results';
      setError(message);
      setTracks([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative" data-page="spotify-search">
      <SectionBackground />

      <section className="relative container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 mb-6">
            <Music className="h-8 w-8 text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Spotify <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Search</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Find tracks instantly by title or artist using our Spotify API.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 max-w-4xl mx-auto bg-gray-900/40 backdrop-blur-md border border-gray-700/40 rounded-2xl p-6 shadow-xl"
          data-spotify-search-form="true"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className="block text-sm text-gray-300 mb-2">Song / Query</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Lose Yourself"
                  className="w-full bg-gray-950/60 border border-gray-700/50 text-white placeholder-gray-500 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  data-input="query"
                  required
                />
              </div>
            </div>
            <div className="md:col-span-4">
              <label className="block text-sm text-gray-300 mb-2">Artist (optional)</label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="e.g. Eminem"
                className="w-full bg-gray-950/60 border border-gray-700/50 text-white placeholder-gray-500 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                data-input="artist"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300 mb-2">Limit</label>
              <input
                type="number"
                min={1}
                max={50}
                value={limit}
                onChange={(e) => setLimit(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                className="w-full bg-gray-950/60 border border-gray-700/50 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                data-input="limit"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="mt-5 w-full md:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
            data-action="search-submit"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Search
              </>
            )}
          </button>
        </motion.form>
      </section>

      {/* Results */}
      <section className="relative container mx-auto px-4 pb-24">
        {error && (
          <div className="max-w-4xl mx-auto bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 mb-6" data-state="error">
            {error}
          </div>
        )}

        {searched && !loading && !error && tracks.length === 0 && (
          <div className="max-w-4xl mx-auto text-center text-gray-400 py-12" data-state="empty">
            No tracks found. Try a different search.
          </div>
        )}

        {tracks.length > 0 && (
          <div className="max-w-6xl mx-auto" data-results-container="true" data-total-results={totalResults}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Results <span className="text-gray-400 text-sm font-normal">({totalResults})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" data-track-list="true">
              <AnimatePresence>
                {tracks.map((track, idx) => (
                  <motion.article
                    key={track.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    className="group relative bg-gray-900/40 backdrop-blur-md border border-gray-700/40 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:bg-gray-900/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
                    data-track-card="true"
                    data-track-id={track.id}
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-950">
                      <img
                        src={track.image}
                        alt={track.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        data-track-image={track.image}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent opacity-60" />
                      <a
                        href={track.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-green-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-green-500/40 hover:bg-green-400"
                        aria-label={`Play ${track.name} on Spotify`}
                        data-action="play-spotify"
                        data-track-url={track.url}
                      >
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                      </a>
                    </div>

                    <div className="p-4">
                      <h3
                        className="text-white font-semibold truncate group-hover:text-blue-400 transition-colors"
                        title={track.name}
                        data-track-name={track.name}
                      >
                        {track.name}
                      </h3>
                      <p
                        className="text-gray-400 text-sm truncate mt-1"
                        title={track.artist}
                        data-track-artist={track.artist}
                      >
                        {track.artist}
                      </p>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800/60">
                        <span
                          className="text-xs text-gray-500"
                          data-track-duration-ms={track.duration_ms}
                        >
                          {formatDuration(track.duration_ms)}
                        </span>
                        <a
                          href={track.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                          data-track-url={track.url}
                        >
                          Open
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
