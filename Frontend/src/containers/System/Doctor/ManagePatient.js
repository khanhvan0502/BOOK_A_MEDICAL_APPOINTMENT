import moment from "moment";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "../../../components/Input/DatePicker";
import {
  getAllPatientForDoctor,
  getAllPatientForHistory,
  postSendRemedy,
} from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import "./ManagePatient.scss";
import ConfirmDeletePatient from "./Modal/ConfirmDeletePatient";
import RemedyModal from "./RemedyModal";

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: "",
      // dataPatient: [],
      isOpenConfirmDelete: false,
      isOpenRemedyModal: false,
      isDeleteSucceed: false,
      dataModal: {},
      itemDelete: {},
      dataPatientExamined: [],
      moneySum: "",
      numberPatientExamined: "",
      numberPatientcanceled: "",
    };
  }

  async componentDidMount() {
    await this.getExaminedPatientData();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.state.isOpenConfirmDelete !== prevState.isOpenConfirmDelete) {
      // await this.getDataPatient();
      await this.getExaminedPatientData();
    }
    if (this.state.currentDate !== prevState.currentDate) {
      await this.getExaminedPatientData();
    }
  }

  getExaminedPatientData = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formatedDate = moment(currentDate).unix();
    let res = await getAllPatientForHistory({
      doctorId: user.id,
      date: formatedDate,
    });
    if (res && res.errCode === 0) {
      this.setState({
        dataPatientExamined: res.data,
      });
    }
  };

  // getDataPatient = async () => {
  //   let { user } = this.props;
  //   let { currentDate } = this.state;
  //   let formatedDate = moment(currentDate).unix();
  //   let res = await getAllPatientForDoctor({
  //     doctorId: user.id,
  //     date: formatedDate,
  //   });
  //   if (res && res.errCode === 0) {
  //     this.setState({
  //       dataPatient: res.data,
  //     });
  //   }
  // };

  handleDeletePatient = async (item) => {
    this.setState({ itemDelete: item });
    this.handleOpenModal();
  };

  handleOpenModal = () => {
    this.setState({ isOpenConfirmDelete: true });
  };

  toggleConfirmDelete = () => {
    this.setState({
      isOpenConfirmDelete: !this.state.isOpenConfirmDelete,
    });
  };

  handleOnChangeDatePicker = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      async () => {
        // await this.getDataPatient();
        await this.getExaminedPatientData();
      }
    );
  };

  handleBtnConfirm = (item) => {
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
    };
    this.setState({
      isOpenRemedyModal: true,
      dataModal: data,
    });
  };

  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {},
    });
  };

  sendRemedy = async (dataChild) => {
    let { dataModal } = this.state;
    let res = await postSendRemedy({
      email: dataChild.email,
      imgBase64: dataChild.imgBase64,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      language: this.props.language,
      patientName: dataModal.patientName,
    });
    if (res && res.errCode === 0) {
      if (this.props.language === LANGUAGES.VI) {
        toast.success("Gửi biện pháp khắc phục thành công");
      } else {
        toast.success("Send remedy succeeds");
      }
      this.closeRemedyModal();
      // await this.getDataPatient();
      await this.getExaminedPatientData();
    } else {
      if (this.props.language === LANGUAGES.VI) {
        toast.error("Có gì đó không đúng...");
      } else {
        toast.error("Something wrong...");
      }
    }
  };

  totalScheduled = () => {
    let count = 0;
    let { dataPatientExamined } = this.state;
    let { user } = this.props;
    dataPatientExamined &&
      dataPatientExamined.length > 0 &&
      dataPatientExamined
        .filter((value) => value.doctorId === user.id)
        .map(() => {
          count = count + 1;
        });
    return count;
  };

  countPatientExamined = () => {
    let count = 0;
    let { dataPatientExamined } = this.state;
    let { user } = this.props;
    dataPatientExamined &&
      dataPatientExamined.length > 0 &&
      dataPatientExamined
        .filter(
          (value) => value.doctorId === user.id && value.statusId === "S3"
        )
        .map(() => {
          count = count + 1;
        });
    return count;
  };

  countPatientCanceled = () => {
    let count = 0;
    let { dataPatientExamined } = this.state;
    let { user } = this.props;
    dataPatientExamined &&
      dataPatientExamined.length > 0 &&
      dataPatientExamined
        .filter(
          (value) => value.doctorId === user.id && value.statusId === "S4"
        )
        .map(() => {
          count = count + 1;
        });
    return count;
  };

  sumPrice = () => {
    let sum = 0;
    let { dataPatientExamined } = this.state;
    let { user } = this.props;
    dataPatientExamined &&
      dataPatientExamined.length > 0 &&
      dataPatientExamined
        .filter(
          (value) => value.doctorId === user.id && value.statusId === "S3"
        )
        .map((item) => {
          sum += parseInt(item.money);
        });
    return sum;
  };

  render() {
    let { isOpenRemedyModal, dataModal, dataPatientExamined } = this.state;
    let { language } = this.props;
    return (
      <>
        <div className="manage-patient-container container">
          <div className="title">
            <FormattedMessage id="manage-patient.title" />
          </div>

          <div className="manage-patient-body row">
            <div className="col-4 form-group">
              <label>
                <FormattedMessage id="manage-patient.choose-date" />
              </label>
              <div className="date-picker">
                <DatePicker
                  onChange={this.handleOnChangeDatePicker}
                  className="form-control choose-date"
                  value={this.state.currentDate}
                />
                <i className="fas fa-calendar-alt calendar"></i>
              </div>
            </div>
            <div className="col-2 form-group">
              <label>
                <FormattedMessage id="manage-patient.total-scheduled" />
              </label>
              <div className="number-patient">
                <p className="patient-text">{this.totalScheduled()}</p>
                <i class="fas fa-plus icons text-warning"></i>
              </div>
            </div>
            <div className="col-2 form-group">
              <label>
                <FormattedMessage id="manage-patient.number-patient-examined" />
              </label>
              <div className="number-patient">
                <p className="patient-text">{this.countPatientExamined()}</p>
                <i class="fas fa-check icons text-success"></i>
              </div>
            </div>
            <div className="col-2 form-group">
              <label>
                <FormattedMessage id="manage-patient.number-patient-cancel" />
              </label>
              <div className="number-patient">
                <p className="patient-text">{this.countPatientCanceled()}</p>
                <i class="fas fa-times icons text-danger"></i>
              </div>
            </div>
            <div className="col-2 form-group">
              <label>
                <FormattedMessage id="manage-patient.sum" />
              </label>
              <div className="number-patient">
                <p className="patient-text">{this.sumPrice()}</p>
                <i class="fas fa-dollar-sign icons text-primary"></i>
              </div>
            </div>
            <div className="col-12 table-manage-patient">
              <table id="TableManagerPatient" style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <th>STT</th>
                    <th>
                      {language === LANGUAGES.VI
                        ? "Lịch đã chọn"
                        : "Selected calendar"}
                    </th>
                    <th>Email</th>
                    <th>{language === LANGUAGES.VI ? "Họ" : "Last name"}</th>
                    <th>{language === LANGUAGES.VI ? "Tên" : "First name"}</th>
                    <th>
                      {language === LANGUAGES.VI
                        ? "Ngày sinh"
                        : "Date of birth"}
                    </th>
                    <th>{language === LANGUAGES.VI ? "Địa chỉ" : "Address"}</th>
                    <th>
                      {language === LANGUAGES.VI ? "Giới tính" : "Gender"}
                    </th>
                    <th>{language === LANGUAGES.VI ? "Lí do" : "Reason"}</th>
                    <th>{language === LANGUAGES.VI ? "Giá tiền" : "Price"}</th>
                    <th className="text-center">
                      {language === LANGUAGES.VI ? "Tác vụ" : "Actions"}
                    </th>
                  </tr>
                  {dataPatientExamined && dataPatientExamined.length > 0 ? (
                    dataPatientExamined.map((item, index) => {
                      let time =
                        language === LANGUAGES.VI
                          ? item.timeTypeDataPatient.valueVi
                          : item.timeTypeDataPatient.valueEn;
                      let gender =
                        language === LANGUAGES.VI
                          ? item.patientData.genderData.valueVi
                          : item.patientData.genderData.valueEn;
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{time}</td>
                          <td>{item.patientData.email}</td>
                          <td>{item.patientData.lastName}</td>
                          <td>{item.patientData.firstName}</td>
                          <td>
                            {item.patientData.birthday === null
                              ? ""
                              : moment
                                  .unix(item.patientData.birthday)
                                  .format("DD/MM/YYYY")}
                          </td>
                          <td>{item.patientData.address}</td>
                          <td>{gender}</td>
                          <td>{item.reason}</td>
                          <td>{item.money}</td>
                          <td className="text-center">
                            {item.statusId === "S2" ? (
                              <>
                                <button
                                  className="btn btn-info"
                                  onClick={() => this.handleBtnConfirm(item)}
                                >
                                  {language === LANGUAGES.VI
                                    ? "Xác nhận"
                                    : "Confirm"}
                                </button>
                                <button
                                  className="btn btn-danger mb-btn-cancel"
                                  onClick={() => this.handleDeletePatient(item)}
                                >
                                  {language === LANGUAGES.VI ? "Hủy" : "Cancel"}
                                </button>
                              </>
                            ) : item.statusId === "S3" ? (
                              language === LANGUAGES.VI ? (
                                "Đã khám"
                              ) : (
                                "Examined"
                              )
                            ) : language === LANGUAGES.VI ? (
                              "Đã hủy"
                            ) : (
                              "Canceled"
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={"12"} style={{ textAlign: "center" }}>
                        {language === LANGUAGES.VI
                          ? "Không có dữ liệu"
                          : "No data"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <RemedyModal
          isOpenModal={isOpenRemedyModal}
          dataModal={dataModal}
          closeRemedyModal={this.closeRemedyModal}
          sendRemedy={this.sendRemedy}
        />
        <ConfirmDeletePatient
          isOpenModal={this.state.isOpenConfirmDelete}
          toggleFromParent={this.toggleConfirmDelete}
          item={this.state.itemDelete}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
