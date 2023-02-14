import moment from "moment";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "../../../components/Input/DatePicker";
import {
  getScheduleDoctorByDate,
  saveBulkScheduleDoctor,
} from "../../../services/userService";
import * as actions from "../../../store/actions";
import { LANGUAGES, LanguageUtils } from "../../../utils";
import "./ManageSchedule.scss";
import TableManageSchedule from "./TableManageSchedule";

class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: "",
      rangeTime: [],
      scheduleSelected: [],
      isAvailableSchedule: [],
      isHandleDelete: false,
      maxNumberOfPatients: 5,
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctors();
    this.props.fetchAllScheduleTime();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
      let data = this.props.allScheduleTime;
      if (data && data.length > 0) {
        data = data.map((item) => ({ ...item, isSelected: false }));
      }
      this.setState({
        rangeTime: data,
      });
    }
    if (this.state.scheduleSelected !== prevState.scheduleSelected) {
      this.compareSchedule();
    }
    if (this.state.isHandleDelete !== prevState.isHandleDelete) {
      let data = this.props.allScheduleTime;
      if (data && data.length > 0) {
        data = data.map((item) => ({ ...item, isSelected: false }));
      }
      this.setState({
        currentDate: this.state.currentDate,
        rangeTime: data,
      });
    }
  }

  handleOnChangeDatePicker = (date) => {
    let data = this.props.allScheduleTime;
    if (data && data.length > 0) {
      data = data.map((item) => ({ ...item, isSelected: false }));
    }
    this.setState({
      currentDate: date[0],
      rangeTime: data,
    });
  };

  handleClickBtnTime = (time) => {
    let { rangeTime } = this.state;
    if (rangeTime && rangeTime.length > 0) {
      rangeTime = rangeTime.map((item) => {
        if (item.id === time.id) item.isSelected = !item.isSelected;
        return item;
      });
      this.setState({
        rangeTime: rangeTime,
      });
    }
  };

  handleSaveSchedule = async () => {
    let { rangeTime, currentDate, maxNumberOfPatients } = this.state;
    let { userInfo } = this.props;
    let result = [];

    if (!currentDate) {
      if (this.props.language === LANGUAGES.VI) {
        toast.error("Ngày không hợp lệ");
      } else {
        toast.error("Invalid date");
      }
      return;
    }

    let formatedDate = moment(currentDate).unix();

    if (rangeTime && rangeTime.length > 0) {
      let selectedTime = rangeTime.filter((item) => item.isSelected === true);
      let res = await getScheduleDoctorByDate(userInfo.id, formatedDate);
      if (
        selectedTime.length >= res.data.length ||
        this.equal(selectedTime, res.data)
      ) {
        if (!this.equal(selectedTime, res.data)) {
          if (selectedTime && selectedTime.length > 0) {
            selectedTime.map((schedule, index) => {
              let object = {};
              object.doctorId = userInfo.id;
              object.date = formatedDate;
              object.timeType = schedule.keyMap;
              result.push(object);
            });
          } else {
            if (this.props.language === LANGUAGES.VI) {
              toast.error("Thời gian đã chọn không hợp lệ");
            } else {
              toast.error("Invalid selected time");
            }
            return;
          }
        } else {
          if (this.props.language === LANGUAGES.VI) {
            toast.error(
              "Thời gian đã được chọn. Vui lòng chọn thời gian khác!"
            );
          } else {
            toast.error("Time has been selected. Please choose another time!");
          }
          return;
        }
      } else {
        if (this.props.language === LANGUAGES.VI) {
          toast.error(
            "Bạn chỉ có thể hủy chọn thời gian bằng cách xóa ở bảng dưới!"
          );
        } else {
          toast.error("The time has been chosen inappropriately!");
        }
        return;
      }
    }
    if (!this.checkMaxPatient(maxNumberOfPatients)) {
      return;
    }

    let res = await saveBulkScheduleDoctor({
      arrSchedule: result,
      doctorId: userInfo.id,
      formatedDate: formatedDate,
      maxNumberOfPatients: maxNumberOfPatients,
    });

    if (res && res.errCode === 0) {
      if (this.props.language === LANGUAGES.VI) {
        toast.success("Lưu thành công");
      } else {
        toast.success("Save successfully");
      }
      this.setBtnSelectedDefault();
    } else {
      if (this.props.language === LANGUAGES.VI) {
        toast.error("Lưu thất bại");
      } else {
        toast.error("Save failed");
      }
    }
  };

  checkMaxPatient = (value) => {
    if (value && value > 10) {
      if (this.props.language === LANGUAGES.VI) {
        toast.error("Tối đa là 10 bệnh nhân trong 1 khung giờ");
      } else {
        toast.error("Maximum 10 patients in 1 hour frame");
      }
      return false;
    } else if (value && value < 1) {
      if (this.props.language === LANGUAGES.VI) {
        toast.error("Tối thiểu là 1 bệnh nhân trong 1 khung giờ");
      } else {
        toast.error("Minimum 1 patient in 1 hour frame");
      }
      return false;
    } else {
      return true;
    }
  };

  equal = (a, b) => {
    return (
      a.length === b.length && // same length and
      a.every(
        // every element in a
        (e1) =>
          b.some(
            // has a match in b
            (e2) => e1.keyMap === e2.timeType
          )
      )
    );
  };

  setBtnSelectedDefault = () => {
    let data = this.props.allScheduleTime;
    if (data && data.length > 0) {
      data = data.map((item) => ({ ...item, isSelected: false }));
    }
    this.setState({
      rangeTime: data,
      currentDate: "",
      maxNumberOfPatients: 10,
    });
  };

  getScheduleFromChild = (scheduleSelectedFromChild) => {
    this.setState({
      scheduleSelected: scheduleSelectedFromChild,
    });
  };

  compareSchedule = () => {
    let listScheduleParent = this.state.rangeTime;
    let listScheduleChild = this.state.scheduleSelected;
    if (listScheduleChild.length > 0) {
      this.setState({
        maxNumberOfPatients: listScheduleChild[0].maxNumber,
      });
    } else {
      this.setState({
        maxNumberOfPatients: 5,
      });
    }
    listScheduleParent
      .filter(
        (value) =>
          listScheduleChild
            .map((value1) => value1.timeType)
            .indexOf(value.keyMap) !== -1
      )
      .forEach((item) => (item.isSelected = true));

    this.setState({
      rangeTime: listScheduleParent,
      currentDate: this.state.currentDate,
    });
  };

  toggleHandleDelete = () => {
    this.setState({
      isHandleDelete: !this.state.isHandleDelete,
    });
  };

  handleOnChangeMaxPatients = (event) => {
    this.setState({
      maxNumberOfPatients: event.target.value,
    });
  };

  render() {
    let { rangeTime } = this.state;
    let { language, userInfo } = this.props;
    let nameVi = `${userInfo.lastName} ${userInfo.firstName}`;
    let nameEn = `${userInfo.firstName} ${userInfo.lastName}`;
    let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    const exceptThisSymbols = ["e", "E", "+", "-", "."];
    return (
      <div className="manage-schedule-container">
        <div className="title">
          <FormattedMessage id="manage-schedule.title" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id="manage-schedule.choose-doctor" />
              </label>
              <input
                className="form-control"
                value={language === LANGUAGES.VI ? nameVi : nameEn}
                disabled
              />
            </div>
            <div className="col-3 form-group">
              <label>
                <FormattedMessage id="manage-schedule.choose-date" />
              </label>
              <div className="date-picker">
                <DatePicker
                  onChange={this.handleOnChangeDatePicker}
                  className="form-control choose-date"
                  value={this.state.currentDate}
                  minDate={yesterday}
                />
                <i className="fas fa-calendar-alt calendar"></i>
              </div>
            </div>
            <div className="col-12 pick-hour-container">
              {rangeTime &&
                rangeTime.length > 0 &&
                rangeTime.map((item, index) => {
                  return (
                    <button
                      className={
                        item.isSelected === true
                          ? "btn btn-schedule active"
                          : "btn btn-schedule"
                      }
                      key={index}
                      onClick={() => this.handleClickBtnTime(item)}
                    >
                      {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                    </button>
                  );
                })}
            </div>
            <div className="col-12 form-group">
              <label>
                <FormattedMessage id="manage-schedule.max-patients" />
              </label>
              <input
                className="max-patients"
                type="number"
                onKeyDown={(e) =>
                  exceptThisSymbols.includes(e.key) && e.preventDefault()
                }
                onChange={(e) => this.handleOnChangeMaxPatients(e)}
                value={this.state.maxNumberOfPatients}
                max={10}
                min={1}
              ></input>
            </div>
            <div className="col-12 form-group">
              <button
                className="btn btn-primary btn-save-schedule"
                onClick={() => this.handleSaveSchedule()}
              >
                <FormattedMessage id="manage-schedule.save" />
              </button>
            </div>
            <div className="col-12 form-group">
              <TableManageSchedule
                doctorId={userInfo.id}
                currentDate={this.state.currentDate}
                getScheduleFromChild={this.getScheduleFromChild}
                toggleFromParent={this.toggleHandleDelete}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    allDoctors: state.admin.allDoctors,
    language: state.app.language,
    allScheduleTime: state.admin.allScheduleTime,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
