import React, { Component } from "react";
import { connect } from "react-redux";
import { postVerifyBookingAppointment } from "../../services/userService";
import HomeHeader from "../HomePage/HomeHeader";
import "./VerifyEmail.scss";

class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusVerified: false,
      errCode: "",
    };
  }

  async componentDidMount() {
    if (this.props.location && this.props.location.search) {
      let urlParams = new URLSearchParams(this.props.location.search);
      let token = urlParams.get("token");
      let doctorId = urlParams.get("doctorId");

      let res = await postVerifyBookingAppointment({
        token: token,
        doctorId: doctorId,
      });
      if (res) {
        this.setState({
          statusVerified: true,
          errCode: res.errCode,
        });
      }
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  render() {
    let { statusVerified, errCode } = this.state;
    return (
      <>
        <HomeHeader />
        <div className="verify-email-container">
          {statusVerified ? (
            <div>
              {errCode === 0 ? (
                <div className="verify-success">
                  Xác nhận lịch hẹn thành công
                </div>
              ) : (
                <div className="verify-fail">
                  Lịch hẹn không tồn tại hoặc đã được xác nhận
                </div>
              )}
            </div>
          ) : (
            <div className="verify-fail">Có lỗi đã ra, vui lòng thử lại</div>
          )}
        </div>
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
