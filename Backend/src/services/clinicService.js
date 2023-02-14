const db = require("../models");

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.imageBase64 || !data.descriptionHTML) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing paramater",
                });
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                });
                resolve({
                    errCode: 0,
                    errMessage: "Ok",
                });
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({});
            if (data && data.length > 0) {
                data.map((item) => {
                    item.image = Buffer.from(item.image, "Base64").toString("binary");
                    return item;
                });
            }
            resolve({
                errMessage: "Ok",
                errCode: 0,
                data,
            });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};

let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                let data = await db.Clinic.findOne({
                    where: {
                        id: inputId,
                    },
                });

                if (data) {
                    if (data && data.image) {
                        data.image = Buffer.from(data.image, "base64").toString("binary");
                    }
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: { clinicId: inputId },
                        attributes: ["doctorId", "provinceId"],
                    });
                    data.doctorClinic = doctorClinic;
                } else data = {};

                resolve({
                    errCode: 0,
                    errMessage: "OK",
                    data,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let deleteClinicById = (clinicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinic = await db.Clinic.findOne({
                where: { id: clinicId },
            });
            if (!clinic) {
                resolve({
                    errCode: 2,
                    errMessage: `The specialty doesn't exist!`,
                });
            }

            let doctors = await db.Doctor_Infor.findAll({
                where: { clinicId: clinicId },
            });
            if (doctors && doctors.length > 0) {
                resolve({
                    errCode: 1,
                    message: `Phòng khám hiện đang tồn tại bác sĩ!`,
                });
            } else {
                await db.Clinic.destroy({
                    where: { id: clinicId },
                });
                resolve({
                    errCode: 0,
                    message: `Xóa phòng khám thành công!`,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let updateClinicById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.descriptionHTML) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing paramater",
                });
            }
            let clinic = await db.Clinic.findOne({
                raw: false,
                where: { id: data.id },
            });
            if (clinic) {
                clinic.name = data.name;
                clinic.descriptionHTML = data.descriptionHTML;
                clinic.image = data.image;
                clinic.address = data.address;

                await clinic.save();

                let allClinics = await db.Clinic.findAll();
                resolve(allClinics);
            } else {
                resolve();
            }
            await db.Clinic.update({});
        } catch (e) {
            console.log(e);
        }
    });
};

module.exports = {
    createClinic,
    getAllClinic,
    getDetailClinicById,
    deleteClinicById,
    updateClinicById,
};
