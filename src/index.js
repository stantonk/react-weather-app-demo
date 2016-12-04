import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import './index.css';
import axios from 'axios';

// needs to be in main source file for React Developer Tools to work
// http://stackoverflow.com/questions/26347489/react-dev-tools-not-loading-in-chrome-browser
if (typeof window !== 'undefined') {
    window.React = React;
}


// ReactDOM.render(
//     <App />,
//     document.getElementById('root')
// );



// const element = <h1>ninjas are great</h1>;
// ReactDOM.render(
//     element,
//     document.getElementById('root')
// );

// function tick() {
//     const el = (
//         <div>
//             <h1>A clock!</h1>
//             <h1>{new Date().toLocaleTimeString()}</h1>
//         </div>
//     );
//     ReactDOM.render(el, document.getElementById('root'));
// }
//
// setInterval(tick, 1000);


//
//
// function App(props) {
//     return (
//         <div>
//             <Welcome name="Kevin" />
//             <Welcome name="Batman" />
//         </div>
//     )
// }
//
// ReactDOM.render(
//     <App />,
//     document.getElementById('root')
// );

function FormattedDate(props) {
    return <h2>{props.date.toLocaleTimeString()}</h2>;
}

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date()};
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );

    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({date: new Date()});
    }

    render() {
        return (
            <div>
                <FormattedDate date={this.state.date} />
            </div>
        );
    }
}

class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isToggleOn: true};
        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);

        this.externalOnClickHandler = props.onClick;
    }

    handleClick() {
        var state = null;
        this.setState(prevState => {
            state = !prevState.isToggleOn;
            return ({
                isToggleOn: state
            })
        });
        this.externalOnClickHandler(state);
    }

    render() {
        return (
            <button onClick={this.handleClick}>
                {this.state.isToggleOn ? 'ON' : 'OFF'}
            </button>
        );
    }
}

class HideableClock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isClockShown: false};
        this.handleToggleOnClick = this.handleToggleOnClick.bind(this);
    }

    handleToggleOnClick() {
        this.setState(
            prevState => ({isClockShown: !prevState.isClockShown})
        );
    }

    render() {
        const isVisible = this.state.isClockShown;
        let clock = null;
        if (isVisible) {
            clock = <Clock />
        } else {
            clock = <div />
        }
        return (
            <div>
                <Toggle onClick={this.handleToggleOnClick}/>
                {clock}
            </div>
        );
    }
}

// const NumberList = props => {
//     const items = props.numbers.map(n => <li key={n.toString()}>{n}</li>);
//     return <ul>{items}</ul>;
// }
// ReactDOM.render(
//     <NumberList numbers={[1,2,3,4,5]}/>,
//     document.getElementById('root')
// );

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

    degToCompass(num) {
        var val = Math.floor((num / 22.5) + .5);
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
