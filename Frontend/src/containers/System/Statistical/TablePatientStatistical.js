import moment from "moment";
import React, { Component } from "react";
import "react-markdown-editor-lite/lib/index.css";
import { connect } from "react-redux";
import { getAllUsers } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import "./TablePatientStatistical.scss";

class TablePatientStatistical extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrUsers: [],
    };
  }

  async componentDidMount() {
    await this.getAllUserStatistical();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listUsers !== this.props.listUsers) {
      this.setState({
        arrUsers: this.props.listUsers,
      });
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

  render() {
    let arrUsers = this.state.arrUsers;
    let arrPatient = arrUsers.filter((value) => value.roleId === "R3");
    let { language } = this.props;
    return (
      <React.Fragment>
        <div className="statiscal-title">
          {language === LANGUAGES.VI
            ? "Danh sách bệnh nhân"
            : "List of patients"}
        </div>
        <table id="tableManagerUser">
          <tbody>
            <tr>
              <th>Stt</th>
              <th>Email</th>
              <th>{language === LANGUAGES.VI ? "Họ" : "Last name"}</th>
              <th>{language === LANGUAGES.VI ? "Tên" : "First name"}</th>
              <th>{language === LANGUAGES.VI ? "Giới tính" : "Gender"}</th>
              <th>
                {language === LANGUAGES.VI ? "Ngày sinh" : "Date of birth"}
              </th>
              <th>
                {language === LANGUAGES.VI ? "Số điện thoại" : "Phone number"}
              </th>
              <th>{language === LANGUAGES.VI ? "Địa chỉ" : "Address"}</th>
            </tr>
            {arrPatient &&
              arrPatient.length > 0 &&
              arrPatient.map((item, index) => {
                let sex = "";
                if (item.gender === "M") {
                  sex = "Nam";
                } else if (item.gender === "F") {
                  sex = "Nữ";
                } else {
                  sex = "Khác";
                }
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.email}</td>
                    <td>{item.lastName}</td>
                    <td>{item.firstName}</td>
                    <td>{sex}</td>
                    <td>
                      {item.birthday === null
                        ? ""
                        : moment.unix(item.birthday).format("MM/DD/YYYY")}
                    </td>
                    <td>{item.phonenumber}</td>
                    <td>{item.address}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
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
)(TablePatientStatistical);
