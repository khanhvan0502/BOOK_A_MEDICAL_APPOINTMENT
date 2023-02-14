require("dotenv").config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Dotor Care 👻" <doctorcare@gmail.com>',
        to: dataSend.receiverEmail,
        subject: getTitle(dataSend.language),
        html: getBodyHTMLEmail(dataSend),
    });
};

let getTitle = (language) => {
    return language === "en"
        ? "Information to book a medical appointment"
        : "Thông tin đặt lịch khám bệnh";
};

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = "";
    if (dataSend.language === "vi") {
        result = `
        <h4>Xin chào ${dataSend.patientName}</h4>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên website Doctor Care thành công </p>
        <p>Thông tin đơn thuốc / hóa đơn được gửi trong file đính kèm</p>
        <p>Xin chân thành cảm ơn</p>
    `;
    } else if (dataSend.language === "en") {
        result = `
        <h4>Hello ${dataSend.patientName}</h4>
        <p>You received this email because you booked an online medical appointment on the Doctor Care website</p>
        <p>Thank you and best regard</p>
    `;
    }
};

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            });

            let info = await transporter.sendMail({
                from: '"Dotor Care 👻" <doctorcare@gmail.com>',
                to: dataSend.email,
                subject: "Kết quả đặt lịch khám bệnh",
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments: [
                    {
                        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: "base64",
                    },
                ],
            });
            resolve(true);
        } catch (e) {
            reject(e);
        }
    });
};

let sendForgotPasswordEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Dotor Care 👻" <doctorcare@gmail.com>',
        to: dataSend.receiverEmail,
        subject: "Yêu cầu thay đổi mật khẩu DoctorCare",
        html: `
        <h4>Xin chào ${dataSend.username}</h4>
        <div></div>
        <p>Bạn nhận được email này vì bạn đã yêu cầu thay đổi mật khẩu trên website Doctor Care </p>
        <p>Nếu bạn đúng là đã yêu cầu thay đổi mật khẩu, vui lòng nhấn vào đường link bên dưới
            để thay đổi mật khẩu.</p>
        <div>
        <a href="${dataSend.redirectLink}" target="_blank">Nhấn vào đây</a>
        <div></div>
        <p>Xin chân thành cảm ơn</p>
        </div>
        `,
    });
};

let getBodyHTMLEmail = (dataSend) => {
    let result = "";
    if (dataSend.language === "vi") {
        result = `
        <h4>Xin chào ${dataSend.patientName}</h4>
        <div></div>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên website Doctor Care </p>
        <p>Thông tin đặt lịch khám bệnh</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Nếu các thông tin trên là đúng sự thật, vui lòng nhấn vào đường link bên dưới
            để xác nhận và hoàn tất thủ tục khám bệnh.</p>
        <div>
        <a href="${dataSend.redirectLink}" target="_blank">Nhấn vào đây</a>
        <div></div>
        <p>Xin chân thành cảm ơn</p>
        </div>
    `;
    } else if (dataSend.language === "en") {
        result = `
        <h4>Hello ${dataSend.patientName}</h4>
        <p>You received this email because you booked an online medical appointment on the Doctor Care website</p>
        <p>Information to book a medical appointment</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor's name: ${dataSend.doctorName}</b></div>
        <p> If the above information is true, please click the link below
            to confirm and complete the medical examination.</p>
        <div>
        <a href="${dataSend.redirectLink}" target="_blank">Click here</a>
        <div></div>
        <p>Thank you and best regard</p>
        </div>
    `;
    }

    return result;
};

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment,
    sendForgotPasswordEmail: sendForgotPasswordEmail,
};
