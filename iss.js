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

const fetchCoordsByIP = (myIp, callback) => {
  const url = `https://ipwho.is/${myIp}`;

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
      const msg = `Success status was ${data.success}. Server message says: ${data.message} when fetching for IP ${myIp}`;
      callback(new Error(msg), null);
      return;
    }

    const geolocation = {
      latitude: data.latitude,
      longitude: data.longitude,
    };

    callback(null, geolocation);
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}&n=3`;

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

    const flyOverTimes = {
      risetime1: data.response[0].risetime,
      duration1: data.response[0].duration,
      risetime2: data.response[1].risetime,
      duration2: data.response[1].duration,
    };

    callback(null, flyOverTimes);
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };
