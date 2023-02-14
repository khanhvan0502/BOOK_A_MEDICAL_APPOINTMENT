import moment from "moment";
import React, { Component } from "react";
import Lightbox from "react-image-lightbox";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "../../../components/Input/DatePicker";
import { getAllUsers } from "../../../services/userService";
import * as actions from "../../../store/actions";
import { CommonUtils, CRUD_ACTIONS, LANGUAGES } from "../../../utils";
import "./ManageInformation.scss";
import ChangePassword from "./Modal/ChangePassword";

class ManageInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genderArr: [],
      positionArr: [],
      roleArr: [],
      previewImgURL: "",
      isOpen: false,

      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      birthday: "",
      address: "",
      gender: "",
      position: "",
      role: "",
      avatar: "",

      userEditId: "",
      action: "",
      isOpenModalChangePassword: false,
    };
  }

  async componentDidMount() {
    this.props.getGenderStart();
    this.props.getPositionStart();
    this.props.getRoleStart();
    let { userInfo } = this.props;
    let res = await getAllUsers(userInfo.id);
    this.handleEditUserFromParent(res.users);
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.genderRedux !== this.props.genderRedux) {
      let arrGenders = this.props.genderRedux;
      this.setState({
        genderArr: arrGenders,
        gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : "",
      });
    }
    if (prevProps.positionRedux !== this.props.positionRedux) {
      let arrPositions = this.props.positionRedux;
      this.setState({
        positionArr: arrPositions,
        position:
          arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : "",
      });
    }
    if (prevProps.roleRedux !== this.props.roleRedux) {
      let arrRoles = this.props.roleRedux;
      this.setState({
        roleArr: arrRoles,
        role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "",
      });
    }
  }

  handleSaveUser = (user) => {
    let isValid = this.checkValidateInput();
    if (isValid === false) return;

    let { action, birthday } = this.state;

    let formatedDate = moment(birthday).unix();

    if (action === CRUD_ACTIONS.EDIT) {
      //fire redux edit user
      this.props.editAUserRedux({
        id: this.state.userEditId,
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        birthday: formatedDate,
        phonenumber: this.state.phoneNumber,
        gender: this.state.gender,
        roleId: this.state.role,
        positionId: this.state.position,
        avatar: this.state.avatar,
      });
      if (this.props.language === LANGUAGES.VI) {
        toast.success("Cập nhật người dùng thành công!");
      } else {
        toast.success("User Update Successful!");
      }
    } else {
      if (this.props.language === LANGUAGES.VI) {
        toast.error("Cập nhật người dùng thất bại!");
      } else {
        toast.error("User update failed!");
      }
      return;
    }
  };

  checkValidateInput = () => {
    let isValid = true;
    let arrCheck = ["email", "firstName", "lastName", "phoneNumber", "address"];
    for (let i = 0; i < arrCheck.length; i++) {
      if (!this.state[arrCheck[i]]) {
        isValid = false;
        alert("This input is required: " + arrCheck[i]);
        break;
      }
    }
    return isValid;
  };

  onChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState({
      ...copyState,
    });
  };

  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        previewImgURL: objectUrl,
        avatar: base64,
      });
    }
  };

  openPreviewImage = () => {
    if (!this.state.previewImgURL) return;
    this.setState({
      isOpen: true,
    });
  };

  handleOnChangeDatePicker = (date) => {
    this.setState({
      birthday: date[0],
    });
  };

  handleEditUserFromParent = (user) => {
    let imageBase64 = "";
    if (user.image) {
      imageBase64 = Buffer.from(user.image, "base64").toString("binary");
    }
    let parseDate = moment.unix(user.birthday).toDate();
    this.setState({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phonenumber,
      address: user.address,
      birthday: parseDate,
      gender: user.gender,
      position: user.positionId,
      role: user.roleId,
      avatar: "",
      previewImgURL: imageBase64,
      action: CRUD_ACTIONS.EDIT,
      userEditId: user.id,
    });
  };

  handleClickChangePassword = () => {
    this.setState({ isOpenModalChangePassword: true });
  };

  toggleChangePassword = () => {
    this.setState({
      isOpenModalChangePassword: !this.state.isOpenModalChangePassword,
    });
  };

  render() {
    let genders = this.state.genderArr;
    let positions = this.state.positionArr;
    let roles = this.state.roleArr;
    let language = this.props.language;
    let {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
      gender,
      position,
      role,
      birthday,
      isOpenModalChangePassword,
    } = this.state;
    return (
      <>
        <div className="user-redux-container">
          <div className="title">
            <FormattedMessage id="manage-user.doctor" />
          </div>
          <div className="user-redux-body">
            <div className="container">
              <div className="row">
                <div className="col-6 mt-3">
                  <label>
                    <FormattedMessage id="manage-user.email" />
                  </label>
                  <input
                    className="form-control"
                    type="email"
                    value={email}
                    onChange={(event) => this.onChangeInput(event, "email")}
                    disabled={
                      this.state.action === CRUD_ACTIONS.EDIT ? true : false
                    }
                  />
                </div>
                <div className="col-4 mt-3">
                  <label>
                    <FormattedMessage id="manage-user.password" />
                  </label>
                  <input
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={(event) => this.onChangeInput(event, "password")}
                    disabled={
                      this.state.action === CRUD_ACTIONS.EDIT ? true : false
                    }
                  />
                </div>
                <div className="col-2 mt-3">
                  <label>&nbsp;</label>
                  <button
                    className="form-control btn btn-primary"
                    onClick={() => this.handleClickChangePassword()}
                  >
                    <FormattedMessage id="manage-user.change-password" />
                  </button>
                </div>
                <div className="col-6 mt-3">
                  <label>
                    <FormattedMessage id="manage-user.first-name" />
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    value={firstName}
                    onChange={(event) => this.onChangeInput(event, "firstName")}
                  />
                </div>
                <div className="col-6 mt-3">
                  <label>
                    <FormattedMessage id="manage-user.last-name" />
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    value={lastName}
                    onChange={(event) => this.onChangeInput(event, "lastName")}
                  />
                </div>
                <div className="col-6 mt-3">
                  <label>
                    <FormattedMessage id="manage-user.phone-number" />
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    value={phoneNumber}
                    onChange={(event) =>
                      this.onChangeInput(event, "phoneNumber")
                    }
                  />
                </div>
                <div className="col-3 mt-3">
                  <label>
                    <FormattedMessage id="manage-user.birthday" />
                  </label>
                  <div className="date-picker">
                    <DatePicker
                      onChange={this.handleOnChangeDatePicker}
                      className="form-control choose-date"
                      value={birthday}
                      maxDate={new Date()}
                    />
                    <i className="fas fa-calendar-alt calendar"></i>
                  </div>
                </div>
                <div className="col-12 mt-3">
                  <label>
                    <FormattedMessage id="manage-user.address" />
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    value={address}
                    onChange={(event) => this.onChangeInput(event, "address")}
                  />
                </div>
                <div className="col-3 mt-3">
                  <label>
                    <FormattedMessage id="manage-user.gender" />
                  </label>
                  <select
                    className="form-control"
                    onChange={(event) => this.onChangeInput(event, "gender")}
                    value={gender}
                    disabled={
                      this.state.action === CRUD_ACTIONS.EDIT ? true : false
                    }
                  >
                    {genders &&
                      genders.length > 0 &&
                      genders.map((item, index) => {
                        return (
                          <option key={index} value={item.keyMap}>
                            {language === LANGUAGES.VI
                              ? item.valueVi
                              : item.valueEn}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="col-3 mt-3">
                  <label>
                    <FormattedMessage id="manage-user.position" />
                  </label>
                  <select
                    className="form-control"
                    onChange={(event) => this.onChangeInput(event, "position")}
                    value={position}
                    disabled={
                      this.state.action === CRUD_ACTIONS.EDIT ? true : false
                    }
                  >
                    {positions &&
                      positions.length > 0 &&
                      positions.map((item, index) => {
                        return (
                          <option key={index} value={item.keyMap}>
                            {language === LANGUAGES.VI
                              ? item.valueVi
                              : item.valueEn}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="col-3 mt-3">
                  <label>
                    <FormattedMessage id="manage-user.role" />
                  </label>
                  <select
                    className="form-control"
                    onChange={(event) => this.onChangeInput(event, "role")}
                    value={role}
                    disabled={
                      this.state.action === CRUD_ACTIONS.EDIT ? true : false
                    }
                  >
                    {roles &&
                      roles.length > 0 &&
                      roles.map((item, index) => {
                        return (
                          <option key={index} value={item.keyMap}>
                            {language === LANGUAGES.VI
                              ? item.valueVi
                              : item.valueEn}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="col-3 mt-3">
                  <label>
                    <FormattedMessage id="manage-user.image" />
                  </label>
                  <div className="preview-img-container">
                    <input
                      id="previewImg"
                      type="file"
                      hidden
                      onChange={(event) => this.handleOnChangeImage(event)}
                    />
                    <label className="label-upload" htmlFor="previewImg">
                      Tải ảnh<i className="fas fa-upload"></i>
                    </label>
                    <div
                      className="preview-image"
                      style={{
                        backgroundImage: `url(${this.state.previewImgURL})`,
                      }}
                      onClick={() => this.openPreviewImage()}
                    ></div>
                  </div>
                </div>
                <div className="col-12 my-3">
                  <button
                    className={
                      this.state.action === CRUD_ACTIONS.EDIT
                        ? "btn btn-warning"
                        : "btn btn-primary"
                    }
                    onClick={() => this.handleSaveUser()}
                  >
                    {this.state.action === CRUD_ACTIONS.EDIT ? (
                      <FormattedMessage id="manage-user.edit" />
                    ) : (
                      <FormattedMessage id="manage-user.save" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {this.state.isOpen === true && (
            <Lightbox
              mainSrc={this.state.previewImgURL}
              onCloseRequest={() => this.setState({ isOpen: false })}
            />
          )}
        </div>
        <ChangePassword
          isOpenModal={isOpenModalChangePassword}
          toggleFromParent={this.toggleChangePassword}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genderRedux: state.admin.genders,
    positionRedux: state.admin.positions,
    roleRedux: state.admin.roles,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    getPositionStart: () => dispatch(actions.fetchPositionStart()),
    getRoleStart: () => dispatch(actions.fetchRoleStart()),
    fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
    editAUserRedux: (data) => dispatch(actions.editAUser(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageInformation);
