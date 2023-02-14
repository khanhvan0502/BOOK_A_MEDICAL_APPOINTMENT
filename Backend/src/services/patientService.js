import db from "../models/index";
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";

require("dotenv").config();

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?doctorId=${doctorId}&token=${token}`;

    return result;
};

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let token = uuidv4();
            console.log(data);
            if (
                !data.email ||
                !data.doctorId ||
                !data.timeType ||
                !data.date ||
                !data.fullName ||
                !data.selectedGender ||
                !data.address ||
                !data.birthday
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token),
                });
                var lastName = data.fullName.split(" ").slice(0, -1).join(" ");
                var firstName = data.fullName.split(" ").slice(-1).join(" ");

                let user = await db.User.findOne({ where: { email: data.email } });
                if (!user) {
                    user = await db.User.create({
                        email: data.email,
                        roleId: "R3",
                        address: data.address,
                        phonenumber: data.phoneNumber,
                        gender: data.selectedGender,
                        firstName: firstName,
                        lastName: lastName,
                        birthday: data.birthday,
                    });
                } else {
                    await db.User.update(
                        {
                            address: data.address,
                            phonenumber: data.phoneNumber,
                            gender: data.selectedGender,
                            firstName: firstName,
                            lastName: lastName,
                            birthday: data.birthday,
                        },
                        {
                            where: {
                                email: data.email,
                            },
                        }
                    );
                }
                if (user) {
                    await db.Booking.findOrCreate({
                        where: {
                            patientId: user.id,
                            doctorId: data.doctorId,
                            timeType: data.timeType,
                            date: data.date,
                        },
                        defaults: {
                            statusId: "S1",
                            doctorId: data.doctorId,
                            patientId: user.id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token,
                            reason: data.reason,
                        },
                    });
                }

                resolve({
                    errCode: 0,
                    errMessage: "Save info patient successfully",
                });
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};

let postverifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        token: data.token,
                        doctorId: data.doctorId,
                        statusId: "S1",
                    },
                    raw: false,
                });

                if (appointment) {
                    appointment.statusId = "S2";
                    await appointment.save();
                    let schedule = await db.Schedule.findOne({
                        where: {
                            timeType: appointment.timeType,
                            doctorId: appointment.doctorId,
                        },
                        raw: false,
                    });
                    let currentNumber = schedule.currentNumber ? schedule.currentNumber : 0;
                    schedule.currentNumber = currentNumber + 1;
                    await schedule.save();
                    resolve({
                        errCode: 0,
                        errMessage: "Update appointment successfully",
                    });
                } else {
                    resolve({
                        errCode: -1,
                        errMessage: "Appointment has been activated or does not exist",
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    postBookAppointment: postBookAppointment,
    postverifyBookAppointment: postverifyBookAppointment,
};
