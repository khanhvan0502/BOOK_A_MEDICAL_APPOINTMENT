import moment from "moment";
import React, { Component } from "react";
import "react-markdown-editor-lite/lib/index.css";
import { connect } from "react-redux";
import { getScheduleDoctorByDate } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import ConfirmDeleteSchedule from "./Modal/ConfirmDeleteSchedule";
import "./TableManageSchedule.scss";

class TableManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeSelected: [],
      isOpenConfirmDelete: false,
      listScheduleState: {},
    };
  }

  async componentDidMount() {}

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.currentDate !== prevProps.currentDate) {
      let doctorId = this.props.doctorId;
      let date = this.props.currentDate;
      let formatedDate = moment(date).unix();
      let res = await getScheduleDoctorByDate(doctorId, formatedDate);
      if (res && res.errCode === 0) {
        this.setState({
          timeSelected: res.data
            ? res.data.map((item) => ({ ...item, isSelected: false }))
            : [],
        });
        this.props.getScheduleFromChild(this.state.timeSelected);
      }
    }
    if (this.state.isOpenConfirmDelete !== prevState.isOpenConfirmDelete) {
      let doctorId = this.props.doctorId;
      let date = this.props.currentDate;
      let formatedDate = moment(date).unix();
      let res = await getScheduleDoctorByDate(doctorId, formatedDate);
      if (res && res.errCode === 0) {
        this.setState({
          timeSelected: res.data
            ? res.data.map((item) => ({ ...item, isSelected: false }))
            : [],
        });
        this.props.getScheduleFromChild(this.state.timeSelected);
      }
    }
  }

  handleDeleteHour = async (listSchedule) => {
    this.setState({ listScheduleState: listSchedule });
    this.handleOpenModal();
  };

  handleOpenModal = () => {
    this.setState({ isOpenConfirmDelete: true });
  };

  toggleConfirmDelete = () => {
    this.props.toggleFromParent();
    this.setState({
      isOpenConfirmDelete: !this.state.isOpenConfirmDelete,
    });
  };

  render() {
    let { timeSelected } = this.state;
    let { language } = this.props;
    timeSelected = timeSelected.sort((a, b) =>
      a.timeType > b.timeType ? 1 : b.timeType > a.timeType ? -1 : 0
    );
    return (
      <React.Fragment>
        <table id="TableManagerSchedule">
          <tbody>
            <tr>
              <th>Stt</th>
              <th>
                {language === LANGUAGES.VI
                  ? "Lịch đã chọn"
                  : "Selected calendar"}
              </th>
              <th>{language === LANGUAGES.VI ? "Tác vụ" : "Action"}</th>
            </tr>
            {timeSelected && timeSelected.length > 0 ? (
              timeSelected.map((item, index) => {
                let labelVi = `Khung giờ "${item.timeTypeData.valueVi}"`;
                let labelEn = `Time slot "${item.timeTypeData.valueEn}"`;
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{language === LANGUAGES.VI ? labelVi : labelEn}</td>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <button
                        className="btn-delete"
                        onClick={() => this.handleDeleteHour(item)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={"6"} style={{ textAlign: "center" }}>
                  {language === LANGUAGES.VI
                    ? "Chưa có lịch hẹn khám"
                    : "No appointment scheduled yet"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <ConfirmDeleteSchedule
          isOpenModal={this.state.isOpenConfirmDelete}
          toggleFromParent={this.toggleConfirmDelete}
          listSchedule={this.state.listScheduleState}
        />
      </React.Fragment>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableManageSchedule);
