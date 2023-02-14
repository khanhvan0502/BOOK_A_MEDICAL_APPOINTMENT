import React, { Component } from "react";
import { connect } from "react-redux";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import HomeFooter from "./HomeFooter";
import HomeHeader from "./HomeHeader";
import "./HomePage.scss";
import MedicalFacility from "./Section/MedicalFacility";
import OutstandingDoctor from "./Section/OutstandingDoctor";
import HandBook from "./Section/HandBook";
import "./HomePage.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Specialty from "./Section/Specialty";
import MessengerCustomerChat from "react-messenger-customer-chat";
require("dotenv").config();

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
    };

    return (
      <div>
        <HomeHeader isShowBanner={true} />
        <Specialty settings={settings} />
        <MedicalFacility settings={settings} />
        <OutstandingDoctor settings={settings} />
        <HandBook settings={settings} />
        <HomeFooter />
        <MessengerCustomerChat
          language="vi_VN"
          pageId={process.env.REACT_APP_PAGE_ID}
          appId={process.env.REACT_APP_FACEBOOK_APP_ID}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
