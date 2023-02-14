import handbookService from "../services/handbookService";

let createHandBook = async (req, res) => {
  try {
    let infor = await handbookService.createHandBook(req.body);
    return res.status(200).json(infor);
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Có lỗi ở server!",
    });
  }
};

let getAllHandBook = async (req, res) => {
  try {
    let infor = await handbookService.getAllHandBook();
    return res.status(200).json(infor);
  } catch (err) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Có lỗi ở server!",
    });
  }
};

let getDetailHandBookById = async (req, res) => {
  try {
    let infor = await handbookService.getDetailHandBookById(req.query.id);
    return res.status(200).json(infor);
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Có lỗi ở server!",
    });
  }
};

let deleteHandBookById = async (req, res) => {
  const { handBookId } = req.params;

  try {
    const result = await handbookService.deleteHandBookById(handBookId);
    return res.status(200).send(result);
  } catch (error) {
    return res.sendStatus(500);
  }
};

let updateHandBookById = async (req, res) => {
  try {
    const result = await handbookService.updateHandBookById(req.body);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  createHandBook,
  getAllHandBook,
  getDetailHandBookById,
  deleteHandBookById,
  updateHandBookById,
};
