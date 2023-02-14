import { push } from "connected-react-router";
import React, { Component } from "react";
import { connect } from "react-redux";
import { postVerifyResetPassword, changePassword } from "../../services/userService";
import * as actions from "../../store/actions";
import "./Login.scss";
import { toast } from "react-toastify";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            confirmPassword: "",
            statusVerified: false,
            errCode: "",
            isShowPassword: false,
            isShowConfirmPassword: false,
        };
    }

    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get("token");
            let userId = urlParams.get("userId");

            let res = await postVerifyResetPassword({
                token: token,
                userId: userId,
            });
            if (res) {
                this.setState({
                    statusVerified: true,
                    errCode: res.errCode,
                });
            }
        }
    }
    handleOnChangeInput = (e, id) => {
        let valueInput = e.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({ ...stateCopy });
    };

    handleShowPassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword,
        });
    };

    handleShowConfirmPassword = () => {
        this.setState({
            isShowConfirmPassword: !this.state.isShowConfirmPassword,
        });
    };

    handleSavePassword = async () => {
        let urlParams = new URLSearchParams(this.props.location.search);
        let userId = urlParams.get("userId");

        let { password, confirmPassword } = this.state;
        if (password === "" || confirmPassword === "") {
            toast.error("Vui lòng nhập thông tin");
            return;
        }
        if (password.length <= 8 || confirmPassword.length <= 8) {
            toast.error("Mật khẩu phải lớn hơn 8 ký tự");
            return;
        }
        if (password && password && password !== confirmPassword) {
            toast.error("Mật khẩu không khớp");
            return;
        }

        let res = await changePassword({
            id: userId,
            password: this.state.password,
        });

        if (res && res.errCode === 0) {
            toast.success("Đổi mật khẩu thành công");
            this.props.history.push(`/login`);
        } else {
            toast.error(res.errMessage);
        }
    };

    render() {
        let { errCode, statusVerified } = this.state;
        return (
            <div className="login-background">
                <div className="login-container">
                    {statusVerified ? (
                        <div>
                            {errCode === 0 ? (
                                <div className="verify-success">
                                    {" "}
                                    <div className="login-content row">
                                        <div className="col-12 login-text">Thay đổi mật khẩu</div>
                                        <div className="col-12 form-group login-input">
                                            <label>Mật khẩu mới</label>
                                            <div className="custom-input-password">
                                                <input
                                                    type={
                                                        this.state.isShowPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    className="form-control"
                                                    placeholder="Nhập mật khẩu mới"
                                                    value={this.state.password}
                                                    onChange={(event) =>
                                                        this.handleOnChangeInput(event, "password")
                                                    }
                                                />
                                                <span onClick={() => this.handleShowPassword()}>
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
                                        <div className="col-12 form-group login-input">
                                            <label>Xác nhận mật khẩu mới</label>
                                            <div className="custom-input-password">
                                                <input
                                                    type={
                                                        this.state.isShowConfirmPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    className="form-control"
                                                    placeholder="Nhập xác nhận mật khẩu mới"
                                                    value={this.state.confirmPassword}
                                                    onChange={(event) =>
                                                        this.handleOnChangeInput(
                                                            event,
                                                            "confirmPassword"
                                                        )
                                                    }
                                                />
                                                <span
                                                    onClick={() => this.handleShowConfirmPassword()}
                                                >
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
                                        <div className="col-12">
                                            <button
                                                className="login-btn"
                                                onClick={() => this.handleSavePassword()}
                                            >
                                                Thay đổi mật khẩu
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="verify-fail text-center">
                                    Đường link không tồn tại hoặc đã được sử dụng
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="verify-fail text-center">
                            Có lỗi đã ra, vui lòng thử lại
                        </div>
                    )}
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
    return {
        navigate: (path) => dispatch(push(path)),
        // userLoginFail: () => dispatch(actions.userLoginFail()),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
