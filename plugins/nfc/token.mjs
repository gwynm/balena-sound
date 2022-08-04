// import { getAuthToken, getCurrentContext } from './spotify.mjs';
// // console.log('auth token', await getAuthToken());
// console.log('context', await getCurrentContext());


// const keyFileStorage = require("key-file-storage")
import dataStore from 'data-store';
const store = dataStore({ path: process.cwd() + '/foo.json' });
store.set('foo','bar');
