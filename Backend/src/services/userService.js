import db from "../models/index";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import emailService from "./emailService";

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user already exist
                let user = await db.User.findOne({
                    attributes: ["id", "email", "roleId", "password", "firstName", "lastName"],
                    where: { email: email },
                    raw: true,
                });
                if (user) {
                    //compare password
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "Success!";
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Sai mật khẩu!";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `Không tìm thấy người dùng!`;
                }
            } else {
                //return error
                userData.errCode = 1;
                userData.errMessage = `Tài khoản không tồn tại, vui lòng thử lại!`;
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
};

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            if (userId === "ALL") {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ["password"],
                    },
                });
            }
            if (userId && userId !== "ALL") {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ["password"],
                    },
                });
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
};
let buildUrlEmail = (userId, token) => {
    let result = `${process.env.URL_REACT}/forgot-password?userId=${userId}&token=${token}`;

    return result;
};

let handleForgotPassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let email = data.email;
            let isExist = await checkUserEmail(email);
            let res = {};
            if (isExist) {
                //user already exist
                let user = await db.User.findOne({
                    where: { email: email },
                    raw: false,
                });
                if (user) {
                    let token = uuidv4();
                    user.token = token;
                    await user.save();
                    await emailService.sendForgotPasswordEmail({
                        username: `${user.lastName} ${user.firstName}`,
                        receiverEmail: user.email,
                        redirectLink: buildUrlEmail(user.id, token),
                    });
                    res.errCode = 0;
                    res.message = `Yêu cầu phục hồi mật khẩu thành công, vui lòng kiểm tra email của bạn!`;
                } else {
                    res.errCode = 2;
                    res.message = `Không tìm thấy người dùng!`;
                }
            } else {
                //return error
                res.errCode = 1;
                res.message = `Tài khoản không tồn tại, vui lòng thử lại!`;
            }
            resolve(res);
        } catch (e) {
            reject(e);
        }
    });
};

let handleVerifyResetPassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.userId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                let user = await db.User.findOne({
                    where: {
                        token: data.token,
                        id: data.userId,
                    },
                    raw: false,
                });

                if (user) {
                    user.token = "";
                    await user.save();
                    resolve({
                        errCode: 0,
                        errMessage: "Verify user successfully",
                    });
                } else {
                    resolve({
                        errCode: -1,
                        errMessage: "Token is wrong or user is not exist",
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check mail is exist
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: "Your email is already is used. Please try another email!",
                });
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    birthday: data.birthday,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar,
                });

                resolve({
                    errCode: 0,
                    message: "Create User Successfully",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameters",
                });
            }
            let user = await db.User.findOne({
                raw: false,
                where: { id: data.id },
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roleId = data.roleId;
                user.birthday = data.birthday;
                user.positionId = data.positionId;
                user.gender = data.gender;
                user.phonenumber = data.phonenumber;
                if (data.avatar) {
                    user.image = data.avatar;
                }

                await user.save();

                resolve({
                    errCode: 0,
                    message: "Update User Successfully",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `User's not found`,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
            });
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: `The user isn't exist!`,
                });
            }
            await db.User.destroy({
                where: { id: userId },
            });

            resolve({
                errCode: 0,
                message: `The user is deleted`,
            });
        } catch (e) {
            reject(e);
        }
    });
};

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters !",
                });
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput },
                });

                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getListHistoryPatient = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: -1,
                    errMessage: "Missing required parameters",
                });
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        date: date,
                        doctorId: doctorId,
                    },
                    include: [
                        {
                            model: db.User,
                            as: "patientData",
                            attributes: [
                                "email",
                                "firstName",
                                "address",
                                "gender",
                                "lastName",
                                "birthday",
                            ],
                            include: [
                                {
                                    model: db.Allcode,
                                    as: "genderData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                            ],
                        },
                        {
                            model: db.Allcode,
                            as: "timeTypeDataPatient",
                            attributes: ["valueEn", "valueVi"],
                        },
                    ],

                    raw: false,
                    nest: true,
                });
                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    updateUserData: updateUserData,
    deleteUser: deleteUser,
    getAllCodeService: getAllCodeService,
    getListHistoryPatient: getListHistoryPatient,
    handleForgotPassword: handleForgotPassword,
    handleVerifyResetPassword: handleVerifyResetPassword,
};
