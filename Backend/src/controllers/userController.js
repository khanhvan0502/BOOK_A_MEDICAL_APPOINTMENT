import userService from "../services/userService";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: "Vui lòng nhập thông tin!",
        });
    }

    let userData = await userService.handleUserLogin(email, password);
    //check email exist
    //compare password
    //userInfor
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {},
    });
};

let handleForgotPassword = async (req, res) => {
    try {
        let response = await userService.handleForgotPassword(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server.",
        });
    }
};

let handleVerifyResetPassword = async (req, res) => {
    try {
        let response = await userService.handleVerifyResetPassword(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server.",
        });
    }
};

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; // ALL, ID
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters",
            users: [],
        });
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        users,
    });
};

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters",
        });
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
};

let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let getListHistoryPatient = async (req, res) => {
    try {
        let response = await userService.getListHistoryPatient(req.query.doctorId, req.query.date);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from the server.",
        });
    }
};

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
    getListHistoryPatient: getListHistoryPatient,
    handleForgotPassword: handleForgotPassword,
    handleVerifyResetPassword: handleVerifyResetPassword,
};
