import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import './index.css';

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

function App(props) {
    return (
        <div>
            <HideableClock />
        </div>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
