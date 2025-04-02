import "./styles.css";

// const key = "PUZ7W68BYF79J538R4JS82TNM";
const input = document.querySelector("#loc");
const searchBtn = document.querySelector("#searchBtn");

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

searchBtn.addEventListener("click", () => {
  const finalInput = processInput(input);
  getWeather(finalInput);
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const finalInput = processInput(input);
    getWeather(finalInput);
  }
});

const getWeather = (finalInput) => {
  fetch(
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" +
      finalInput +
      "?unitGroup=us&key=PUZ7W68BYF79J538R4JS82TNM&contentType=json",
    { mod: "cors" }
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      console.log(response.resolvedAddress);
      console.log(response.description);
    });
};
