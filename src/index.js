import "./styles.css";

class WeatherApp {
  static DEFAULT_LOCATION = "san diego";

  constructor() {
    this.input = document.querySelector("#loc");
    this.searchBtn = document.querySelector("#searchBtn");
    this.weatherDisplay = document.querySelector(".weatherDisplay");
    this.appContent = document.querySelector(".appContent");
    this.tempOptions = document.querySelectorAll("input[name='tempChoice']");
    this.tempChoice = "F"; // default temperature in Fahrenheit
    this.tempValue = null;
    this.init();
  }
  init() {
    this.searchBtn.addEventListener("click", (e) => this.handleSearch(e));
    this.input.addEventListener("keypress", (e) => this.handleKeyPress(e));
    this.fetchAndDisplayDefault(); // display default location on startup
    this.tempOptions.forEach(
      (
        choice // F and C temperature switch
      ) =>
        choice.addEventListener("change", (e) => {
          this.selectTemp(e);
        })
    );
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
      const finalInput = this.processInput(this.input.value);
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

  // Function to display default location on startup
  async fetchAndDisplayDefault() {
    const finalInput = this.processInput(this.constructor.DEFAULT_LOCATION);
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

  // Function to process user input
  processInput(input) {
    const lowTrimInput = input.toLocaleLowerCase().trim();
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
    this.tempValue = jsonResponse.currentConditions.temp;
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

    locName.textContent = this.getCityName(weatherObj.locName);
    locTime.textContent = this.convertAmPm(weatherObj.locTime);
    // Convert temp into user's preference system
    if (this.tempChoice === "F") {
      locTemp.textContent = `\u{1F321} ${weatherObj.locTemp}\u00B0`;
    } else {
      this.convertTemp(this.tempChoice, weatherObj.locTemp);
      locTemp.textContent = `\u{1F321} ${this.tempValue}\u00B0`;
    }
    locCondition.textContent = weatherObj.locCondition;
    locDescription.textContent = weatherObj.locDescription;
  }

  async displayImage(weatherObj) {
    const allConditions = ["clear", "rain", "sun", "cloud", "snow", "overcast"];
    const mainCondition = weatherObj.locCondition
      .toLocaleLowerCase()
      .split(",")[0]
      .trim();

    for (const name of allConditions) {
      if (mainCondition.includes(name)) {
        const bg = await import(`./images/gif/${name}.gif`);
        // the 'default' is just a property of the object 'bg' that contains the img url
        this.appContent.style.backgroundImage = `url(${bg.default})`;
        return;
      }
    }
    // If there's no match, use the default bg
    const defaultBG = await import(`./images/default.jpeg`);
    this.appContent.style.backgroundImage = `url(${defaultBG.default})`;
  }

  showError(msg) {
    alert(msg);
  }

  getCityName(name) {
    return name.split(",")[0];
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

  convertTemp(choice, currentTemp) {
    console.log(currentTemp);
    if (choice === "C") {
      const tempC = (((currentTemp - 32) * 5) / 9).toFixed(1);
      this.tempValue = tempC;
      return;
    }
    if (choice === "F") {
      const tempF = ((currentTemp * 9) / 5 + 32).toFixed(1);
      this.tempValue = tempF;
      return;
    }
  }

  selectTemp(e) {
    if (e.target.checked && e.target.value !== this.tempChoice) {
      const newTemp = this.convertTemp(e.target.value, this.tempValue);
      this.tempChoice = e.target.value;
      document.querySelector(
        ".locTemp"
      ).textContent = `\u{1F321} ${this.tempValue}\u00B0`;
    }
  }
}

const app = new WeatherApp();
