import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { CKEditorComponent } from "../../../components/CkEditor";
import { createNewHandBook } from "../../../services/userService";
import { CommonUtils } from "../../../utils";
import "./AddHandBook.scss";

class AddHandBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      imageBase64: "",
      descriptionHTML: "",
    };
  }

  async componentDidMount() {}

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  handleOnChangeInput = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };

  handleEditorChange = (content) => {
    this.setState({
      descriptionHTML: content,
    });
  };

  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        imageBase64: base64,
      });
    }
  };

  handleSaveNewHandBook = async () => {
    let res = await createNewHandBook(this.state);
    if (res && res.errCode === 0) {
      toast.success("Thêm cẩm nang thành công!");
      this.setState({
        name: "",
        imageBase64: "",
        descriptionHTML: "",
      });
    } else {
      toast.error("Bạn chưa nhập đủ thông tin, mời bạn nhập lại!");
      console.log("Sai, check lai res", res);
    }
  };

  render() {
    return (
      <div className="manage-handbook-container container">
        <div className="hb-title">
          <FormattedMessage id="admin.manage-handbook.title" />
        </div>

        <div className="add-new-handbook row">
          <div className="col-6 form-group">
            <label>
              <FormattedMessage id="admin.manage-handbook.name" />
            </label>
            <input
              className="form-control"
              type="text"
              value={this.state.name}
              onChange={(event) => this.handleOnChangeInput(event, "name")}
            ></input>
          </div>
          <div className="col-6 form-group">
            <label>
              <FormattedMessage id="admin.manage-handbook.image" />
            </label>
            <input
              className="form-control-file"
              type="file"
              onChange={(event) => this.handleOnChangeImage(event)}
            ></input>
          </div>

          <div className="col-12">
            <CKEditorComponent
              data={this.state.descriptionHTML}
              onChangeData={this.handleEditorChange}
            />
          </div>

          <div className="col-12">
            <button
              className="btn-save-handbook"
              onClick={() => this.handleSaveNewHandBook()}
            >
              <FormattedMessage id="admin.manage-handbook.add" />
            </button>
          </div>
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AddHandBook);
