import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Slider from "react-slick";
import { getAllSpecialty } from "../../../services/userService";
import "./Specialty.scss";

class Specialty extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSpecialty: [],
    };
  }

  async componentDidMount() {
    let res = await getAllSpecialty();
    if (res && res.errCode === 0) {
      this.setState({
        dataSpecialty: res.data ? res.data : [],
      });
    }
  }

  handleViewDetailSpecialty = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${item.id}`);
    }
  };

  handleViewAllSpecialties = () => {
    if (this.props.history) {
      this.props.history.push(`/get-all-specialties/`);
    }
  };

  render() {
    let { dataSpecialty } = this.state;

    return (
      <div className="section-share section-have-bg">
        <div className="specialty-container">
          <div className="specialty-header">
            <span className="title-section">
              <FormattedMessage id="homepage.specialty-popular" />
            </span>
            <button
              className="btn-section"
              onClick={() => this.handleViewAllSpecialties()}
            >
              <FormattedMessage id="homepage.more-infor" />
            </button>
          </div>
          <div className="specialty-body">
            <Slider {...this.props.settings}>
              {dataSpecialty &&
                dataSpecialty.length > 0 &&
                dataSpecialty.map((item, index) => {
                  return (
                    <div
                      className="section-customize specialty-child"
                      key={index}
                      onClick={() => this.handleViewDetailSpecialty(item)}
                    >
                      <div className="customize-border">
                        <div className="outer-bg">
                          <div
                            className="bg-image section-specialty"
                            style={{ backgroundImage: `url(${item.image})` }}
                          ></div>
                        </div>
                        <div className="specialty-name text-center">
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
  connect(mapStateToProps, mapDispatchToProps)(Specialty)
);
