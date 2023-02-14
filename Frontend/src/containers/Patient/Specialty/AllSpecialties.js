import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { getAllSpecialty } from "../../../services/userService";
import HomeHeader from "../../HomePage/HomeHeader";
import "./AllSpecialties.scss";

class AllSpecialties extends Component {
  constructor(props) {
    super(props);
    this.state = {
      specialties: [],
    };
  }

  async componentDidMount() {
    let res = await getAllSpecialty();
    if (res && res.errCode === 0) {
      this.setState({
        specialties: res.data,
      });
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  handleViewDetailSpecialty = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${item.id}`);
    }
  };

  render() {
    let { language } = this.props;
    let { specialties } = this.state;
    return (
      <div className="detail-specialties-container">
        <HomeHeader />
        <div className="detail-specialty-body">
          <div className="h2 text-center text-uppercase my-4">
            <FormattedMessage id="manage-specialty.list-specialties" />
          </div>
          <div className="detail-specialties-content">
            {specialties &&
              specialties.length > 0 &&
              specialties.map((item, index) => {
                return (
                  <div
                    className="section-customize specialty-child d-flex py-2"
                    key={index}
                    onClick={() => this.handleViewDetailSpecialty(item)}
                  >
                    <div
                      className="bg-image section-specialty"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <div className="specialties-name py-0 pl-3">
                      {item.name}
                    </div>
                  </div>
                );
              })}
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

export default connect(mapStateToProps, mapDispatchToProps)(AllSpecialties);
