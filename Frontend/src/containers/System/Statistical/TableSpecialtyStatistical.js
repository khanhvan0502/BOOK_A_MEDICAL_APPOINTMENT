import React, { Component } from "react";
import "react-markdown-editor-lite/lib/index.css";
import { connect } from "react-redux";
import { getAllSpecialty } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import "./TableSpecialtyStatistical.scss";

class TableSpecialtyStatistical extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrSpecialtys: [],
    };
  }

  async componentDidMount() {
    await this.getAllSpecialtyStatistical();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  getAllSpecialtyStatistical = async () => {
    let res = await getAllSpecialty();
    if (res && res.errCode === 0) {
      this.setState({
        arrSpecialtys: res.data,
      });
    }
  };

  render() {
    let arrSpecialtys = this.state.arrSpecialtys;
    let { language } = this.props;
    return (
      <React.Fragment>
        <div className="statiscal-title">
          {language === LANGUAGES.VI
            ? "Danh sách chuyên khoa"
            : "List of specialties"}
        </div>
        <table id="tableManagerUser">
          <tbody>
            <tr>
              <th>Stt</th>
              <th>
                {language === LANGUAGES.VI
                  ? "Tên chuyên khoa"
                  : "Specialist name"}
              </th>
              <th>
                {language === LANGUAGES.VI
                  ? "Ảnh chuyên khoa"
                  : "Specialist photo"}
              </th>
            </tr>
            {arrSpecialtys && arrSpecialtys.length > 0 ? (
              arrSpecialtys.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td className="text-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="table-specialty-statistical-image"
                      />
                    </td>
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
)(TableSpecialtyStatistical);
