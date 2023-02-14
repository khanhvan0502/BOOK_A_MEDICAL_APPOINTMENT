import { ConnectedRouter as Router } from "connected-react-router";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";
import CustomScrollbars from "../components/CustomScrollbars";
import { userIsAuthenticated, userIsNotAuthenticated } from "../hoc/authentication";
import { history } from "../redux";
import Doctor from "../routes/Doctor";
import Home from "../routes/Home";
import System from "../routes/System";
import { path } from "../utils";
import Login from "./Auth/Login";
import HomePage from "./HomePage/HomePage";
import ComingSoon from "./HomePage/Section/ComingSoon";
import AllClinics from "./Patient/Clinic/AllClinics";
import DetailClinic from "./Patient/Clinic/DetailClinic";
import AllDoctors from "./Patient/Doctor/AllDoctors";
import DetailDoctor from "./Patient/Doctor/DetailDoctor";
import AllHandBooks from "./Patient/Handbook/AllHandBooks";
import DetailHandBook from "./Patient/Handbook/DetailHandBook";
import AllSpecialties from "./Patient/Specialty/AllSpecialties";
import DetailSpecialty from "./Patient/Specialty/DetailSpecialty";
import VerifyEmail from "./Patient/VerifyEmail";
import ResetPassword from "./Auth/ResetPassword";

class App extends Component {
    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <ConfirmModal />
                        <div className="content-container">
                            <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
                                <Switch>
                                    <Route path={path.HOME} exact component={Home} />
                                    <Route
                                        path={path.LOGIN}
                                        component={userIsNotAuthenticated(Login)}
                                    />
                                    <Route
                                        path={path.SYSTEM}
                                        component={userIsAuthenticated(System)}
                                    />
                                    <Route
                                        path={path.DOCTOR}
                                        component={userIsAuthenticated(Doctor)}
                                    />
                                    <Route path={path.HOMEPAGE} component={HomePage} />
                                    <Route
                                        path={path.DETAIL_SPECIALTY}
                                        component={DetailSpecialty}
                                    />
                                    <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                                    <Route path={path.DETAIL_CLINIC} component={DetailClinic} />
                                    <Route path={path.DETAIL_HANDBOOK} component={DetailHandBook} />

                                    <Route
                                        path={path.VERIFY_EMAIL_BOOKING}
                                        component={VerifyEmail}
                                    />
                                    <Route path={path.FORGOT_PASSWORD} component={ResetPassword} />
                                    <Route
                                        path={path.GET_ALL_SPECIALTIES}
                                        component={AllSpecialties}
                                    />
                                    <Route path={path.GET_ALL_CLINICS} component={AllClinics} />
                                    <Route path={path.GET_ALL_DOCTORS} component={AllDoctors} />
                                    <Route path={path.GET_ALL_HANDBOOKS} component={AllHandBooks} />
                                    <Route path={path.COMING_SOON} component={ComingSoon} />
                                </Switch>
                            </CustomScrollbars>
                        </div>

                        <ToastContainer
                            position="bottom-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                    </div>
                </Router>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
