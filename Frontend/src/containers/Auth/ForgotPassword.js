import bcrypt from "bcryptjs";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Modal } from "reactstrap";
import { forgotPassword } from "../../services/userService";
import "./ForgotPassword.scss";

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            loading: false,
        };
    }

    async componentDidMount() {}

    async componentDidUpdate(prevProps, prevState, snapshot) {}

    toggle = () => {
        this.props.toggleFromParent();
    };
    handleOnChangeInput = (e, id) => {
        let valueInput = e.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({ ...stateCopy });
    };

    handleForgotPassword = async () => {
        let { handleCloseModal } = this.props;

        let state = this.state;
        if (state["email"] === "") {
            toast.error("Vui lòng nhập email");
            return;
        } else if (state["email"] !== "") {
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
                    toast.error("Email không đúng định dạng");
                    return;
                }
            }
        }
        this.setState({ loading: true });

        let res = await forgotPassword({ email: this.state.email });
        if (res && res.errCode === 0) {
            toast.success(res.message);
            handleCloseModal();
        } else {
            toast.error(res.message);
        }
        this.setState({ loading: false });
    };
    render() {
        let { isOpenModal, handleCloseModal } = this.props;

        return (
            <Modal
                isOpen={isOpenModal}
                className={`change-password-container ${this.state.loading ? "is-loading" : ""}`}
                size="lg"
                centered
            >
                <div className="change-password-content">
                    <div className="change-password-header">
                        <span className="left">Quên mật khẩu</span>
                        <span className="right" onClick={handleCloseModal}>
                            <i className="fas fa-times"></i>
                        </span>
                    </div>
                    <div className="change-password-body">
                        <div className="col-12 form-group">
                            <label>Email</label>
                            <input
                                className="form-control"
                                placeholder="Nhập địa chỉ email để phục hồi mật khẩu"
                                onChange={(e) => this.handleOnChangeInput(e, "email")}
                            />
                        </div>
                    </div>
                    <div className="change-password-footer">
                        <button
                            className="btn btn-primary"
                            onClick={() => this.handleForgotPassword()}
                        >
                            Xác nhận
                        </button>
                        <button className="btn btn-secondary" onClick={handleCloseModal}>
                            Hủy
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
