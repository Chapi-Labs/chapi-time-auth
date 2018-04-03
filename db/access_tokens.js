import jwt from 'jsonwebtoken';
const mongoose = require('mongoose');

// The access tokens.
// You will use these to access your end point data through the means outlined
// in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
// (http://tools.ietf.org/html/rfc6750)

/**
 * Tokens model mongodb
 */
const RefreshToken = mongoose.model('RefreshToken', {
  id: String,
  clientID: String,
  expirationDate: Date,
  redirectURI: String,
  userID: String,
  scope: String,
});

const find = async (token) => {
  try {
    const tokenDecoded = jwt.decode(token);
    if (tokenDecoded === null) {
      return;
    }
    const dbToken = await RefreshToken.findOne({ id: tokenDecoded.jti });
    if (dbToken === null) {
      return;
    }
    return dbToken;
  } catch (error) {
    return;
  }
};

/**
 * Saves a access token, expiration date, user id, client id, and scope. Note: The actual full
 * access token is never saved.  Instead just the ID of the token is saved.  In case of a database
 * breach this prevents anyone from stealing the live tokens.
 * @param   {Object}  token          - The access token (required)
 * @param   {Date}    expirationDate - The expiration of the access token (required)
 * @param   {String}  userID         - The user ID (required)
 * @param   {String}  clientID       - The client ID (required)
 * @param   {String}  scope          - The scope (optional)
 * @returns {Promise} resolved with the saved token
 */
const save = async (code, expirationDate, userID, clientID, scope) => {
  try {
    const tokenId = jwt.decode(code).jti;
    const token = new RefreshToken({
      id: tokenId,
      expirationDate,
      userID,
      clientID,
      scope,
    });
    await token.save();
    return token;
  } catch (error) {
    throw new Error('Error saving token');
  }
};

/**
 * Deletes/Revokes an access token by getting the ID and removing it from the storage.
 * @param   {String}  token - The token to decode to get the id of the access token to delete.
 * @returns {Promise} resolved with the deleted token
 */
const remove = async (token) => {
  try {
    const tokenId = jwt.decode(token).jti;
    await RefreshToken.remove({ id: tokenId });
  } catch (error) {
    throw new Error('Error removing token');
  }

};

/**
 * Removes expired access tokens. It does this by looping through them all and then removing the
 * expired ones it finds.
 * @returns {Promise} resolved with an associative of tokens that were expired
 */
const removeExpired = async () => {
  try {
    const tokens = await RefreshToken.find();
    const keys = Object.keys(tokens);
    const expired = keys.reduce((accumulator, key) => {
      if (new Date() > tokens[key].expirationDate) {
        const expiredToken = tokens[key];
        RefreshToken.remove({ id: tokens[key].id }, (err, token) => {
          accumulator[key] = expiredToken; // eslint-disable-line no-param-reassign
        });
      }
      return accumulator;
    });
  } catch (error) {
    throw new Error('Error removing expired tokens');
  }
};

/**
 * Removes all access tokens.
 * @returns {Promise} resolved with all removed tokens returned
 */
const removeAll = async () => {
  try {
    await RefreshToken.remove();
  } catch (error) {
    throw new Error('Error removing all tokens');
  }
};

export default {
  find,
  save,
  remove,
  removeExpired,
  removeAll,
};
