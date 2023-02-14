import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";

class OutstandingDoctor extends Component {
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
    this.props.loadTopDoctors();
  }

  handleViewDetailDoctor = (doctor) => {
    this.props.history.push(`/detail-doctor/${doctor.id}`);
  };
  handleViewAllDoctor = () => {
    if (this.props.history) {
      this.props.history.push(`/get-all-doctors/`);
    }
  };

  render() {
    let arrDoctors = this.state.arrDoctors;
    let { language } = this.props;
    return (
      <div className="section-share section-outstanding-doctor">
        <div className="doctor-container">
          <div className="doctor-header">
            <span className="title-section">
              <FormattedMessage id="homepage.outstanding-doctor" />
            </span>
            <button
              className="btn-section"
              onClick={() => this.handleViewAllDoctor()}
            >
              <FormattedMessage id="homepage.more-infor" />
            </button>
          </div>
          <div className="specialty-body">
            <Slider {...this.props.settings}>
              {arrDoctors &&
                arrDoctors.length > 0 &&
                arrDoctors.map((item, index) => {
                  let imageBase64 = "";
                  if (item.image) {
                    imageBase64 = Buffer.from(item.image, "base64").toString(
                      "binary"
                    );
                  }
                  let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName} `;
                  let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName} `;
                  return (
                    <div
                      className="section-customize"
                      key={index}
                      onClick={() => this.handleViewDetailDoctor(item)}
                    >
                      <div className="customize-border">
                        <div className="outer-bg">
                          <div
                            className="bg-image section-outstanding-doctor"
                            style={{
                              backgroundImage: `url(${imageBase64})`,
                            }}
                          />
                        </div>
                        <div className="position text-center">
                          <div>
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                          </div>
                          {item &&
                            item.Doctor_Infor &&
                            item.Doctor_Infor.specialtyData &&
                            item.Doctor_Infor.specialtyData.name}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
    topDoctorsRedux: state.admin.topDoctors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OutstandingDoctor)
);
