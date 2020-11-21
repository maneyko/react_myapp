import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

const user = {
  name: {
    first: "Peter",
    last:  "Maneykowski"
  }
}

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    };
  }

  tick() {
    this.setState({
      date: new Date()
    });
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

  greeting() {
    var hour = this.state.date.getHours();
    if (4 < hour && hour < 12) {
      return "Good Morning";
    } else if (12 <= hour && hour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  }

  formatName() {
    return `${this.props.user.name.first} ${this.props.user.name.last}`;
  }

  pageInfo() {
    return `This page was created by ${this.formatName()}`
  }


  render() {
    return (
      <React.Fragment>
        <h1>{this.greeting()}</h1>
        <h2>The time is {this.state.date.toLocaleTimeString()}</h2>
        <p><i>{this.pageInfo()}</i></p>
      </React.Fragment>
    );
  }
}

class Response extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: {}
    };
  }

  tick() {
    // fetch("https://maneyko.com/rails/echo", {
    var randomString = btoa(Math.random()).substr(10, 5);
    fetch(`https://maneyko.com/rails/echo?str=${randomString}`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            error: null,
            isLoaded: true,
            data: result.data,
          });
        },
        (error) => {
          this.setState({
            error: true,
            isLoaded: false,
            data: {str: ""}
          });
        }
      );
  }

  componentDidMount() {
    this.tick();

    this.timerID = setInterval(
      () => this.tick(),
      5000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return (
      <React.Fragment>
        <p>
          Random string: <code>{this.state.data.str}</code>
          <br/>
          Timestamp from server: {this.state.data.timestamp}
        </p>
      </React.Fragment>
    );
  }
}

const element = (
  <React.Fragment>
      <Welcome user={user} />
      <Response />
  </React.Fragment>
);

ReactDOM.render(element, document.getElementById('root'));
