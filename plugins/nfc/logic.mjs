import { startPlayingOnDevice, getCurrentContext } from './spotify.mjs';

import dataStore from 'data-store';
const store = dataStore({ path:'/data/store.json' });

const DEVICE_NAME = 'Balena';
const ERASE_CONTEXT = 'spotify:album:7431Bc80pipMjt6v3qm0U';
const ERASE_SUCCESS_CONTEXT = 'spotify:album:5XD78Fc6jfSfFYgwynseoI';

export async function handleTagRead(tag) {
  console.log('Tag read:',tag);
  const playing_context = await getCurrentContext();
  const db_context = store.get(tag);
  if (playing_context === ERASE_CONTEXT) {
    console.log('Erasing tag');
    store.del(tag);
    startPlayingOnDevice({device_name: DEVICE_NAME, context_uri: ERASE_SUCCESS_CONTEXT});
  } else if (db_context) {
    console.log('Database resolves this to context_uri:',db_context);
    startPlayingOnDevice({device_name: DEVICE_NAME, context_uri: db_context});
  } else {
    console.log('No context_uri found in database');
    if (playing_context) {
      store.set(tag,playing_context);
      console.log('Stored context_uri:',playing_context);
    } else {
      console.log('No context_uri currently playing; no action');
    }
  }
}
