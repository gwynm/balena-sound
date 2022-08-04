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
  try {
    return device.id;
  } catch (e) {
    console.error(`No device found with name ${device_name}. Devices found:`,res.body);
    throw new Error(`No device found with name ${device_name}`);
  }
}

async function getCurrentContext() {
  const auth_token = await getAuthToken();
  const res = await superagent.get(`https://api.spotify.com/v1/me/player`)
    .set('Authorization', `Bearer ${auth_token}`)
  try {
    return res.body.context.uri;
  } catch (e) {
    return undefined;
  }
}

export { getAuthToken, startPlayingOnDevice, getCurrentContext };
