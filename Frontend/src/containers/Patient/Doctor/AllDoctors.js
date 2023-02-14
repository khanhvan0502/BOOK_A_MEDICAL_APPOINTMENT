import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
import HomeHeader from "../../HomePage/HomeHeader";
import "./AllDoctors.scss";

class AllDoctors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
      this.setState({
        arrDoctors: this.props.topDoctorsRedux,
      });
    }
  }

  componentDidMount() {
    this.props.loadAllDoctors();
  }

  handleViewDetailDoctor = (doctor) => {
    this.props.history.push(`/detail-doctor/${doctor.id}`);
  };

  render() {
    let arrDoctors = this.state.arrDoctors;
    let { language } = this.props;
    return (
      <div className="doctors-container">
        <HomeHeader />
        <div className="h2 text-center text-uppercase my-4">
          <FormattedMessage id="admin.manage-doctor.list-doctors" />
        </div>
        <div className="doctors-content">
          {arrDoctors &&
            arrDoctors.length > 0 &&
            arrDoctors.map((item, index) => {
              let nameVi = "";
              let nameEn = "";
              if (item && item.positionData) {
                nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName} `;
                nameEn = `${
                  item.positionData.valueEn !== "None"
                    ? item.positionData.valueEn + ","
                    : ""
                } ${item.firstName} ${item.lastName} `;
              }
              return (
                <div
                  className="section-customize doctors-child d-flex py-2"
                  key={index}
                  onClick={() => this.handleViewDetailDoctor(item)}
                  role="button"
                >
                  <div
                    className="bg-image-doctor section-doctors rounded-circle mx-3"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div>
                    <div className="doctor-name">
                      {language === LANGUAGES.VI ? nameVi : nameEn}
                    </div>
                    <div className="doctor-specialty">
                      {item?.Doctor_Infor?.specialtyData?.name || ""}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
    topDoctorsRedux: state.admin.allDoctors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadAllDoctors: () => dispatch(actions.fetchAllDoctors()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AllDoctors)
);
