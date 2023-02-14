const db = require("../models");

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                });

                resolve({
                    errCode: 0,
                    errMessage: "OK",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({});
            if (data && data.length > 0) {
                data.map((item) => {
                    item.image = Buffer.from(item.image, "base64").toString("binary");
                    return item;
                });
            }
            resolve({
                errCode: 0,
                errMessage: "OK",
                data,
            });
        } catch (e) {
            reject(e);
        }
    });
};

let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId,
                    },
                });

                if (data) {
                    if (data && data.image) {
                        data.image = Buffer.from(data.image, "base64").toString("binary");
                    }
                    let doctorSpecialty = [];
                    if (location === "ALL") {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: inputId },
                            attributes: ["doctorId", "provinceId"],
                        });
                    } else {
                        //find by location
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location,
                            },
                            attributes: ["doctorId", "provinceId"],
                        });
                    }

                    data.doctorSpecialty = doctorSpecialty;
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

let deleteSpecialtyById = (specialtyId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialty = await db.Specialty.findOne({
                where: { id: specialtyId },
            });
            if (!specialty) {
                resolve({
                    errCode: 2,
                    errMessage: `The specialty doesn't exist!`,
                });
            }
            let doctors = await db.Doctor_Infor.findAll({
                where: { specialtyId: specialtyId },
            });
            if (doctors && doctors.length > 0) {
                resolve({
                    errCode: 1,
                    message: `Chuyên khoa hiện đang tồn tại bác sĩ!`,
                });
            } else {
                await db.Specialty.destroy({
                    where: { id: specialtyId },
                });
                resolve({
                    errCode: 0,
                    message: `Xóa chuyên khoa thành công!`,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let updateSpecialtyById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.descriptionHTML) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            }
            let specialty = await db.Specialty.findOne({
                raw: false,
                where: { id: data.id },
            });
            if (specialty) {
                specialty.name = data.name;
                specialty.descriptionHTML = data.descriptionHTML;
                specialty.image = data.image;

                await specialty.save();

                let allSpecialties = await db.Specialty.findAll();
                resolve(allSpecialties);
            } else {
                resolve();
            }
            await db.Specialty.update({});
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};

module.exports = {
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
    deleteSpecialtyById,
    updateSpecialtyById,
};
