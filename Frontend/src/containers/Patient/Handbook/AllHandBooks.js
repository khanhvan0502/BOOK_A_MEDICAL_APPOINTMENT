import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { getAllHandBook } from "../../../services/userService";
import HomeHeader from "../../HomePage/HomeHeader";
import "./AllHandBooks.scss";

class AllHandBooks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handBooks: [],
    };
  }

  async componentDidMount() {
    let res = await getAllHandBook();
    if (res && res.errCode === 0) {
      this.setState({
        handBooks: res.data,
      });
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  handleViewDetailHandBook = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-handbook/${item.id}`);
    }
  };

  render() {
    let { handBooks } = this.state;
    return (
      <div className="detail-hanbook-container">
        <HomeHeader />
        <div className="detail-specialty-body">
          <div className="h2 text-center text-uppercase my-4">
            <FormattedMessage id="homepage.list-handbook" />
          </div>
          <div className="detail-hanbook-content">
            {handBooks &&
              handBooks.length > 0 &&
              handBooks.map((item, index) => {
                return (
                  <div
                    className="section-customize hanbook-child d-flex py-2"
                    key={index}
                    onClick={() => this.handleViewDetailHandBook(item)}
                  >
                    <div
                      className="bg-image section-hanbook"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <div className="hanbook-name py-0 pl-3">{item.name}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AllHandBooks);
