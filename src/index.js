import React from "react";
import ReactDOM from "react-dom";
// import App from './App';
import "./index.css";
import axios from "axios";

// needs to be in main source file for React Developer Tools to work
// http://stackoverflow.com/questions/26347489/react-dev-tools-not-loading-in-chrome-browser
if (typeof window !== "undefined") {
    window.React = React;
}

const OPEN_WEATHER_MAP_APP_ID = "b1b15e88fa797225412429c1c50c122a1";
const OPEN_WEATHER_MAP_API_KEY = "5fbdc15aa968e111e6591e9152309526";
const WEATHER_ENDPOINT = "http://api.openweathermap.org/data/2.5/weather";

class Weather extends React.Component {
    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this.state = {weather: {}, isLoaded: false, hasError: false};
    }

    getWeatherAndUpdateState() {
        // this is not ideal :P
        var url = WEATHER_ENDPOINT+"?"+"q="+this.props.city+"&units=imperial"+"&appid="+OPEN_WEATHER_MAP_APP_ID+"&apikey="+OPEN_WEATHER_MAP_API_KEY;
        console.log(url);
        axios.get(url)
            .then(res => {
                console.log(res);
                this.setState({isLoaded: true, weather: res.data, hasError: false});
            })
            .catch((e) => {
                console.log(e);
                this.setState({isLoaded: true, weather: {}, hasError: true});
            });
    }

    componentDidMount() {
        this.getWeatherAndUpdateState();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.city !== this.props.city) {
            this.getWeatherAndUpdateState();
        }
    }

    // http://stackoverflow.com/questions/7490660/converting-wind-direction-in-angles-to-text-words
    degToCompass(num) {
        var val = Math.floor((num / 22.5) + 0.5);
        var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        var index = val % 16;
        return arr[index];
    }

    render() {
        var currentWeather = "Loading...";
        var description = "";
        var humidity = "";
        var wind = "";

        var element = <div style={{clear: "left", color: "red"}}><span>Error :-X</span></div>;
        if (!this.state.hasError) {
            if (this.state.isLoaded) {
                currentWeather = Math.round(this.state.weather.main.temp) + "F";
                description = this.state.weather.weather[0].description;
                humidity = this.state.weather.main.humidity;
                wind = this.state.weather.wind.speed + " mph " + this.degToCompass(this.state.weather.wind.deg);
            }
            element = (
                <div style={{clear: "left", color: "black"}}>
                    <span>{currentWeather}</span>
                    <br />
                    <span>{description}</span>
                    <br />
                    <span>humidity {humidity}%</span>
                    <br />
                    <span>wind {wind}</span>
                </div>
            );
        }

        return element;
    }
}

class EditableWeather extends React.Component {
    constructor(props) {
        super(props);
        this.state = {cityValue: "Chicago", city: "Chicago"};
        // This binding is necessary to make `this` work in the callback
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({cityValue: event.target.value})
    }

    handleSubmit(event) {
        console.log("submit");
        event.preventDefault();
        this.setState({city: this.state.cityValue});
    }

    render() {
        return (
            <div style={{fontSize: "20pt", padding: "5px"}}>
                <div>
                    <span style={{fontWeight: "bold", float: "left"}}>Current Weather</span>
                    <form style={{float: "left", marginLeft: "5px"}} onSubmit={this.handleSubmit}>
                        <input style={{fontSize: "16pt", width:"200px"}} type="text" value={this.state.cityValue} onChange={this.handleChange}/>
                        <button style={{fontSize: "16pt"}} type="submit">Update</button>
                    </form>
                </div>
                <Weather city={this.state.city}/>
            </div>
        );
    }
}

function App(props) {
    return (
        <div>
            <EditableWeather city="London"/>
        </div>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
