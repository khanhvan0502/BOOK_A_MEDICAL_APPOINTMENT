import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Modal } from "reactstrap";
import { postCancelMedicalAppointment } from "../../../../services/userService";
import { LANGUAGES } from "../../../../utils";
import "./ConfirmDeletePatient.scss";

class ConfirmDeletePatient extends Component {
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
    let item = this.props.item;
    let res = await postCancelMedicalAppointment({
      doctorId: item.doctorId,
      patientId: item.patientId,
      timeType: item.timeType,
    });
    if (res && res.errCode === 0) {
      if (this.props.language === LANGUAGES.VI) {
        toast.success("Hủy thành công");
      } else {
        toast.success("Cancel succeeds");
      }
    } else {
      if (this.props.language === LANGUAGES.VI) {
        toast.error("Có gì đó không đúng...");
      } else {
        toast.error("Something wrong...");
      }
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
                ? "Bạn có chắc bạn muốn xóa mục này?"
                : "Are you sure you want to delete this item?"}
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
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmDeletePatient);
