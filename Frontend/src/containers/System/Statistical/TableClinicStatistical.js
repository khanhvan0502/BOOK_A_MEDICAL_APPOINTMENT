import React, { Component } from "react";
import "react-image-lightbox/style.css";
import "react-markdown-editor-lite/lib/index.css";
import { connect } from "react-redux";
import { getAllClinic } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import "./TableClinicStatistical.scss";

class TableClinicStatistical extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrClinics: [],
    };
  }

  async componentDidMount() {
    await this.getAllClinicStatistical();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  getAllClinicStatistical = async () => {
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      this.setState({
        arrClinics: res.data,
      });
    }
  };

  render() {
    let arrClinics = this.state.arrClinics;
    let { language } = this.props;
    return (
      <React.Fragment>
        <div className="statiscal-title">
          {language === LANGUAGES.VI
            ? "Danh sách cơ sở y tế"
            : "List of medical facilities"}
        </div>
        <table id="tableManagerUser">
          <tbody>
            <tr>
              <th>Stt</th>
              <th>
                {language === LANGUAGES.VI ? "Tên cở sở y tế" : "Clinics name"}
              </th>
              <th>
                {language === LANGUAGES.VI ? "Ảnh phòng khám" : "Clinics photo"}
              </th>
              <th>
                {language === LANGUAGES.VI
                  ? "Địa chỉ phòng khám"
                  : "Clinic address"}
              </th>
            </tr>
            {arrClinics && arrClinics.length > 0 ? (
              arrClinics.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td className="text-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="table-clinic-statistical-image"
                      />
                    </td>
                    <td>{item.address}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={"6"} style={{ textAlign: "center" }}>
                  {language === LANGUAGES.VI ? "Không có dữ liệu" : "No data"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </React.Fragment>
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
)(TableClinicStatistical);
