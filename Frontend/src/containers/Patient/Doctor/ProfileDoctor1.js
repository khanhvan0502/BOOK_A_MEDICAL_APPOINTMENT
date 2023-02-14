import _ from "lodash";
import moment from "moment";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getProfileDoctorById } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import "./ProfileDoctor1.scss";
import localization from "moment/locale/vi";

class ProfileDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProfile: {},
      result: "",
    };
  }

  async componentDidMount() {
    let data = await this.getInfoDoctor(this.props.doctorId);
    this.setState({ dataProfile: data });
  }

  getInfoDoctor = async (id) => {
    let result = {};
    if (id) {
      let res = await getProfileDoctorById(id);
      if (res && res.errCode === 0) {
        result = res.data;
      }
    }
    return result;
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.props.doctorId !== prevProps.doctorId) {
    }
  }

  renderTimeBooking = (dataTime) => {
    let { language } = this.props;

    if (dataTime && !_.isEmpty(dataTime)) {
      let date =
        language === LANGUAGES.VI
          ? moment.unix(+dataTime.date).format("dddd - DD/MM/YYYY")
          : moment.unix(+dataTime.date).format("MM/DD/YYYY");

      let time =
        language === LANGUAGES.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;
      return (
        <>
          <div>
            {time} - {date}
          </div>
          <div>
            <FormattedMessage id="patient.booking-modal.bookingPrice" />
          </div>
        </>
      );
    }
    return <></>;
  };

  render() {
    let { dataProfile } = this.state;
    let {
      language,
      dataTime,
      isShowDescriptionDoctor,
      isShowPrice,
      isShowLinkDetail,
      doctorId,
    } = this.props;
    let nameVi = "",
      nameEn = "";

    if (dataProfile && dataProfile.positionData) {
      nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`;
      nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
    }
    let description = "";
    if (
      dataProfile &&
      dataProfile.Markdown &&
      dataProfile.Markdown.description
    ) {
      description = dataProfile.Markdown.description;
    }
    return (
      <div className="profile-doctor-container">
        <div className="intro-doctor">
          <div
            className="content-left"
            style={{
              backgroundImage: `url(${
                dataProfile && dataProfile.image ? dataProfile.image : ""
              })`,
            }}
          ></div>
          <div className="content-right">
            <div className="up">
              {language === LANGUAGES.VI ? nameVi : nameEn}
            </div>
            <div className="down">
              {isShowDescriptionDoctor === true ? (
                <>{description}</>
              ) : (
                <>{this.renderTimeBooking(dataTime)}</>
              )}
            </div>
          </div>
        </div>
        {isShowLinkDetail === true && (
          <div className="view-detail-doctor">
            <Link
              to={`/detail-doctor/${doctorId}`}
              style={{ textDecoration: "none" }}
            >
              Xem thêm
            </Link>
          </div>
        )}

        {isShowPrice === true && (
          <div className="price">
            <FormattedMessage id="patient.booking-modal.price" />:
            {dataProfile &&
            dataProfile.Doctor_Infor &&
            language === LANGUAGES.VI ? (
              <NumberFormat
                className="currency"
                displayType={"text"}
                thousandSeparator={true}
                suffix={"VND"}
                value={dataProfile.Doctor_Infor.priceTypeData.valueVi}
              />
            ) : (
              ""
            )}
            {dataProfile &&
            dataProfile.Doctor_Infor &&
            language === LANGUAGES.EN ? (
              <NumberFormat
                className="currency"
                displayType={"text"}
                thousandSeparator={true}
                suffix={"$"}
                value={dataProfile.Doctor_Infor.priceTypeData.valueEn}
              />
            ) : (
              ""
            )}
          </div>
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
