import moment from "moment";
import React, { Component } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "../../../components/Input/DatePicker";
import * as actions from "../../../store/actions";
import { CommonUtils, CRUD_ACTIONS, LANGUAGES } from "../../../utils";
import TableManageUser from "./TableManageUser";
import "./UserRedux.scss";

class UserRedux extends Component {
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
      confirmPassword: "",
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

      isShowPassword: false,
      isShowConfirmPassword: false,
    };
  }

  async componentDidMount() {
    this.props.getGenderStart();
    this.props.getPositionStart();
    this.props.getRoleStart();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
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
    if (prevProps.listUsers !== this.props.listUsers) {
      let arrGenders = this.props.genderRedux;
      let arrPositions = this.props.positionRedux;
      let arrRoles = this.props.roleRedux;

      this.setState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        birthday: "",
        gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : "",
        position:
          arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : "",
        role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "",
        avatar: "",
        action: CRUD_ACTIONS.CREATE,
        previewImgURL: "",
      });
    }
  }

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

  handleSaveUser = (user) => {
    let isValid = this.checkValidateInput();
    if (isValid === false) return;

    let { action, birthday } = this.state;

    let formatedDate = moment(birthday).unix();

    if (action === CRUD_ACTIONS.CREATE) {
      if (
        !this.isPasswordConfirmed(
          this.state.password,
          this.state.confirmPassword
        )
      ) {
        if (this.props.language === LANGUAGES.VI) {
          toast.error("Mật khẩu không khớp");
        } else {
          toast.error("Password incorrect");
        }
        return;
      }
    }

    if (action === CRUD_ACTIONS.CREATE) {
      //fire redux action
      if (
        {
          email: this.state.email,
          password: this.state.password,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          address: this.state.address,
          phonenumber: this.state.phoneNumber,
          birthday: formatedDate,
          gender: this.state.gender,
          roleId: this.state.role,
          positionId: this.state.position,
          avatar: this.state.avatar,
        }
      ) {
        this.props.createNewUser({
          email: this.state.email,
          password: this.state.password,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          address: this.state.address,
          phonenumber: this.state.phoneNumber,
          birthday: formatedDate,
          gender: this.state.gender,
          roleId: this.state.role,
          positionId: this.state.position,
          avatar: this.state.avatar,
        });
        if (this.props.language === LANGUAGES.VI) {
          toast.success("Tạo mới người dùng thành công!");
        } else {
          toast.success("Successfully created new user!");
        }
      } else {
        if (this.props.language === LANGUAGES.VI) {
          toast.error("Tạo mới người dùng thất bại!");
        } else {
          toast.error("New user creation failed!");
        }
        return;
      }
    }
    if (action === CRUD_ACTIONS.EDIT) {
      //fire redux edit user
      if (
        {
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
        }
      ) {
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
    }
  };

  checkValidateInput = () => {
    let state = this.state;
    let isValid = true;
    let { language } = this.props;

    //Email
    if (state["email"] === "") {
      isValid = false;
      if (language === LANGUAGES.VI) {
        toast.error("Bạn chưa nhập email");
      } else {
        toast.error("Not yet entered emaiil");
      }
      return isValid;
    } else {
      if (typeof state["email"] !== "undefined") {
        let lastAtPos = state["email"].lastIndexOf("@");
        let lastDotPos = state["email"].lastIndexOf(".");

        if (
          !(
            lastAtPos < lastDotPos &&
            lastAtPos > 0 &&
            state["email"].indexOf("@@") == -1 &&
            lastDotPos > 2 &&
            state["email"].length - lastDotPos > 2
          )
        ) {
          isValid = false;
          if (language === LANGUAGES.VI) {
            toast.error("Email không đúng định dạng");
          } else {
            toast.error("Email is not valid");
          }
          return isValid;
        }
      }
    }

    if (state["phoneNumber"] === "") {
      isValid = false;
      if (language === LANGUAGES.VI) {
        toast.error("Bạn chưa nhập số điện thoại");
      } else {
        toast.error("Not yet entered phone number");
      }
      return isValid;
    } else {
      if (typeof state["phoneNumber"] !== "undefined") {
        if (
          !state["phoneNumber"].match(
            /^(0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/
          )
        ) {
          isValid = false;

          if (language === LANGUAGES.VI) {
            toast.error("Số điện thoại không hợp lệ");
          } else {
            toast.error("Wrong phone number");
          }
          return isValid;
        }
      }
    }

    if (state["firstName"] === "") {
      isValid = false;
      if (language === LANGUAGES.VI) {
        toast.error("Vui lòng nhập tên");
      } else {
        toast.error("Not yet entered first name");
      }
      return isValid;
    }

    if (state["lastName"] === "") {
      isValid = false;
      if (language === LANGUAGES.VI) {
        toast.error("Vui lòng nhập họ");
      } else {
        toast.error("Not yet entered last name");
      }
      return isValid;
    }

    if (state["address"] === "") {
      isValid = false;
      if (language === LANGUAGES.VI) {
        toast.error("Vui lòng nhập địa chỉ");
      } else {
        toast.error("Not yet entered address");
      }
      return isValid;
    }

    if (state["birthDay"] === "") {
      isValid = false;
      if (language === LANGUAGES.VI) {
        toast.error("Vui lòng nhập ngày sinh");
      } else {
        toast.error("Not yet entered birthday");
      }
      return isValid;
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
    let parseDate = "";
    if (user.birthday === null) {
      parseDate = "";
    } else {
      parseDate = moment.unix(user.birthday).toDate();
    }
    this.setState({
      email: user.email,
      password: "hardcode",
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

  handleShowHidePassword = () => {
    if (this.state.action === CRUD_ACTIONS.EDIT) {
      this.setState({ isShowPassword: false });
    } else {
      this.setState({
        isShowPassword: !this.state.isShowPassword,
      });
    }
  };

  handleShowHideConfirmPassword = () => {
    if (this.state.action === CRUD_ACTIONS.EDIT) {
      this.setState({ isShowConfirmPassword: false });
    } else {
      this.setState({
        isShowConfirmPassword: !this.state.isShowConfirmPassword,
      });
    }
  };

  isPasswordConfirmed = (password, confirmPassword) => {
    if (password && confirmPassword && password === confirmPassword)
      return true;
    return false;
  };

  render() {
    let genders = this.state.genderArr;
    let positions = this.state.positionArr;
    let roles = this.state.roleArr;
    let language = this.props.language;
    let isGetGenders = this.props.isLoadingGender;

    let {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phoneNumber,
      address,
      birthday,
      gender,
      position,
      role,
    } = this.state;
    return (
      <div className="user-redux-container">
        <div className="title">
          <FormattedMessage id="manage-user.title" />
        </div>
        <div className="user-redux-body">
          <div className="container">
            <div className="row">
              <div className="col-12 mt-3">
                {isGetGenders === true ? "Loading genders" : ""}
              </div>
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
              <div className="col-3 mt-3">
                <label>
                  <FormattedMessage id="manage-user.password" />
                </label>
                <div className="custom-input-password">
                  <input
                    className="form-control"
                    type={this.state.isShowPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => this.onChangeInput(event, "password")}
                    disabled={
                      this.state.action === CRUD_ACTIONS.EDIT ? true : false
                    }
                  />
                  <span onClick={() => this.handleShowHidePassword()}>
                    <i
                      className={
                        this.state.isShowPassword
                          ? "far fa-eye"
                          : "far fa-eye-slash"
                      }
                    ></i>
                  </span>
                </div>
              </div>
              <div className="col-3 mt-3">
                <label>
                  <FormattedMessage id="manage-user.confirm-password" />
                </label>
                <div className="custom-input-password">
                  <input
                    className="form-control"
                    type={
                      this.state.isShowConfirmPassword ? "text" : "password"
                    }
                    value={
                      this.state.action === CRUD_ACTIONS.EDIT
                        ? password
                        : confirmPassword
                    }
                    onChange={(event) =>
                      this.onChangeInput(event, "confirmPassword")
                    }
                    disabled={
                      this.state.action === CRUD_ACTIONS.EDIT ? true : false
                    }
                  />
                  <span onClick={() => this.handleShowHideConfirmPassword()}>
                    <i
                      className={
                        this.state.isShowConfirmPassword
                          ? "far fa-eye"
                          : "far fa-eye-slash"
                      }
                    ></i>
                  </span>
                </div>
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
                  onChange={(event) => this.onChangeInput(event, "phoneNumber")}
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
                    <FormattedMessage id="manage-user.upload-file" />
                    <i className="fas fa-upload"></i>
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
              <div className="col-12">
                <TableManageUser
                  handleEditUserFromParent={this.handleEditUserFromParent}
                  action={this.state.action}
                />
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genderRedux: state.admin.genders,
    positionRedux: state.admin.positions,
    roleRedux: state.admin.roles,
    isLoadingGender: state.admin.isLoadingGender,
    listUsers: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    getPositionStart: () => dispatch(actions.fetchPositionStart()),
    getRoleStart: () => dispatch(actions.fetchRoleStart()),
    createNewUser: (data) => dispatch(actions.createNewUser(data)),
    fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
    editAUserRedux: (data) => dispatch(actions.editAUser(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
