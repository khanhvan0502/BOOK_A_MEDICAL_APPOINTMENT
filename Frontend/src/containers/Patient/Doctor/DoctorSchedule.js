import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getScheduleDoctorByDate } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import "./DoctorSchedule.scss";
import { FormattedMessage } from "react-intl";
import localization from "moment/locale/vi";
import BookingModal from "../Doctor/Modal/BookingModal";

class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDays: [],
      allAvailableTime: [],
      isOpenModalBooking: false,
      dataScheduleTimeModal: {},
    };
  }

  async componentDidMount() {
    let { language } = this.props;
    let allDays = this.getArrDays(language);
    if (this.props.doctorIdFromParent) {
      let res = await getScheduleDoctorByDate(
        this.props.doctorIdFromParent,
        allDays[0].value
      );
      this.setState({
        allAvalableTime: res.data ? res.data : [],
      });
    }
    this.setState({
      allDays: allDays,
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getArrDays = (language) => {
    let allDays = [];
    for (let i = 0; i < 7; i++) {
      let object = {};
      if (language === LANGUAGES.VI) {
        if (i === 0) {
          let ddMM = moment(new Date()).format("DD/MM");
          let today = `Hôm nay - ${ddMM}`;
          object.label = today;
        } else {
          let labelVi = moment(new Date())
            .add(i, "days")
            .format("dddd - DD/MM");
          object.label = this.capitalizeFirstLetter(labelVi);
        }
      } else {
        if (i === 0) {
          let ddMM = moment(new Date()).format("DD/MM");
          let today = `Today - ${ddMM}`;
          object.label = today;
        } else {
          object.label = moment(new Date())
            .add(i, "days")
            .locale("en")
            .format("ddd - DD/MM");
        }
      }
      object.value = moment(new Date()).add(i, "days").startOf("day").unix();
      allDays.push(object);
    }

    return allDays;
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      let allDays = this.getArrDays(this.props.language);
      this.setState({
        allDays: allDays,
      });
    }
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      let allDays = this.getArrDays(this.props.language);
      let res = await getScheduleDoctorByDate(
        this.props.doctorIdFromParent,
        allDays[0].value
      );
      this.setState({
        allAvailableTime: res.data ? res.data : [],
      });
    }
  }

  handleOnChangeSelect = async (event) => {
    if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
      let doctorId = this.props.doctorIdFromParent;
      let date = event.target.value;
      let res = await getScheduleDoctorByDate(doctorId, date);
      if (res && res.errCode === 0) {
        this.setState({
          allAvailableTime: res.data ? res.data : [],
        });
      }
    }
  };

  handleClickScheduleTime = (time) => {
    this.setState({
      isOpenModalBooking: true,
      dataScheduleTimeModal: time,
    });
  };

  handleCloseModal = () => {
    this.setState({
      isOpenModalBooking: false,
    });
  };

  validateScheduleTime = (item) => {
    let currentNumber = item.currentNumber ? item.currentNumber : 0;
    let maxNumber = item.maxNumber;
    let currentDate = new Date();
    let time = item.timeTypeData.valueVi;
    let scheduleTime = parseInt(time.substr(0, time.indexOf(":")));
    let scheduleDate = new Date(parseInt(item.date) * 1000);
    if (currentNumber >= maxNumber) {
      return true;
    }
    if (scheduleDate.getDate() === currentDate.getDate()) {
      if (currentDate.getHours() >= scheduleTime) {
        return true;
      }
    }
    return false;
  };

  render() {
    let {
      allDays,
      allAvailableTime,
      isOpenModalBooking,
      dataScheduleTimeModal,
    } = this.state;
    let { language } = this.props;
    let allAvailableTimeNew = allAvailableTime.sort((a, b) =>
      a.timeType > b.timeType ? 1 : b.timeType > a.timeType ? -1 : 0
    );
    return (
      <>
        <div className="doctor-schedule-container">
          <div className="all-schedule">
            <select onChange={(event) => this.handleOnChangeSelect(event)}>
              {allDays &&
                allDays.length > 0 &&
                allDays.map((item, index) => {
                  return (
                    <option value={item.value} key={index}>
                      {item.label}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="all-available-time">
            <div className="text-calendar">
              <i className="fas fa-calendar-alt">
                <span>
                  <FormattedMessage id="patient.detail-doctor.schedule" />
                </span>
              </i>
            </div>
            <div className="time-content">
              <></>
              {allAvailableTimeNew && allAvailableTimeNew.length > 0 ? (
                <>
                  <div className="time-content-btn">
                    {allAvailableTimeNew.map((item, index) => {
                      let isUnavailable = this.validateScheduleTime(item);
                      let timeDisplay =
                        language === LANGUAGES.VI
                          ? item.timeTypeData.valueVi
                          : item.timeTypeData.valueEn;
                      return (
                        <button
                          key={index}
                          className={
                            isUnavailable
                              ? language === LANGUAGES.VI
                                ? "disabled-vi"
                                : "disabled-en"
                              : language === LANGUAGES.VI
                              ? "btn-vi"
                              : "btn-en"
                          }
                          onClick={() => this.handleClickScheduleTime(item)}
                          disabled={isUnavailable}
                        >
                          {timeDisplay}
                        </button>
                      );
                    })}
                  </div>
                  <div className="book-free">
                    <span>
                      <FormattedMessage id="patient.detail-doctor.choose" />
                      <i className="far fa-hand-point-up"></i>
                      <FormattedMessage id="patient.detail-doctor.book-free" />
                    </span>
                  </div>
                </>
              ) : (
                <div className="no-schedule">
                  <FormattedMessage id="patient.detail-doctor.no-schedule" />
                </div>
              )}
            </div>
          </div>
        </div>
        <BookingModal
          isOpenModalBooking={isOpenModalBooking}
          handleCloseModal={this.handleCloseModal}
          dataTime={dataScheduleTimeModal}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
