import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Modal } from "reactstrap";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import "./ConfirmDeleteUser.scss";

class ConfirmDeleteUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  toggle = () => {
    this.props.toggleFromParent();
  };

  handleConfirmDelete = async () => {
    if (this.props.userDelete.id) {
      this.props.deleteAUserRedux(this.props.userDelete.id);
      if (this.props.language === LANGUAGES.VI) {
        toast.success("Xóa thành công");
      } else {
        toast.success("Delete successful");
      }
    } else {
      if (this.props.language === LANGUAGES.VI) {
        toast.error("Xóa thất bại");
      } else {
        toast.error("Delete failed");
      }
      return;
    }
    this.toggle();
  };

  render() {
    let { isOpenModal, language } = this.props;
    return (
      <Modal
        isOpen={isOpenModal}
        className={"confirm-delete-container"}
        size="lg"
        centered
        toggle={() => {
          this.toggle();
        }}
      >
        <div className="confirm-delete-content">
          <div className="confirm-delete-header">
            <span className="left">
              {language === LANGUAGES.VI ? "Xác nhận xóa" : "Confirm delete"}
            </span>
            <span
              className="right"
              onClick={() => {
                this.toggle();
              }}
            >
              <i className="fas fa-times"></i>
            </span>
          </div>
          <div className="confirm-delete-body">
            <span className="confirm-delete-text">
              {language === LANGUAGES.VI
                ? "Bạn có chắc bạn muốn xóa người dùng này?"
                : "Are you sure you want to delete this user?"}
            </span>
          </div>
          <div className="confirm-delete-footer">
            <button
              className="btn btn-primary"
              onClick={() => this.handleConfirmDelete()}
            >
              {language === LANGUAGES.VI ? "Xác nhận" : "Confirm"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                this.toggle();
              }}
            >
              {language === LANGUAGES.VI ? "Hủy" : "Cancel"}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return { deleteAUserRedux: (id) => dispatch(actions.deleteAUser(id)) };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDeleteUser);
