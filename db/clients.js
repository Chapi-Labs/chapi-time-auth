import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * This is the configuration of the clients that are allowed to connected to your authorization
 * server. These represent client applications that can connect. At a minimum you need the required
 * properties of
 *
 * id:           A unique numeric id of your client application
 * name:         The name of your client application
 * clientId:     A unique id of your client application
 * clientSecret: A unique password(ish) secret that is _best not_ shared with anyone but your
 *               client application and the authorization server.
 *
 * Optionally you can set these properties which are
 *
 * trustedClient: default if missing is false. If this is set to true then the client is regarded
 * as a trusted client and not a 3rd party application. That means that the user will not be
 * presented with a decision dialog with the trusted application and that the trusted application
 * gets full scope access without the user having to make a decision to allow or disallow the scope
 * access.
 */
// Models
const clientSchema = new Schema({
  id: String,
  name: String,
  clientId: String,
  clientSecret: String,
  trustedClient: Boolean,
});
const Client = mongoose.model('Client', clientSchema, 'client');

/**
 * Returns a client if it finds one, otherwise returns null if a client is not found.
 * @param   {String}   id   - The unique id of the client to find
 * @returns {Promise}  resolved promise with the client if found, otherwise undefined
 */
const find = async (id) => {
  try {
    const client =  await Client.findOne({ id }).lean();
    return client;
  } catch (error) {
    return null;
  }
};

/**
 * Returns a client if it finds one, otherwise returns null if a client is not found.
 * @param   {String}   clientId - The unique client id of the client to find
 * @param   {Function} done     - The client if found, otherwise returns undefined
 * @returns {Promise} resolved promise with the client if found, otherwise undefined
 */
const findByClientId = async (clientId) => {
  try {
    const client = await Client.findOne({ clientId }).lean();
    return client;
  } catch (error) {
    return null;
  }
};

export default { find, findByClientId };
