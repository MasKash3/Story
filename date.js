exports.getDate = function() {
  //can either use anonymous function to save space
  //or go normal way like in other function below
  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  let dayFull = today.toLocaleDateString("en-US", options);

  return dayFull;
}

//use let date = day.getDay(); to call it
//only shows weekday in long
exports.getDay = getDay;

function getDay() {
  let today = new Date();

  let options = {
    weekday: "long",
  };

  let dayFull = today.toLocaleDateString("en-US", options);

  return dayFull;
}
