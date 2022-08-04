import { startPlayingOnDevice, getCurrentContext } from './spotify';
import { keyFileStorage } from './keyFileStorage';

const kfs = keyFileStorage('/data', false); 

const DEVICE_NAME = 'Balena';
const ERASE_CONTEXT = 'spotify:album:7431Bc80pipMjt6v3qm0U';
const ERASE_SUCCESS_CONTEXT = 'spotify:album:5XD78Fc6jfSfFYgwynseoI';

export async function handleTagRead(tag) {
  console.log('Tag read:',tag);
  const context = await getCurrentContext();
  if (context === ERASE_CONTEXT) {
    console.log('Erasing tag');
    kfs[tag] = undefined;
    startPlayingOnDevice({device_name: DEVICE_NAME, context_uri: ERASE_SUCCESS_CONTEXT});
  } else if (kfs[tag]) {
    console.log('Database resolves this to context_uri:',kfs[tag]);
    startPlayingOnDevice({device_name: DEVICE_NAME, context_uri: kfs[tag]});
  } else {
    console.log('No context_uri found in database');
    if (context) {
      kfs[tag] = context;
      console.log('Stored context_uri:',context);
    } else {
      console.log('No context_uri currently playing; no action');
    }
  }
}
