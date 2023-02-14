import axios from "../axios";

const handleLoginApi = (userEmail, userPassword) => {
  return axios.post(`/api/login`, { email: userEmail, password: userPassword });
};

const forgotPassword = (email) => {
  return axios.post(`/api/forgot-password`, email);
};

const getAllUsers = (inputId) => {
  return axios.get(`/api/get-all-users?id=${inputId}`);
};

const createNewUserService = (data) => {
  return axios.post(`/api/create-new-user`, data);
};

const deleteUserService = (userId) => {
  return axios.delete(`/api/delete-user`, {
    data: {
      id: userId,
    },
  });
};

const editUserService = (inputData) => {
  return axios.put(`/api/edit-user`, inputData);
};

const getAllCodeService = (inputType) => {
  return axios.get(`/api/allcode?type=${inputType}`);
};

const getTopDoctorHomeService = (limit) => {
  return axios.get(`/api/top-doctor-home?limit=${limit}`);
};

const getAllDoctors = () => {
  return axios.get(`/api/get-all-doctors`);
};

const saveDetailDoctorService = (data) => {
  return axios.post("/api/save-infor-doctors", data);
};

const getProfileDoctorById = (doctorId) => {
  return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
};

const postPatientBookingAppointment = (data) => {
  return axios.post(`/api/patient-book-appointment`, data);
};

const postVerifyBookingAppointment = (data) => {
  return axios.post(`/api/verify-booking-appointment`, data);
};

const postVerifyResetPassword = (data) => {
  return axios.post(`/api/verify-reset-password`, data);
};

const createNewSpecialty = (data) => {
  return axios.post(`/api/create-new-specialty`, data);
};

const getAllSpecialty = () => {
  return axios.get(`/api/get-specialty`);
};

// Clinic api

const getAllClinic = () => {
  return axios.get(`/api/get-clinic`);
};

const getDetailSpecialtyById = (data) => {
  return axios.get(
    `/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`
  );
};

const getAllDetailClinicById = (data) => {
  return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`);
};

const deleteClinicById = (clinicId) => {
  const url = `/api/delete-clinic-by-id/${clinicId}`;
  return axios.delete(url);
};

const updateClinicById = (data) => {
  const url = `/api/update-clinic-by-id`;
  return axios.put(url, data);
};

const getDetailInforDoctor = (inputId) => {
  return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`);
};

const saveBulkScheduleDoctor = (data) => {
  return axios.post("/api/bulk-create-schedule", data);
};

const getScheduleDoctorByDate = (doctorId, date) => {
  return axios.get(
    `/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`
  );
};

const deleteScheduleSelected = (userId, currentDate, timeType) => {
  return axios.delete(`/api/delete-schedule-selected`, {
    data: {
      doctorId: userId,
      date: currentDate,
      timeType: timeType,
    },
  });
};

const getExtraInforDoctorById = (doctorId) => {
  return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`);
};

const createNewClinic = (data) => {
  return axios.post("/api/create-new-clinic", data);
};

const getAllPatientForDoctor = (data) => {
  return axios.get(
    `/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`
  );
};

const getAllPatientForHistory = (data) => {
  return axios.get(
    `/api/get-list-history-patient?doctorId=${data.doctorId}&date=${data.date}`
  );
};

const postSendRemedy = (data) => {
  return axios.post("/api/send-remedy", data);
};

const getPassword = (userId) => {
  return axios.get(`/api/get-password?id=${userId}`);
};
const createNewHandBook = (data) => {
  return axios.post("/api/create-new-handbook", data);
};

const getAllHandBook = () => {
  return axios.get("/api/get-handbook");
};

const getHandBookById = (handBookId) => {
  return axios.get("/api/get-detail-handbook-by-id", {
    params: { id: handBookId },
  });
};

const deleteHandBookById = (handBookId) => {
  const url = `/api/delete-handbook-by-id/${handBookId}`;
  return axios.delete(url);
};

const updateHandBookById = (data) => {
  const url = `/api/update-handbook-by-id`;
  return axios.put(url, data);
};

const deleteSpecialtyById = (specialtyId) => {
  const url = `/api/delete-specialty-by-id/${specialtyId}`;
  return axios.delete(url);
};

const updateSpecialtyById = (data) => {
  const url = `/api/update-specialty-by-id`;
  return axios.put(url, data);
};

const changePassword = (data) => {
  return axios.post("/api/change-password", data);
};

const getAllDetailSpecialtyById = (data) => {
  return axios.get(
    `/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`
  );
};
const postCancelMedicalAppointment = (data) => {
  return axios.post("/api/cancel-medical-appointment", data);
};

const getDetailSpecialtyByIdAndLocation = (data) => {
  return axios.get(
    `/api/get-detail-clinic-by-id-and-location?id=${data.id}&location=${data.location}`
  );
};

export {
  handleLoginApi,
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
  getAllCodeService,
  getTopDoctorHomeService,
  getAllDoctors,
  saveDetailDoctorService,
  getDetailInforDoctor,
  saveBulkScheduleDoctor,
  getScheduleDoctorByDate,
  getExtraInforDoctorById,
  getProfileDoctorById,
  postPatientBookingAppointment,
  postVerifyBookingAppointment,
  createNewSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
  createNewClinic,
  getAllClinic,
  getAllDetailClinicById,
  getAllPatientForDoctor,
  postSendRemedy,
  getPassword,
  createNewHandBook,
  getAllHandBook,
  getHandBookById,
  deleteHandBookById,
  updateHandBookById,
  deleteSpecialtyById,
  updateSpecialtyById,
  deleteClinicById,
  updateClinicById,
  getAllDetailSpecialtyById,
  changePassword,
  deleteScheduleSelected,
  getAllPatientForHistory,
  postCancelMedicalAppointment,
  forgotPassword,
  postVerifyResetPassword,
  getDetailSpecialtyByIdAndLocation,
};
