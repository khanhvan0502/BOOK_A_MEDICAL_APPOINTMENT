import clinicService from "../services/clinicService";

let createClinic = async (req, res) => {
  try {
    let infor = await clinicService.createClinic(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getAllClinic = async (req, res) => {
  try {
    let infor = await clinicService.getAllClinic();
    return res.status(200).json(infor);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getDetailClinicById = async (req, res) => {
  try {
    let infor = await clinicService.getDetailClinicById(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let deleteClinicById = async (req, res) => {
  const { clinicId } = req.params;

  try {
    const result = await clinicService.deleteClinicById(clinicId);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send("????");
  }
};

let updateClinicById = async (req, res) => {
  try {
    const result = await clinicService.updateClinicById(req.body);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  createClinic,
  getAllClinic,
  getDetailClinicById,
  deleteClinicById,
  updateClinicById,
};
