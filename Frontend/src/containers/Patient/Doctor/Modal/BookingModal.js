import _ from "lodash";
import moment from "moment";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import Select from "react-select";
import { toast } from "react-toastify";
import { Modal } from "reactstrap";
import DatePicker from "../../../../components/Input/DatePicker";
import { postPatientBookingAppointment } from "../../../../services/userService";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import ProfileDoctor from "../ProfileDoctor";
import "./BookingModal.scss";
import LoadingOverlay from "react-loading-overlay";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      birthday: "",
      selectedGender: "",
      doctorId: "",
      price: "",
      genders: "",
      timeType: "",
      errors: {},
      loading: false,
    };
  }

  async componentDidMount() {
    this.props.getGenders();
  }

  buildDataGender = (data) => {
    let result = [];
    let language = this.props.language;
    if (data && data.length > 0) {
      data.map((item) => {
        let object = {};
        object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
    if (this.props.genders !== prevProps.genders) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
    if (this.props.dataTime !== prevProps.dataTime) {
      if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
        let doctorId = this.props.dataTime.doctorId;
        let timeType = this.props.dataTime.timeType;
        this.setState({
          doctorId: doctorId,
          timeType: timeType,
        });
      }
    }
  }

  handleOnChangeInput = (e, id) => {
    let valueInput = e.target.value;
    let stateCopy = { ...this.state };
    stateCopy[id] = valueInput;
    this.setState({ ...stateCopy });
    this.setState({ errors: {} });
  };

  handleOnChangeBirthDay = (date) => {
    this.setState({ birthday: date[0] });
  };

  handleOnChangeGender = (selectedOption) => {
    this.setState({ selectedGender: selectedOption });
  };

  handleConfirmBooking = async () => {
    //validate input
    if (!this.handleValidation()) {
      return;
    }
    this.setState({ ...this.state, loading: true });
    let language = this.props.language;

    let date = moment(this.state.birthday).unix();
    let timeString = this.buildTimeString(this.props.dataTime);
    let doctorName = this.buildDoctorName(this.props.dataTime.doctorData);

    let res = await postPatientBookingAppointment({
      fullName: this.state.fullName,
      phoneNumber: this.state.phoneNumber,
      email: this.state.email,
      address: this.state.address,
      reason: this.state.reason,
      price: this.state.price,
      birthday: date,
      date: this.props.dataTime.date,
      selectedGender: this.state.selectedGender.value,
      doctorId: this.state.doctorId,
      timeType: this.state.timeType,
      language: this.props.language,
      timeString: timeString,
      doctorName: doctorName,
    });
    this.setState({ ...this.state, loading: false });
    if (res && res.errCode === 0) {
      let message =
        language === LANGUAGES.VI
          ? "Đặt lịch hẹn thành công! Vui lòng kiểm tra email để xác nhận lịch hẹn của bạn"
          : "Booking a new appointment succeed! Please check your email to confirm your appointment";
      toast.success(message);
      this.props.handleCloseModal();
    } else {
      let message =
        language === LANGUAGES.VI
          ? "Đặt lịch hẹn thất bại! Vui lòng thử lại"
          : "Booking a new appointment error! Please try again";

      toast.error(message);
    }
  };

  buildTimeString = (dataTime) => {
    let { language } = this.props;

    if (dataTime && !_.isEmpty(dataTime)) {
      let date =
        language === LANGUAGES.VI
          ? moment.unix(+dataTime.date).format("dddd - DD/MM/YYYY")
          : moment.unix(+dataTime.date).format("MM/DD/YYYY");

      let time =
        language === LANGUAGES.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;
      return `${time} - ${date}`;
    }
    return "";
  };

  buildDoctorName = (doctorData) => {
    let { language } = this.props;
    if (doctorData && !_.isEmpty(doctorData)) {
      let name =
        language === LANGUAGES.VI
          ? `${doctorData.lastName} ${doctorData.firstName}`
          : `${doctorData.firstName} ${doctorData.lastName}`;

      return name;
    }
    return "";
  };

  handleValidation() {
    let state = this.state;
    let errors = {};
    let formIsValid = true;
    let language = this.props.language;

    //Name
    if (state["fullName"] === "") {
      formIsValid = false;
      errors["fullName"] =
        language === LANGUAGES.VI
          ? "Vui lòng nhập thông tin"
          : "Cannot be empty";
    } else {
      if (typeof state["fullName"] !== "undefined") {
        if (state["fullName"].match(/^[0-9]+$/)) {
          formIsValid = false;
          errors["fullName"] = LANGUAGES.VI
            ? "Họ tên chỉ bao gồm chữ cái"
            : "Only type letters";
        }
      }
    }

    //Email
    if (state["email"] === "") {
      formIsValid = false;
      errors["email"] =
        language === LANGUAGES.VI
          ? "Vui lòng nhập thông tin"
          : "Cannot be empty";
    } else {
      if (typeof state["email"] !== "undefined") {
        let lastAtPos = state["email"].lastIndexOf("@");
        let lastDotPos = state["email"].lastIndexOf(".");

        if (
          !(
            lastAtPos < lastDotPos &&
            lastAtPos > 0 &&
            state["email"].indexOf("@@") === -1 &&
            lastDotPos > 2 &&
            state["email"].length - lastDotPos > 2
          )
        ) {
          formIsValid = false;
          errors["email"] = LANGUAGES.VI
            ? "Email không đúng định dạng"
            : "Email is not valid";
        }
      }
    }

    if (state["phoneNumber"] === "") {
      formIsValid = false;
      errors["phoneNumber"] =
        language === LANGUAGES.VI
          ? "Vui lòng nhập thông tin"
          : "Cannot be empty";
    } else {
      if (typeof state["phoneNumber"] !== "undefined") {
        if (
          !state["phoneNumber"].match(
            /^(0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/
          )
        ) {
          formIsValid = false;
          errors["phoneNumber"] = LANGUAGES.VI
            ? "Số điện thoại không hợp lệ"
            : "Wrong phone number";
        }
      }
    }

    if (state["address"] === "") {
      formIsValid = false;
      errors["address"] =
        language === LANGUAGES.VI
          ? "Vui lòng nhập thông tin"
          : "Cannot be empty";
    }

    if (state["reason"] === "") {
      formIsValid = false;
      errors["reason"] =
        language === LANGUAGES.VI
          ? "Vui lòng nhập thông tin"
          : "Cannot be empty";
    }

    if (state["birthday"] === "") {
      formIsValid = false;
      errors["birthday"] =
        language === LANGUAGES.VI
          ? "Vui lòng nhập thông tin"
          : "Cannot be empty";
    }

    if (state["selectedGender"] === "") {
      formIsValid = false;
      errors["selectedGender"] =
        language === LANGUAGES.VI
          ? "Vui lòng nhập thông tin"
          : "Cannot be empty";
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  getPrice = (priceChild) => {
    this.setState({ price: priceChild });
  };

  render() {
    let { isOpenModalBooking, handleCloseModal, dataTime } = this.props;
    return (
      <LoadingOverlay active={this.state.loading} spinner text="Loading...">
        <Modal
          isOpen={isOpenModalBooking}
          centered
          backdrop="true"
          size="lg"
          className="booking-modal-container"
        >
          <div
            className="booking-modal-content"
            style={
              this.state.loading
                ? {
                    opacity: 0.3,
                    pointerEvents: "none",
                    cursor: "not-allowed",
                  }
                : {}
            }
          >
            <div className="booking-modal-header">
              <span className="left">
                <FormattedMessage id="patient.booking-modal.title" />
              </span>
              <span className="right" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </span>
            </div>
            <div className="booking-modal-body">
              <div className="doctor-info">
                <ProfileDoctor
                  doctorId={dataTime.doctorId}
                  dataTime={dataTime}
                  isShowDescriptionDoctor={false}
                  isShowLinkDetail={false}
                  isShowPrice={true}
                  priceParent={this.getPrice}
                />
              </div>
              <div className="row">
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.fullName" />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.fullName}
                    onChange={(e) => this.handleOnChangeInput(e, "fullName")}
                  />
                  <span className="error">{this.state.errors["fullName"]}</span>
                </div>
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.phoneNumber" />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.phoneNumber}
                    onChange={(e) => this.handleOnChangeInput(e, "phoneNumber")}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                  <span className="error">
                    {this.state.errors["phoneNumber"]}
                  </span>
                </div>
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.email" />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.email}
                    onChange={(e) => this.handleOnChangeInput(e, "email")}
                  />
                  <span className="error">{this.state.errors["email"]}</span>
                </div>
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.address" />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.address}
                    onChange={(e) => this.handleOnChangeInput(e, "address")}
                  />
                  <span className="error">{this.state.errors["address"]}</span>
                </div>
                <div className="col-12 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.reason" />
                  </label>
                  <input
                    type="textarea"
                    className="form-control"
                    value={this.state.reason}
                    onChange={(e) => this.handleOnChangeInput(e, "reason")}
                  />
                  <span className="error">{this.state.errors["reason"]}</span>
                </div>
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.birthday" />
                  </label>
                  <div className="date-picker">
                    <DatePicker
                      className="form-control choose-date"
                      onChange={this.handleOnChangeBirthDay}
                      value={this.state.birthday}
                      maxDate={new Date()}
                    />
                    <i className="fas fa-calendar-alt calendar"></i>
                  </div>
                  <span className="error">{this.state.errors["birthday"]}</span>
                </div>
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="patient.booking-modal.genders" />
                  </label>
                  <Select
                    value={this.state.selectedGender}
                    onChange={this.handleOnChangeGender}
                    options={this.state.genders}
                  />
                  <span className="error">
                    {this.state.errors["selectedGender"]}
                  </span>
                </div>
              </div>
            </div>
            <div className="booking-modal-footer">
              <button
                className="btn-booking-confirm"
                onClick={() => this.handleConfirmBooking()}
                disabled={this.state.loading}
              >
                <FormattedMessage id="patient.booking-modal.btnConfirm" />
              </button>
              <button className="btn-booking-cancel" onClick={handleCloseModal}>
                <FormattedMessage id="patient.booking-modal.btnCancel" />
              </button>
            </div>
          </div>
        </Modal>
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenders: () => {
      dispatch(actions.fetchGenderStart());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
