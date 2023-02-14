import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getAllClinic,
  getAllSpecialty,
  getAllUsers,
} from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import "./ManageStatistical.scss";
import TableClinicStatistical from "./TableClinicStatistical";
import TableDoctorStatistical from "./TableDoctorStatistical";
import TablePatientStatistical from "./TablePatientStatistical";
import TableSpecialtyStatistical from "./TableSpecialtyStatistical";

class ManageStatistical extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrUsers: [],
      arrSpecialtys: [],
      arrClinics: [],
      isOpenTableDoctor: false,
      isOpenTablePatient: false,
      isOpenTableClinic: false,
      isOpenTableSpecialty: false,
    };
  }

  async componentDidMount() {
    await this.getAllUserStatistical();
    await this.getAllSpecialtyStatistical();
    await this.getAllClinicStatistical();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  getAllUserStatistical = async () => {
    let res = await getAllUsers("ALL");
    if (res && res.errCode === 0) {
      this.setState({
        arrUsers: res.users,
      });
    }
  };

  countDoctor = () => {
    let count = 0;
    let { arrUsers } = this.state;
    if (arrUsers && arrUsers.length > 0) {
      arrUsers.map((item) => {
        if (item.roleId === "R2") count = count + 1;
      });
    }
    return count;
  };

  countPatient = () => {
    let count = 0;
    let { arrUsers } = this.state;
    if (arrUsers && arrUsers.length > 0) {
      arrUsers.map((item) => {
        if (item.roleId === "R3") count = count + 1;
      });
    }
    return count;
  };

  getAllSpecialtyStatistical = async () => {
    let res = await getAllSpecialty();
    if (res && res.errCode === 0) {
      this.setState({
        arrSpecialtys: res.data,
      });
    }
  };

  countSpecialty = () => {
    let count = 0;
    let { arrSpecialtys } = this.state;
    if (arrSpecialtys && arrSpecialtys.length > 0) {
      count = arrSpecialtys.length;
    }
    return count;
  };

  getAllClinicStatistical = async () => {
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      this.setState({
        arrClinics: res.data,
      });
    }
  };

  countClinic = () => {
    let count = 0;
    let { arrClinics } = this.state;
    if (arrClinics && arrClinics.length > 0) {
      count = arrClinics.length;
    }
    return count;
  };

  handleOpenTableDoctor = () => {
    this.setState({
      isOpenTableDoctor: !this.state.isOpenTableDoctor,
      isOpenTablePatient: false,
      isOpenTableClinic: false,
      isOpenTableSpecialty: false,
    });
  };

  handleOpenTablePatient = () => {
    this.setState({
      isOpenTableDoctor: false,
      isOpenTablePatient: !this.state.isOpenTablePatient,
      isOpenTableClinic: false,
      isOpenTableSpecialty: false,
    });
  };

  handleOpenTableClinic = () => {
    this.setState({
      isOpenTableDoctor: false,
      isOpenTablePatient: false,
      isOpenTableClinic: !this.state.isOpenTableClinic,
      isOpenTableSpecialty: false,
    });
  };

  handleOpenTableSpecialty = () => {
    this.setState({
      isOpenTableDoctor: false,
      isOpenTablePatient: false,
      isOpenTableClinic: false,
      isOpenTableSpecialty: !this.state.isOpenTableSpecialty,
    });
  };

  render() {
    let {
      isOpenTableDoctor,
      isOpenTablePatient,
      isOpenTableClinic,
      isOpenTableSpecialty,
    } = this.state;
    let { language } = this.props;
    return (
      <div className="manage-statiscal-container container">
        <div className="statiscal-title">
          {language === LANGUAGES.VI ? "Thống kê" : "Statistical"}
        </div>
        <div className="row">
          <div className="col-md-3 mb-3">
            <div
              className="card text-white bg-primary h-100"
              onClick={() => this.handleOpenTableDoctor()}
            >
              <div className="card-header text-center text-uppercase">
                {language === LANGUAGES.VI
                  ? "Thống kê bác sĩ"
                  : "Doctor statistics"}
              </div>
              <div className="card-body">
                <h3 className="card-title text-center">
                  <i className="fas fa-user-md"></i>
                </h3>
                <p className="card-text text-center">{this.countDoctor()}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div
              className="card text-white bg-warning h-100"
              onClick={() => this.handleOpenTablePatient()}
            >
              <div className="card-header text-center text-uppercase">
                {" "}
                {language === LANGUAGES.VI
                  ? "Thống kê bệnh nhân"
                  : "Patient statistics"}
              </div>
              <div className="card-body">
                <h3 className="card-title text-center">
                  <i class="fas fa-procedures"></i>
                </h3>
                <p className="card-text text-center">{this.countPatient()}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div
              className="card text-white bg-success h-100"
              onClick={() => this.handleOpenTableSpecialty()}
            >
              <div className="card-header text-center text-uppercase">
                {language === LANGUAGES.VI
                  ? "Thống kê chuyên khoa"
                  : "Specialized statistics"}
              </div>
              <div className="card-body">
                <h3 className="card-title text-center">
                  <i class="fas fa-stethoscope"></i>
                </h3>
                <p className="card-text text-center">{this.countSpecialty()}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div
              className="card text-white bg-danger h-100"
              onClick={() => this.handleOpenTableClinic()}
            >
              <div className="card-header text-center text-uppercase">
                {language === LANGUAGES.VI
                  ? "Thống kê cơ sở y tế"
                  : "Statistics of medical facilities"}
              </div>
              <div className="card-body">
                <h3 className="card-title text-center">
                  <i class="fas fa-hospital"></i>
                </h3>
                <p className="card-text text-center">{this.countClinic()}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 table-manage">
            {isOpenTableDoctor ? <TableDoctorStatistical /> : <></>}
            {isOpenTablePatient ? <TablePatientStatistical /> : <></>}
            {isOpenTableClinic ? <TableClinicStatistical /> : <></>}
            {isOpenTableSpecialty ? <TableSpecialtyStatistical /> : <></>}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageStatistical);
