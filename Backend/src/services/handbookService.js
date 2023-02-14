const db = require("../models");

let createHandBook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                await db.HandBook.create({
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

let getAllHandBook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.HandBook.findAll({});
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

let getDetailHandBookById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                let data = await db.HandBook.findOne({
                    where: {
                        id: inputId,
                    },
                });
                if (data && data.image) {
                    data.image = Buffer.from(data.image, "base64").toString("binary");
                }
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

let deleteHandBookById = (handBookId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let handBook = await db.HandBook.findOne({
                where: { id: handBookId },
            });
            if (!handBook) {
                resolve({
                    errCode: 2,
                    errMessage: `The hand book doesn't exist!`,
                });
            }
            await db.HandBook.destroy({
                where: { id: handBookId },
            });
            resolve({
                errCode: 0,
                message: `Xóa cẩm nang thành công!`,
            });
        } catch (e) {
            reject(e);
        }
    });
};

let updateHandBookById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data.name);
            if (!data.name || !data.descriptionHTML) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            }
            let handBook = await db.HandBook.findOne({
                raw: false,
                where: { id: data.id },
            });
            if (handBook) {
                handBook.name = data.name;
                handBook.descriptionHTML = data.descriptionHTML;
                handBook.image = data.image;

                await handBook.save();

                let allHandBooks = await db.HandBook.findAll();
                resolve(allHandBooks);
            } else {
                resolve();
            }
            await db.HandBook.update({});
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createHandBook,
    getAllHandBook,
    getDetailHandBookById,
    deleteHandBookById,
    updateHandBookById,
};
