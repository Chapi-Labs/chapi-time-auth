import uuid from 'uuid/v4';
import jwt from 'jsonwebtoken';
import config from '../config';

/**
 * Creates a signed JSON WebToken and returns it.  Utilizes the private certificate to create
 * the signed JWT.  For more options and other things you can change this to, please see:
 * https://github.com/auth0/node-jsonwebtoken
 *
 * @param  {Number} exp - The number of seconds for this token to expire.  By default it will be 60
 *                        minutes (3600 seconds) if nothing is passed in.
 * @param  {String} sub - The subject or identity of the token.
 * @return {String} The JWT Token
 */
const createToken = ({ exp = '1h', sub = '' } = {}) => {
    // synchronously  sign the JWT
    const token = jwt.sign(
      {
        jwtid: uuid(), // jwt iden  tifier
        sub, // subject
      },
      config.parsed.JWT_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: exp,
      },
    );

    return token;
};

/**
 * Verifies the token through the jwt library using the public certificate.
 * @param   {String} token - The token to verify
 * @throws  {Error} Error if the token could not be verified
 * @returns {Object} The token decoded and verified
 */
const verifyToken = token => jwt.verify(token, config.parsed.JWT_SECRET);

export default { createToken, verifyToken };