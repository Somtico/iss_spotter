const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss');

// // fetchMyIP((error, ip) => {
// //   if (error) {
// //     console.log("It didn't work!" , error);
// //     return;
// //   }

//   console.log('It worked! Returned IP:' , ip);
// });

// fetchCoordsByIP((error, data) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log('It worked! Returned Geolocation:' , data);
// });

// fetchISSFlyOverTimes((error, data) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }

//   console.log('It worked! Returned ISS fly-over times:', data);
// });

const printPassTimes = (passTimes) => {
  for (const time of passTimes) {
    const dateTime = new Date(0);
    dateTime.setUTCSeconds(time.risetime);
    
    const duration = time.duration;
    console.log(`Next pass at ${dateTime} for ${duration} seconds!`)
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    console.log("It didn't work!", error);
  }

  printPassTimes(passTimes);
});
