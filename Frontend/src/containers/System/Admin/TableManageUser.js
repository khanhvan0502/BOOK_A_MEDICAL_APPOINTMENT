import React, { Component } from "react";
import "react-markdown-editor-lite/lib/index.css";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import "./TableManageUser.scss";
import ConfirmDeleteUser from "./Modal/ConfirmDeleteUser.js";
import { LANGUAGES } from "../../../utils";
import moment from "moment";

class TableManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersRedux: [],
      isOpenConfirmDelete: false,
      userDelete: {},
    };
  }

  componentDidMount() {
    this.props.fetchUserRedux();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listUsers !== this.props.listUsers) {
      this.setState({
        usersRedux: this.props.listUsers,
      });
    }
  }

  handleDeleteUser = (user) => {
    this.setState({ userDelete: user });
    this.handleOpenModal();
  };

  handleOpenModal = () => {
    this.setState({ isOpenConfirmDelete: true });
  };

  handleEditUser = (user) => {
    this.props.handleEditUserFromParent(user);
  };

  toggleConfirmDelete = () => {
    this.setState({
      isOpenConfirmDelete: !this.state.isOpenConfirmDelete,
    });
  };

  render() {
    let arrUsers = this.state.usersRedux;
    console.log(arrUsers);
    let { language } = this.props;
    return (
      <React.Fragment>
        <table id="tableManagerUser">
          <tbody>
            <tr>
              <th>Stt</th>
              <th>Email</th>
              <th>{language === LANGUAGES.VI ? "Họ" : "Last name"}</th>
              <th>{language === LANGUAGES.VI ? "Tên" : "First name"}</th>
              <th>
                {language === LANGUAGES.VI ? "Ngày sinh" : "Date of birht"}
              </th>
              <th>
                {language === LANGUAGES.VI ? "Số điện thoại" : "Phone number"}
              </th>
              <th>{language === LANGUAGES.VI ? "Địa chỉ" : "Address"}</th>
              <th>{language === LANGUAGES.VI ? "Vai trò" : "Address"}</th>
              <th className="text-center">
                {language === LANGUAGES.VI ? "Tác vụ" : "Actions"}
              </th>
            </tr>
            {arrUsers &&
              arrUsers.length > 0 &&
              arrUsers.map((item, index) => {
                let role = "";
                if (item.roleId === "R1") {
                  if (language === LANGUAGES.VI) {
                    role = "Quản trị viên";
                  } else {
                    role = "Admin";
                  }
                } else if (item.roleId === "R2") {
                  if (language === LANGUAGES.VI) {
                    role = "Bác sĩ";
                  } else {
                    role = "Doctor";
                  }
                } else if (item.roleId === "R3") {
                  if (language === LANGUAGES.VI) {
                    role = "Bệnh nhân";
                  } else {
                    role = "Patient";
                  }
                }
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.email}</td>
                    <td>{item.lastName}</td>
                    <td>{item.firstName}</td>
                    <td>
                      {item.birthday === null
                        ? ""
                        : moment.unix(item.birthday).format("MM/DD/YYYY")}
                    </td>
                    <td>{item.phonenumber}</td>
                    <td>{item.address}</td>
                    <td>{role}</td>
                    <td className="text-center">
                      <button
                        className="btn-edit"
                        onClick={() => this.handleEditUser(item)}
                      >
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => this.handleDeleteUser(item)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <ConfirmDeleteUser
          isOpenModal={this.state.isOpenConfirmDelete}
          toggleFromParent={this.toggleConfirmDelete}
          userDelete={this.state.userDelete}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listUsers: state.admin.users,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
