//require v/s import
//we can selectively load pieces we need with import which can save memeory
//loading is synchronous for 'require' but can be asynchronous for 'import'

import {sub} from './math.js';

console.log(sub(5,4));