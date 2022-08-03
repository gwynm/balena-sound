import superagent from 'superagent';

async function startPlayingOnDevice({device_name, context_uri}) {
  const auth_token = await getAuthToken();
  const device_id = await getDeviceId({ auth_token, device_name });
  const res = await superagent.put(`https://api.spotify.com/v1/me/player/play`)
    .set('Authorization', `Bearer ${auth_token}`)
    .query({ device_id })
    .send({ context_uri });
}

async function getAuthToken() {
  const res = await superagent.post('https://accounts.spotify.com/api/token')
    .auth(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .type('form')
    .send({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN
    });
  return res.body.access_token;
}

async function getDeviceId({ auth_token, device_name }) {
  const res = await superagent.get('https://api.spotify.com/v1/me/player/devices')
    .set('Authorization', `Bearer ${auth_token}`);
  const device = res.body.devices.find(device => device.name.includes(device_name));
  return device.id;
}

// await startPlayingOnDevice({ device_name: 'balena', context_uri: 'spotify:playlist:3mp80ZZefLobVNMUpC4t9M' });

console.log('Hello world; will terminate in 60s');
await new Promise(resolve => setTimeout(resolve, 60000));
console.log('Terminating');
