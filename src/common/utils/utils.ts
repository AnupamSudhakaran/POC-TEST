let crypto = require('crypto');
const jwt = require('jsonwebtoken');

import { v4 as uuidv4 } from 'uuid';
import { JSON_KEY } from '../common';
export const hashSHA = (inputString, key) => {

    // Create a HMAC using SHA-256 and the provided key
    const hmac = crypto.createHmac('sha256', key);

    // Update the HMAC with the input string
    hmac.update(inputString);

    // Finalize the HMAC and return the hexadecimal digest
    return hmac.digest('hex');
}

export const randomId = () =>{
    const time = Date.now().toString();
    const uuid = uuidv4().replaceAll("-","").slice(3,8);
    return `US${time.slice(3,8)}${uuid}`
}

export const randomEventId = () =>{
  const time = Date.now().toString();
  const uuid = uuidv4().replaceAll("-","").slice(3,8);
  return `EV${time.slice(3,8)}${uuid}`
}

export const generateJWT=(userId)=>{
    const options = {
        expiresIn: '15M', // Token will expire in 1 hour
      };
    
      const payload = {
        sub:userId,
        iss:"ravindra@gmail.com",
        name:"ravindra"
      }
      
      
      // Sign the token using the secret key
      const token = jwt.sign(payload, JSON_KEY, options);
    
      return token;
    
}

export const verfiyJWT= (token)=>{
    try {
        // Verify the token using the secret key
        // const decoded = jwt.verify(token);

        const decoded = jwt.decode(token);
        console.log('Decoded Payload:', decoded); // Token is valid, print decoded data
        return decoded;
      } catch (err) {
        // If the token is invalid or expired, catch the error
        console.error('Invalid or expired token:', err.message);
        throw err;
      }
    }
    



