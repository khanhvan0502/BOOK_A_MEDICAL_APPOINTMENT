import React, { Component } from "react";
import { connect } from "react-redux";
import { LANGUAGES } from "../../utils";
import "./LoginSuccess.scss";

class LoginSuccess extends Component {
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
      <div className="chu">
        {this.props.language === LANGUAGES.VI
          ? "Đăng nhập thành công!"
          : "Logged in successfully!"}
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginSuccess);
