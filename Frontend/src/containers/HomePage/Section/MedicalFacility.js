import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import Slider from "react-slick";
import "./MedicalFacility.scss";
import { getAllClinic } from "../../../services/userService";

class MedicalFacility extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataClinics: [],
    };
  }

  async componentDidMount() {
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      this.setState({
        dataClinics: res.data ? res.data : [],
      });
    }
  }

  handleViewDetailClinic = (clnic) => {
    if (this.props.history) {
      this.props.history.push(`/detail-clinic/${clnic.id}`);
    }
  };

  handleViewAllClinics = () => {
    if (this.props.history) {
      this.props.history.push(`/get-all-clinics/`);
    }
  };

  render() {
    let { dataClinics } = this.state;
    return (
      <div className="section-share">
        <div className="medical-container">
          <div className="medical-header">
            <span className="title-section">
              <FormattedMessage id="homepage.medical-facility" />
            </span>
            <button
              className="btn-section"
              onClick={() => this.handleViewAllClinics()}
            >
              <FormattedMessage id="homepage.more-infor" />
            </button>
          </div>
          <div className="specialty-body">
            <Slider {...this.props.settings}>
              {dataClinics &&
                dataClinics.length > 0 &&
                dataClinics.map((item, index) => {
                  return (
                    <div
                      className="section-customize clinic-child"
                      key={index}
                      onClick={() => this.handleViewDetailClinic(item)}
                    >
                      <div className="customize-border">
                        <div className="outer-bg">
                          <div
                            className="bg-image section-medical-facility"
                            style={{ backgroundImage: `url(${item.image})` }}
                          />
                        </div>
                        <div className="clinic-name text-center">
                          {item.name}
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
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MedicalFacility)
);
