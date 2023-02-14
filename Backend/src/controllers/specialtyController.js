import specialtyService from "../services/specialtyService";

let createSpecialty = async (req, res) => {
  try {
    let infor = await specialtyService.createSpecialty(req.body);
    return res.status(200).json(infor);
  } catch (err) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getAllSpecialty = async (req, res) => {
  try {
    let infor = await specialtyService.getAllSpecialty();
    return res.status(200).json(infor);
  } catch (err) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getDetailSpecialtyById = async (req, res) => {
  try {
    let infor = await specialtyService.getDetailSpecialtyById(
      req.query.id,
      req.query.location
    );
    return res.status(200).json(infor);
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let deleteSpecialtyById = async (req, res) => {
  const { specialtyId } = req.params;
  try {
    const result = await specialtyService.deleteSpecialtyById(specialtyId);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send("????");
  }
};

let updateSpecialtyById = async (req, res) => {
  try {
    const result = await specialtyService.updateSpecialtyById(req.body);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  createSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
  deleteSpecialtyById,
  updateSpecialtyById,
};
