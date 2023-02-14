import bcrypt from "bcryptjs";
import _ from "lodash";
import db from "../models/index";
import emailService from "../services/emailService";
require("dotenv").config();

const salt = bcrypt.genSaltSync(10);

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: "R2" },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ["password"],
                },
                include: [
                    {
                        model: db.Allcode,
                        as: "positionData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "genderData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Doctor_Infor,
                        attributes: {
                            exclude: ["id", "doctorId"],
                        },
                        include: [
                            {
                                model: db.Specialty,
                                as: "specialtyData",
                                attributes: ["name"],
                            },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });
            resolve({
                errCode: 0,
                data: users,
            });
        } catch (e) {
            reject(e);
        }
    });
};

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: "R2" },
                attributes: {
                    exclude: ["password"],
                },
                include: [
                    {
                        model: db.Allcode,
                        as: "positionData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Doctor_Infor,
                        attributes: {
                            exclude: ["id", "doctorId"],
                        },
                        include: [
                            {
                                model: db.Specialty,
                                as: "specialtyData",
                                attributes: ["name"],
                            },
                        ],
                    },
                ],
                raw: false,
                nest: true,
            });
            if (doctors && doctors.length > 0) {
                doctors.map((item) => {
                    item.image = Buffer.from(item.image, "Base64").toString("binary");
                    return item;
                });
            }
            resolve({
                errCode: 0,
                data: doctors,
            });
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

let checkRequiredFields = (inputData) => {
    let arrFields = [
        "doctorId",
        "contentHTML",
        "action",
        "selectedPrice",
        "selectedPayment",
        "selectedProvince",
        "note",
        "specialtyId",
    ];

    let isValid = true;
    let element = "";
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            element = arrFields[i];
            break;
        }
    }
    return {
        isValid: isValid,
        element: element,
    };
};

let saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredFields(inputData);
            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkObj.element}`,
                });
            } else {
                //upsert to Markdown
                if (inputData.action === "CREATE") {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    });
                } else if (inputData.action === "EDIT") {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false,
                    });
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        doctorMarkdown.updateAt = new Date();

                        await doctorMarkdown.save();
                    }
                }

                //upsert to Doctor infor table
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false,
                });

                if (doctorInfor) {
                    //update
                    doctorInfor.doctorId = inputData.doctorId;
                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.paymentId = inputData.selectedPayment;
                    doctorInfor.provinceId = inputData.selectedProvince;
                    doctorInfor.note = inputData.note;
                    doctorInfor.specialtyId = inputData.specialtyId;
                    doctorInfor.clinicId = inputData.clinicId;

                    await doctorInfor.save();
                } else {
                    //create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId,
                    });
                }

                resolve({
                    errCode: 0,
                    message: "Save infor doctor succeed!",
                });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

let getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: doctorId },
                    attributes: {
                        exclude: ["password"],
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: "positionData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Markdown,
                            attributes: ["description"],
                        },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ["id", "doctorId"],
                            },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: "priceTypeData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                                {
                                    model: db.Allcode,
                                    as: "provinceTypeData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                                {
                                    model: db.Allcode,
                                    as: "paymentTypeData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                            ],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                if (data && data.image) {
                    data.image = Buffer.from(data.image, "base64").toString("binary");
                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errmessage: "Missing required parameter!",
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ["password"],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ["description", "contentHTML"],
                        },
                        {
                            model: db.Allcode,
                            as: "positionData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ["id", "doctorId"],
                            },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: "priceTypeData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                                {
                                    model: db.Allcode,
                                    as: "provinceTypeData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                                {
                                    model: db.Allcode,
                                    as: "paymentTypeData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                            ],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if (data && data.image) {
                    data.image = Buffer.from(data.image, "base64").toString("binary");
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (error) {
            console.error(error);
            reject(e);
        }
    });
};

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.arrSchedule ||
                !data.doctorId ||
                !data.formatedDate ||
                !data.maxNumberOfPatients
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required paramester",
                });
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map((item) => {
                        item.maxNumber = data.maxNumberOfPatients;
                        return item;
                    });
                }
                //get all existing data
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formatedDate },
                    attributes: ["timeType", "date", "doctorId", "maxNumber"],
                    raw: true,
                });
                //compare different
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });
                //create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }
                resolve({
                    errCode: 0,
                    message: "Ok",
                });
            }
        } catch (error) {
            reject(123, error);
        }
    });
};

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    include: [
                        {
                            model: db.Allcode,
                            as: "timeTypeData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.User,
                            as: "doctorData",
                            attributes: ["firstName", "lastName"],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                if (!dataSchedule) dataSchedule = [];

                resolve({
                    errCode: 0,
                    data: dataSchedule,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getExtraInforDoctorById = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: -1,
                    errMessage: "Missing required parameters",
                });
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: idInput,
                    },
                    attributes: {
                        exclude: ["id", "doctorId"],
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: "priceTypeData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Allcode,
                            as: "provinceTypeData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Allcode,
                            as: "paymentTypeData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Clinic,
                            as: "clinicData",
                            attributes: ["name", "address"],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if (!data) data = {};
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

let getListPatientForDoctor = (doctorId, date) => {
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
                        statusId: "S2",
                        doctorId: doctorId,
                        date: date,
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

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
                resolve({
                    errCode: -1,
                    errMessage: "Missing required parameters",
                });
            } else {
                //update patient status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: "S2",
                    },
                    raw: false,
                });
                if (appointment) {
                    appointment.statusId = "S3";
                    await appointment.save();
                }
                //send email remedy
                await emailService.sendAttachment(data);
                resolve({
                    errCode: 0,
                    errMessage: "Ok",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getPassword = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: -1,
                    errMessage: "Missing required parameters",
                });
            } else {
                let res = {};
                let password = await db.User.findOne({
                    where: {
                        id: idInput,
                    },
                    attributes: {
                        exclude: [
                            "email",
                            "firstName",
                            "lastName",
                            "address",
                            "birthday",
                            "phonenumber",
                            "gender",
                            "roleId",
                            "positionId",
                            "image",
                        ],
                    },
                    raw: false,
                });
                res.errCode = 0;
                res.data = password;
                resolve(res);
            }
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

let changePassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameters",
                });
            }
            let user = await db.User.findOne({
                raw: false,
                where: { id: data.id },
            });
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            if (user) {
                user.password = hashPasswordFromBcrypt;

                await user.save();

                resolve({
                    errCode: 0,
                    errMessage: "Update User Successfully",
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

let handleDeleteSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.date || !data.timeType) {
                resolve({
                    errCode: -1,
                    errMessage: "Missing required parameters",
                });
            } else {
                let scheduleSelected = await db.Schedule.findOne({
                    where: {
                        doctorId: data.doctorId,
                        date: data.date,
                        timeType: data.timeType,
                    },
                });
                if (!scheduleSelected) {
                    resolve({
                        errCode: 2,
                        errMessage: `The schedule isn't exist!`,
                    });
                }
                await db.Schedule.destroy({
                    where: { timeType: data.timeType, date: data.date },
                });
                resolve({
                    errCode: 0,
                    message: `The schedule is deleted`,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let cancelMedicalAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.patientId || !data.timeType) {
                resolve({
                    errCode: -1,
                    errMessage: "Missing required parameters",
                });
            } else {
                //update patient status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: "S2",
                    },
                    raw: false,
                });
                if (appointment) {
                    appointment.statusId = "S4";
                    await appointment.save();
                }
                resolve({
                    errCode: 0,
                    message: `The schedule is deleted`,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInforDoctor: saveDetailInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy,
    getPassword: getPassword,
    changePassword: changePassword,
    handleDeleteSchedule: handleDeleteSchedule,
    cancelMedicalAppointment: cancelMedicalAppointment,
};
