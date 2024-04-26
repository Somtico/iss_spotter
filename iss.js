/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require("request");

// JSON API

const fetchMyIP = (callback) => {
  const url = "https://api.ipify.org?format=json";

  // use request to fetch IP address from JSON API
  request(url, (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    // Parse the returned JSON body
    const data = JSON.parse(body);

    // Extract the IP address
    const ip = data.ip;

    // Call the callback function with the IP address
    callback(null, ip);
  });
};

const fetchCoordsByIP = (callback) => {
  // Call fetchMyIP to get the IP address
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("Error:", error);
      return;
    }

    const url = `https://ipwho.is/${ip}`;

    request(url, (error, response, body) => {
      if (error) {
        callback(error, null);
        return;
      }

      if (!response && response.statusCode !== 200) {
        const msg = `Status code ${response.statusCode} when geolocation is fetched.`;
        callback(Error(msg), null);
        return;
      }

      const data = JSON.parse(body);

      // Check if the API request was successful
      if (!data.success) {
        const msg = `Success status was ${data.success}. Server message says: ${data.message} when fetching for IP ${ip}`;
        callback(new Error(msg), null);
        return;
      }

      const coords = {
        latitude: data.latitude,
        longitude: data.longitude,
      };

      callback(null, coords);
    });
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = (callback) => {
  fetchCoordsByIP((error, coords) => {
    if (error) {
      console.log("Error:", error);
      return;
    }

    const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}&n`;

    request(url, (error, res, body) => {
      if (error) {
        callback(error, null);
        return;
      }

      if (!res && res.statusCode) {
        const msg = `Success status was ${res.statusCode} when fetching fly-over times for ISS.`;
        callback(Error(msg), null);
        return;
      }

      const data = JSON.parse(body);

      const nextPasses = data.response.map((pass) => {
        const response = { risetime: pass.risetime, duration: pass.duration };
        return response;
      });

      callback(null, nextPasses);
    });
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = (callback) => {
  fetchISSFlyOverTimes((error, nextPasses) => {
    if (error) {
      console.log("Error:", error);
      return;
    }
    callback(error, nextPasses);
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation,
};
