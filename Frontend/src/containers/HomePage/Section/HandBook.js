import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import { getAllHandBook } from "../../../services/userService";
import { withRouter } from "react-router";
import "./HandBook.scss";
import { FormattedMessage } from "react-intl";
import "./MedicalFacility.scss";

class HandBook extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataHandBook: [],
    };
  }

  async componentDidMount() {
    let res = await getAllHandBook();
    if (res && res.errCode === 0) {
      this.setState({
        dataHandBook: res.data ? res.data : [],
      });
    }
  }

  handleViewDetailHandBook = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-handbook/${item.id}`);
    }
  };
  handleViewAllHandbooks = () => {
    if (this.props.history) {
      this.props.history.push(`/get-all-handbooks`);
    }
  };

  render() {
    let { dataHandBook } = this.state;
    return (
      <div className="section-share section-medical-facility">
        <div className="handbook-container">
          <div className="handbook-header">
            <span className="title-section">
              <FormattedMessage id="homepage.handbook" />
            </span>
            <button
              className="btn-section"
              onClick={() => this.handleViewAllHandbooks()}
            >
              <FormattedMessage id="homepage.more-infor" />
            </button>
          </div>
          <div className="handbook-body">
            <Slider {...this.props.settings}>
              {dataHandBook &&
                dataHandBook.length > 0 &&
                dataHandBook.map((item, index) => {
                  return (
                    <div
                      className="section-customize handbook-child"
                      key={index}
                      onClick={() => this.handleViewDetailHandBook(item)}
                    >
                      <div className="customize-border">
                        <div className="outer-bg">
                          <div
                            className="bg-image section-medical-handbook"
                            style={{ backgroundImage: `url(${item.image})` }}
                          ></div>
                        </div>
                        <div className="handbook-name text-justify">{item.name}</div>
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
  connect(mapStateToProps, mapDispatchToProps)(HandBook)
);
