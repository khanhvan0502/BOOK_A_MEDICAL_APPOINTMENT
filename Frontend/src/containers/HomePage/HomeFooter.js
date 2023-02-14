import React, { Component } from "react";
import { connect } from "react-redux";
import logo from "../../assets/images/DoctorCare-Mini.png";
import "./HomeFooter.scss";
import LogoFacebook from "../../assets/images/facebook-square.svg";
import LogoYoutube from "../../assets/images/youtube-square.svg";
import { Link } from "react-router-dom";

class HomeFooter extends Component {
  render() {
    return (
      <>
        <div className="section-share section-have-bg section-footer">
          <div className="container">
            <div className="row">
              <div className="col-6">
                <a href="/" className="link-logo-footer">
                  <img className="logo-footer" src={logo} alt="DoctorCare" />
                </a>
                <div className="footer-firm">
                  <h2>Công ty TNHH DoctorCare</h2>
                  <p>
                    <i className="fas fa-map-marker-alt"></i>
                    03 Quang Trung, Hải Châu 1, Hải Châu, Đà Nẵng
                  </p>
                </div>
              </div>
              <div className="col-3 list-contact">
                <ul>
                  <li>
                    <Link to="/coming-soon">Liên hệ hợp tác</Link>
                  </li>
                  <li>
                    <Link to="/coming-soon">Câu hỏi thường gặp</Link>
                  </li>
                  <li>
                    <Link to="/coming-soon">Điều khoản sử dụng</Link>
                  </li>
                  <li>
                    <Link to="/coming-soon">Chính sách Bảo mật</Link>
                  </li>
                  <li>
                    <Link to="/coming-soon">
                      Quy trình hỗ trợ giải quyết khiếu nại
                    </Link>
                  </li>
                  <li>
                    <Link to="/coming-soon">Quy chế hoạt động</Link>
                  </li>
                </ul>
              </div>
              <div className="col-3">
                <div className="list">
                  <strong>Trụ sở tại Đà Nẵng</strong>
                  <br />
                  03 Quang Trung, Hải Châu 1, Hải Châu, Đà Nẵng
                </div>
                <br />
                <div className="list">
                  <strong>Hỗ trợ khách hàng</strong>
                  <br />
                  doctorcare@gmail.com (7h - 18h)
                </div>
              </div>
              <div className="col-12">
                <hr />
              </div>
            </div>
          </div>
        </div>
        <div className="chantrang">
          <div className="container">
            <div className="row hang">
              <div className="col-4 chu-trai">
                <small>@ 2022 DoctorCare.</small>
              </div>
              <div className="col-8 chu-phai">
                <a target="_blank" href="https://www.facebook.com/DoctorCareCompany">
                  <img
                    className="nut-mxh"
                    width="32px"
                    height="32px"
                    src={LogoFacebook}
                    alt="Facebook"
                  />
                </a>
                <a
                  target="_blank"
                  href="https://www.youtube.com/channel/UC9l2RhMEPCIgDyGCH8ijtPQ"
                >
                  <img
                    className="nut-mxh"
                    width="32px"
                    height="32px"
                    src={LogoYoutube}
                    alt="Youtube"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
