import superagent from 'superagent';

export default function SpotifyAPI(params) {
  const { client_id, client_secret, refresh_token } = params;
  if (!client_id || !client_secret || !refresh_token) {
    throw new Error('SpotifyAPI is not configured. Maybe you need to set some env vars?');
  }

  var access_token = null;
  var access_token_expires_at = 0;

  async function startPlayingOnDevice ({device_name, context_uri}) {
    const device_id = await getDeviceId({ auth_token, device_name });
    const res = await superagent.put(`https://api.spotify.com/v1/me/player/play`)
      .set('Authorization', `Bearer ${await getAccessToken()}`)
      .query({ device_id })
      .send({ context_uri });
  }

  async function getCurrentPlayback() {
    const res = await superagent.get(`https://api.spotify.com/v1/me/player`)
      .set('Authorization', `Bearer ${await getAccessToken()}`)
    try {
      return { 
        is_playing: res.body?.is_playing,
        context_uri: res.body?.context?.uri,
        progress_ms: res.body?.progress_ms,
        item_uri: res.body?.item?.uri
      }
    } catch (e) {
      return {
        is_playing: false
      };
    }
  }

  async function getPlaylistName(playlist_uri) {
    const playlist_id = playlist_uri.split(':')[2];
    const res = await superagent.get(`https://api.spotify.com/v1/playlists/${playlist_id}`)
      .set('Authorization', `Bearer ${await getAccessToken()}`);
    return res.body.name;
  }

  async function loveItem(item_uri) {
    console.log('Loving item', item_uri);
    return superagent.put(`https://api.spotify.com/v1/me/tracks`)
      .set('Authorization', `Bearer ${await getAccessToken()}`)
      .send({ ids: [item_uri.split(":")[2]] });
  }

  async function removeItemFromPlaylist({ item_uri, context_uri }) {
    console.log('Removing item', item_uri, 'from playlist', context_uri);
    const playlist_id = context_uri.split(':')[2];
    return superagent.delete(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`)
      .set('Authorization', `Bearer ${await getAccessToken()}`)
      .send({ tracks: [{uri: item_uri}] });
  }
    
  async function getDeviceId({ device_name }) {
    const res = await superagent.get('https://api.spotify.com/v1/me/player/devices')
      .set('Authorization', `Bearer ${await getAccessToken()}`);
    const device = res.body.devices.find(device => device.name.includes(device_name));
    try {
      return device.id;
    } catch (e) {
      console.error(`No device found with name ${device_name}. Devices found:`,res.body);
      throw new Error(`No device found with name ${device_name}`);
    }
  }

  async function getAccessToken() {
    if (!access_token || access_token_expires_at < Date.now()) {
      await refreshAccessToken();
    }
    return access_token;
  }

  async function refreshAccessToken() {
    const ACCESS_TOKEN_EXPIRY_FUDGE = 1000 * 60;

    const res = await superagent.post('https://accounts.spotify.com/api/token')
      .auth(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .type('form')
      .send({
        grant_type: 'refresh_token',
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN
      });
    access_token = res.body.access_token;
    access_token_expires_at = (res.body.expires_in * 1000) + Date.now() - ACCESS_TOKEN_EXPIRY_FUDGE;
  }
  
  return {
    startPlayingOnDevice,
    getCurrentPlayback,
    getPlaylistName,
    loveItem,
    removeItemFromPlaylist
  };
}
