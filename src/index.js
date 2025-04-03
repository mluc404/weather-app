import "./styles.css";

class WeatherApp {
  constructor() {
    this.input = document.querySelector("#loc");
    this.searchBtn = document.querySelector("#searchBtn");
    this.weatherDisplay = document.querySelector(".weatherDisplay");
    this.main = document.querySelector("main");
    this.init();
  }
  init() {
    this.searchBtn.addEventListener("click", (e) => this.handleSearch(e));
    this.input.addEventListener("keypress", (e) => this.handleKeyPress(e));
  }

  async handleSearch(e) {
    e.preventDefault();
    await this.fetchAndDisplay();
  }
  async handleKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      await this.fetchAndDisplay();
    }
  }

  async fetchAndDisplay() {
    if (this.input.checkValidity()) {
      const finalInput = this.processInput(this.input);
      const jsonResponse = await this.getWeather(finalInput);
      console.log(jsonResponse);
      if (jsonResponse.locName !== "Error") {
        // only continue if input location is proper
        const weatherObj = this.processWeather(jsonResponse);
        this.displayWeather(weatherObj);
        this.displayImage(weatherObj);
      }
      this.input.value = "";
    }
  }

  // Function to process user input
  static DEFAULT_LOCATION = "london";
  processInput(input) {
    const lowTrimInput = input.value.toLocaleLowerCase().trim();
    const inputArr = lowTrimInput.split(" ");
    if (inputArr.length > 1) {
      return inputArr.join("%20");
    } else {
      return lowTrimInput;
    }
  }

  // Function to fetch data from API
  async getWeather(finalInput) {
    try {
      const response = await fetch(
        "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" +
          finalInput +
          "?unitGroup=us&key=PUZ7W68BYF79J538R4JS82TNM&contentType=json",
        { mode: "cors" }
      );
      const jsonResponse = await response.json();
      return jsonResponse;
    } catch (error) {
      console.log(error);
      this.showError("Please input a proper location");
      return { locName: "Error" };
    }
  }

  // Function to process the data from API
  processWeather(jsonResponse) {
    console.log(jsonResponse.currentConditions.datetime);

    if (!jsonResponse || jsonResponse.locName === "Error") {
      this.showError("Failed to process data");
      return { locName: "Error" };
    }
    return {
      locName: jsonResponse.resolvedAddress,
      locTime: jsonResponse.currentConditions.datetime,
      locTemp: jsonResponse.currentConditions.temp,
      locCondition: jsonResponse.currentConditions.conditions,
      locDescription: jsonResponse.description,
    };
  }

  // Function to display weather
  displayWeather(weatherObj) {
    const locName = document.querySelector(".locName");
    const locTime = document.querySelector(".locTime");
    const locTemp = document.querySelector(".locTemp");
    const locCondition = document.querySelector(".locCondition");
    const locDescription = document.querySelector(".locDescription");

    locName.textContent = weatherObj.locName;
    locTime.textContent = this.convertAmPm(weatherObj.locTime);
    locTemp.textContent = this.convertTemp(weatherObj.locTemp);
    locCondition.textContent = weatherObj.locCondition;
    locDescription.textContent = weatherObj.locDescription;
  }

  async displayImage(weatherObj) {
    const allConditions = ["clear", "rain", "sun", "cloud", "snow"]; // need one for overcast
    const mainCondition = weatherObj.locCondition
      .toLocaleLowerCase()
      .split(",")[0]
      .trim();

    for (const name of allConditions) {
      if (mainCondition.includes(name)) {
        const bg = await import(`./images/gif/${name}.gif`);
        // the 'default' is just a property of the object 'bg' that contains the img url
        this.main.style.backgroundImage = `url(${bg.default})`;
        return;
        // const bg = await import(`./images/${name}.jpeg`);
        // this.main.style.backgroundImage = `url(${bg.default})`;
        // return;
      }
    }
    // If there's no match, use the default bg
    const defaultBG = await import(`./images/default.jpeg`);
    console.log(defaultBG);
    this.main.style.backgroundImage = `url(${defaultBG.default})`;
  }

  showError(msg) {
    alert(msg);
  }

  convertAmPm(time24) {
    const timeArr = time24.split(":").slice(0, 2);
    const h = parseInt(timeArr[0]);
    const m = timeArr[1];
    if (h < 12) {
      return `${h}:${m} am`;
    } else if (h === 12) {
      return `${h}:${m} pm`;
    } else {
      return `${h - 12}:${m} pm`;
    }
  }

  convertTemp(tempF) {
    const tempC = (((tempF - 32) * 5) / 9).toFixed(1);
    return `${tempF}\u00B0F (${tempC}\u00B0C)`;
  }
}

const app = new WeatherApp();
