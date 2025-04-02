import "./styles.css";

const input = document.querySelector("#loc");
const searchBtn = document.querySelector("#searchBtn");
let weatherObj;

// Function to process user input
const processInput = (input) => {
  let finalInput = "London";
  const inputArr = input.value.toLocaleLowerCase().trim().split(" ");
  if (inputArr.length > 0) {
    finalInput = inputArr.join("%20");
  } else {
    finalInput = input;
  }
  return finalInput;
};

// Function to fetch data from API
async function getWeather(finalInput) {
  try {
    const response = await fetch(
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" +
        finalInput +
        "?unitGroup=us&key=PUZ7W68BYF79J538R4JS82TNM&contentType=json",
      { mode: "cors" }
    );
    console.log(response);
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.log(error);
    alert("Please in put a proper location");
  }
}

// Function to process the data from API
const processWeather = (jsonResponse) => {
  console.log(jsonResponse);
  try {
    const locName = jsonResponse.resolvedAddress;
    const locTime = jsonResponse.currentConditions.datetime;
    const locTemp = jsonResponse.currentConditions.temp;
    const locCondition = jsonResponse.currentConditions.conditions;
    const locDescription = jsonResponse.description;
    return { locName, locTime, locTemp, locCondition, locDescription };
  } catch (error) {
    console.log(error);
    alert("Alert 2");
  }
};

let form = document.querySelector("form");
searchBtn.addEventListener("click", async (e) => {
  if (form.checkValidity()) {
    e.preventDefault();
    const finalInput = processInput(input);
    const jsonResponse = await getWeather(finalInput);
    weatherObj = processWeather(jsonResponse);
    console.log(weatherObj);
    displayWeather(weatherObj);

    // Clear input
    form.reset();
  }
});

input.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    if (form.checkValidity()) {
      e.preventDefault();
      const finalInput = processInput(input);
      const jsonResponse = await getWeather(finalInput);
      weatherObj = processWeather(jsonResponse);
      console.log(weatherObj);
      displayWeather(weatherObj);

      // Clear input
      form.reset();
    }
  }
});

const allConditions = ["clear", "rain", "sun", "cloud", "snow"];
const main = document.querySelector("main");
// Function to display weather
const displayWeather = (weatherObj) => {
  // const locName = document.querySelector(".locName");
  // const locTime = document.querySelector(".locTime");
  // const locTemp = document.querySelector(".locTemp");
  // const locCondition = document.querySelector(".locCondition");
  // const locDescription = document.querySelector(".locDescription");
  const weatherDisplay = document.querySelector(".weatherDisplay");
  const allDivs = weatherDisplay.querySelectorAll("div");

  allDivs.forEach((div) => {
    div.textContent = weatherObj[div.className];
  });

  console.log(weatherObj.locCondition);
  allConditions.forEach(async (name) => {
    const mainCondition = weatherObj.locCondition
      .toLocaleLowerCase()
      .split(",")[0];
    if (mainCondition.includes(name)) {
      const bg = await import(`./images/${name}.jpeg`);
      console.log(bg);
      main.style.backgroundImage = `url(${bg.default})`;
    }
  });
};
