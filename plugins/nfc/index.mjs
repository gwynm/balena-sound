import { spawn } from 'child_process';
import { handleTagRead } from './logic';

if (process.env.SPOTIFY_CLIENT_ID === undefined) {
  throw new Error('SPOTIFY_CLIENT_ID is not defined; terminating. See README for required env vars.');
}

console.log('NFC service starting up. Client id is ',process.env.SPOTIFY_CLIENT_ID);

await new Promise(resolve => setTimeout(resolve, 5000));

console.log('Starting tag reader');

var tag_reader = spawn('stdbuf',['-o0','-e0','./scan_for_tags.py'])

tag_reader.stdout.on('data', (data) => {
  handleTagRead(data.toString('utf8').replace(/\n/g, ''));
});

tag_reader.on('close', (code) => {
  throw new Error(`Tag reader exited with code ${code}`);
});

// Run indefinitely
setInterval(() => {}, 1 << 30);
