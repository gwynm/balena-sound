import SpotifyAPI from './spotify.mjs';
console.log(SpotifyAPI);

const spotify = SpotifyAPI(
  { client_id: process.env.SPOTIFY_CLIENT_ID, 
    client_secret: process.env.SPOTIFY_CLIENT_SECRET, 
    refresh_token: process.env.SPOTIFY_REFRESH_TOKEN });

console.log(spotify);

console.log('state', await spotify.getCurrentPlayback());
