import {randomBytes,pbkdf2Sync} from 'node:crypto';
import readline from 'node:readline';
const rl=readline.createInterface({input:process.stdin,output:process.stdout});
rl.question('Enter a NEW password (input visible; run privately): ',p=>{
rl.close();if(p.length<16){console.error('Use at least 16 characters');process.exitCode=1;return}
const salt=randomBytes(24);console.log('ADMIN_PASSWORD_SALT='+salt.toString('base64url'));console.log('ADMIN_PASSWORD_HASH='+pbkdf2Sync(p,salt,600000,32,'sha256').toString('base64url'));console.log('SESSION_SECRET='+randomBytes(48).toString('base64url'));
});