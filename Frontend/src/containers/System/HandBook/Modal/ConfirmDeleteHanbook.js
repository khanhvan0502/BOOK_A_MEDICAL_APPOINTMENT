import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Modal } from "reactstrap";
import {
  deleteClinicById,
  deleteHandBookById,
} from "../../../../services/userService";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import "./ConfirmDeleteHanbook.scss";

class ConfirmDeleteHanbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newHandBooks: [],
    };
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
    let handBooks = this.props.handbooks;
    try {
      const res = await deleteHandBookById(this.props.handbookDelete);
      if (res && res.errCode === 0) {
        const newHandBooks = handBooks.filter(
          (handBook) => handBook.id !== this.props.handbookDelete
        );

        this.setState({ newHandBooks: newHandBooks });

        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
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
                ? "Bạn có chắc bạn muốn xóa cẩm nang này?"
                : "Are you sure you want to delete this hanbook?"}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmDeleteHanbook);
