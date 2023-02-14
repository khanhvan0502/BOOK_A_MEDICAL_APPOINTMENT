import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../HomeHeader";
import "./ComingSoon.scss";

class ComingSoon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  render() {
    return (
      <div className="cha">
        <div className="tren">
          <HomeHeader />
        </div>
        <div className="duoi">
          <h2>Doctor Care</h2>
          <div className="container-1">
            <div class="bgimg">
              <div class="middle">
                <h1>COMING SOON</h1>
                <hr />
                <p id="demo"></p>
              </div>
              <div class="bottomleft">
                <p>Website đang tiếp tục phát triển...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ComingSoon);
