import React    from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

var $      = require("jquery");
var moment = require("moment");

const author = {
  name: {
    first: "Peter",
    last:  "Maneykowski"
  }
};

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment()
    };
  }

  async componentDidMount() {
    await new Promise(resolve => setTimeout(resolve, 1000 - moment().milliseconds()));
    this.tick();

    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: moment()
    });
  }

  greeting() {
    var hour = this.state.date.hour();
    if (4 < hour && hour < 12) {
      return "Good Morning";
    } else if (12 <= hour && hour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  }

  formatName() {
    return `${this.props.author.name.first} ${this.props.author.name.last}`;
  }

  pageInfo() {
    return `This page was created by ${this.formatName()}`;
  }


  render() {
    return (
      <React.Fragment>
        <h1>{this.greeting()}</h1>
        <h2>The time is {this.state.date.format("h:mm:ss A")}</h2>
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
      date: moment(),
      data: {},
      update_frequency: 5,
      timer_frequency: 1000
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    await new Promise(resolve => setTimeout(resolve, this.state.timer_frequency - moment().milliseconds()));

    this.setState({
      timerID: setInterval(() => this.tick(), this.state.timer_frequency)
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.timerID);
  }

  handleChange(event) {
    this.setState({update_frequency: event.target.value});
  }

  tick() {
    this.setState({
      date: moment()
    });

    if (this.state.date.unix() % this.state.update_frequency !== 0) {
      return null;
    }

    var randomString = btoa(Math.random()).substr(10, 5);

    $.ajax({
      method: "GET",
      url: "https://maneyko.com/rails/echo",
      data: {
        str: randomString,
        sent_at: moment().toISOString(true)
      },
      success: (res) => {
        this.setState({
          error: null,
          data: res.data,
          processed_at: moment().toISOString(true)
        })
      }
    })
    .fail(() => {
      this.setState({
        error: true,
        data: {str: ""}
      })
    });
  }

  render() {
    return (
      <React.Fragment>
        <table>
          <tbody>
            <tr>
              <td>Request every:</td>
              <td>
                <input
                  inputMode="numeric"
                  type="text"
                  className="update-frequency form-control"
                  value={this.state.update_frequency}
                  name="update_frequency"
                  onChange={this.handleChange}
                /> seconds
              </td>
            </tr>
            <tr>
              <td><br/></td>
              <td>{
                !this.state.update_frequency.toString().match(/^(\d+)?$/) && (
                  <React.Fragment>
                    <span style={{color: "red"}}>Error</span>:
                    Input must be an integer!
                  </React.Fragment>
                )
              }</td>
            </tr>
            <tr>
              <td>Random string:</td>
              <td><code>{this.state.data.str}</code></td>
            </tr>
            <tr>
              <td>Request sent at:</td>
              <td><code>{this.state.data.sent_at}</code></td>
            </tr>
            <tr>
              <td>Timestamp from server:</td>
              <td><code>{this.state.data.timestamp}</code></td>
            </tr>
            <tr>
              <td>Received at:</td>
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
      <Welcome author={author} />
      <Response />
  </React.Fragment>
);

ReactDOM.render(element, document.getElementById('root'));
