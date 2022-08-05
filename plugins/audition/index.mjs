import SpotifyAPI from './spotify.mjs';
import Logic from './logic.mjs';

const POLL_INTERVAL = 5000;
const AUDITION_MARKER = "(audition)";

var previous_state = null;

const spotify = SpotifyAPI({ client_id: process.env.SPOTIFY_CLIENT_ID, client_secret: process.env.SPOTIFY_CLIENT_SECRET, refresh_token: process.env.SPOTIFY_REFRESH_TOKEN });

async function heartbeat() {
  const current_state = await spotify.getCurrentPlaybackState();
  previous_state = processPlayback({current_state,previous_state});
}

async function processPlayback({current_state,previous_state}) {
  if (!current_state.is_playing) {
    return null; //take no action and zero out previous_state for next time
  }
  if (previous_state === null) {
    return current_state; // we are starting playback. Take no action now but remember this state for next poll.
  } else if (Logic.isRepeat(current_state,previous_state)) {
    spotify.loveItem(current_state.item_uri);
  } else if (isAuditionPlaylist(current_state) && Logic.isSkip(current_state,previous_state)) {
    spotify.removeItemFromPlaylist({ item_uri: current_state.item_uri, context_uri: current_state.context_uri });
  }
  return current_state;
}

async function isAuditionPlaylist(current_state) {
  if (current_state.context_uri && current_state.context_uri.include?("spotify:playlist:")) {
    const playlist_name = await spotify.getPlaylistName(current_state.context_uri);
    return playlist_name.includes("Audition");
  }
  const res = await spotify.getPlaylist(current_state.context_uri);
  return res.includes(AUDITION_MARKER);
}

console.log('Starting heartbeat...');
setInterval(heartbeat, POLL_INTERVAL);
