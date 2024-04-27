const { nextISSTimesForMyLocation } = require("./iss_promised");
const printPassTimes = require("./printPassTimes");

nextISSTimesForMyLocation()
  .then((body) => {
    printPassTimes(body);
  });
// .catch((error) => {
//   console.log("It didn't work: ", error.message);
// });
