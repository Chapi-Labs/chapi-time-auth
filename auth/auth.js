const passport                             = require('passport');
const { Strategy: LocalStrategy }          = require('passport-local');
const { BasicStrategy }                    = require('passport-http');
const { Strategy: ClientPasswordStrategy } = require('passport-oauth2-client-password');
const { Strategy: BearerStrategy }         = require('passport-http-bearer');
import db                                   from '../db';
import utils                                from '../utils/utils';

/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(new LocalStrategy((username, password, done) => {
   try {
     const user = db.users.findByUsername(username);
     if (user.password !== password) {
       // error
       return done(null, false);
     }
     return done(null, user);
   } catch (error) {
     done(null, false);
   }
}));

/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients.  They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens.  The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate.  Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header).  While this approach is not recommended by
 * the specification, in practice it is quite common.
 */
passport.use(new BasicStrategy(async (clientId, clientSecret, done) => {
  try {
    const client = await db.clients.findByClientId(clientId);
    if (client.clientSecret !== clientSecret) {
      return done(null, false);
    }
    return done(null, client);
  } catch (error) {
    return done(null, false);
  }
}));

/**
 * Client Password strategy
 *
 * The OAuth 2.0 client password authentication strategy authenticates clients
 * using a client ID and client secret. The strategy requires a verify callback,
 * which accepts those credentials and calls done providing a client.
 */
passport.use(new ClientPasswordStrategy(async (clientId, clientSecret, done) => {
  try {
    const client = await db.clients.findByClientId(clientId);
    if (client.clientSecret !== clientSecret) {
      return done(null, false);
    }
    return done(null, client);
  } catch (error) {
    return done(null, false);
  }
}));

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token).  If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 *
 * To keep this example simple, restricted scopes are not implemented, and this is just for
 * illustrative purposes
 */
passport.use(new BearerStrategy(async(accessToken, done) => {
    //validate jwt token
    try {
      const token = utils.verifyToken(accessToken);
      if (!token) {
        return done(null, false);
      }
      if (token.sub) {
        const user = await db.users.findById(token.sub);
        return done(null, user, { scope: '*'});
      } else {
        const client = await db.clients.findByClientId(token.clientID);
        return done(null, client, { scope: '*'} );
      }
      
    } catch (error) {
      return done(null, false);
    }
    
}));

// Register serialialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated.  To complete the transaction, the
// user must authenticate and approve the authorization request.  Because this
// may involve multiple HTTPS request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session.  Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.users.find(id)
        .then(user => done(null, user))
        .catch(err => done(err));
});
