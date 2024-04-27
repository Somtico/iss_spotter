const { nextISSTimesForMyLocation } = require('./iss');
const printPassTimes = require("./printPassTimes");

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

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    console.log("It didn't work!", error);
  }

  printPassTimes(passTimes);
});
