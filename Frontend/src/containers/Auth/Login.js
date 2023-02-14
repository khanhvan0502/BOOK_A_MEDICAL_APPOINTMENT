import { push } from "connected-react-router";
import React, { Component } from "react";
import { connect } from "react-redux";
import { handleLoginApi } from "../../services/userService";
import * as actions from "../../store/actions";
import "./Login.scss";
import ForgotPassword from "./ForgotPassword";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            isShowPassword: false,
            errMessage: "",
            isOpenModalForgotPassword: false,
        };
    }

    handleOnChangeUsername = (event) => {
        this.setState({
            username: event.target.value,
        });
    };

    hanleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value,
        });
    };

    handleLogin = async () => {
        this.setState({
            errMessage: "",
        });
        try {
            let data = await handleLoginApi(this.state.username, this.state.password);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message,
                });
            }
            if (data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message,
                    });
                }
            }
        }
    };

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword,
        });
    };

    handleKeyDown = (event) => {
        if (event.key === "Enter" || event.keyCode === 13) {
            this.handleLogin();
        }
    };

    handleOpenForgotPasswordModal = (event) => {
        this.setState({
            isOpenModalForgotPassword: true,
        });
    };
    handleCloseForgotPasswordModal = () => {
        this.setState({
            isOpenModalForgotPassword: false,
        });
    };

    render() {
        let { isOpenModalForgotPassword } = this.state;
        return (
            <div className="login-background">
                <div className="login-container">
                    <div className="login-content row">
                        <div className="col-12 login-text">Đăng nhập</div>
                        <div className="col-12 form-group login-input">
                            <label>Email</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập email..."
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeUsername(event)}
                            />
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>Mật khẩu</label>
                            <div className="custom-input-password">
                                <input
                                    type={this.state.isShowPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="Nhập mật khẩu..."
                                    value={this.state.password}
                                    onChange={(event) => this.hanleOnChangePassword(event)}
                                    onKeyDown={(event) => this.handleKeyDown(event)}
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
                        <div className="col-12" style={{ color: "red" }}>
                            {this.state.errMessage}
                        </div>
                        <div className="col-12">
                            <span
                                className="forgot-password"
                                onClick={() => this.handleOpenForgotPasswordModal()}
                            >
                                Quên mật khẩu?
                            </span>
                        </div>
                        <div className="col-12">
                            <button className="login-btn" onClick={() => this.handleLogin()}>
                                Đăng nhập
                            </button>
                        </div>
                    </div>
                </div>
                <ForgotPassword
                    isOpenModal={isOpenModalForgotPassword}
                    handleCloseModal={this.handleCloseForgotPasswordModal}
                />
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
    return {
        navigate: (path) => dispatch(push(path)),
        // userLoginFail: () => dispatch(actions.userLoginFail()),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
