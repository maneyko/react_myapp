import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

var moment = require("moment");

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
      date: new Date(),
      data: {},
      update_frequency: 5
    };
    this.handleChange = this.handleChange.bind(this);
  }

  tick() {
    this.setState({
      date: new Date()
    })

    if (moment().unix() % this.state.update_frequency !== 0) {
      return null;
    }
    // fetch("https://maneyko.com/rails/echo", {
    var randomString = btoa(Math.random()).substr(10, 5);
    fetch(`https://maneyko.com/rails/echo?str=${randomString}&sent_at=${moment().toISOString(true)}`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            error: null,
            isLoaded: true,
            data: result.data,
            processed_at: moment().toISOString(true)
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
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  handleChange(event) {
    this.setState({update_frequency: event.target.value})
  }

  render() {
    return (
      <React.Fragment>
        <table>
          <tbody>
            <tr>
              <td>Update every:</td>
              <td>
                <input type="text" value={this.state.update_frequency} name="update_frequency" onChange={this.handleChange} /> seconds
              </td>
            </tr>
            <tr>
              <td>Random string:</td>
              <td><code>{this.state.data.str}</code></td>
            </tr>
            <tr>
              <td>Request to server sent at:</td>
              <td><code>{this.state.data.sent_at}</code></td>
            </tr>
            <tr>
              <td>Timestamp from server:</td>
              <td><code>{this.state.data.timestamp}</code></td>
            </tr>
            <tr>
              <td>Rendered at:</td>
              <td><code>{this.state.processed_at}</code></td>
            </tr>
          </tbody>
        </table>
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
