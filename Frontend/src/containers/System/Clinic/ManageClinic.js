import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteClinicById, getAllClinic } from "../../../services/userService";
import "./ManageClinic.scss";
import ConfirmDeleteClinic from "./Modal/ConfirmDeleteClinic";

function DashBoardSpecialty() {
  const [clinics, setClinics] = useState([]);
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [clinicIdDelete, setClinicIdDelete] = useState("");

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await getAllClinic();
        if (res && res.errCode === 0) {
          setClinics(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchClinics();
  }, []);

  const handleDeleteClinic = (clinicId) => () => {
    setClinicIdDelete(clinicId);
    handleOpenModal();
  };

  const handleOpenModal = () => {
    setIsOpenConfirmDelete(true);
  };

  const toggleConfirmDelete = () => {
    setIsOpenConfirmDelete(!isOpenConfirmDelete);
  };

  return (
    <>
      <div className="dashboard container">
        <div className="clinic-title">
          <FormattedMessage id="manage-clinic.title" />
        </div>
        <div className="add-handbook-container">
          <Link to="/system/manage-clinic/add" className="btn btn-primary">
            <FormattedMessage id="manage-clinic.new-clinic" />
          </Link>
        </div>
        <div className="table">
          <div className="handbook-table mt-3 mx-1">
            <table id="handbooks">
              <tbody>
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">
                    <FormattedMessage id="manage-clinic.image" />
                  </th>
                  <th className="text-center">
                    <FormattedMessage id="manage-clinic.name" />
                  </th>
                  <th className="text-center">
                    <FormattedMessage id="manage-clinic.address" />
                  </th>
                  <th className="text-center">Actions</th>
                </tr>
                {clinics.map((item, index) => {
                  return (
                    <tr key={item.id}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="handbook-image"
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.address}</td>
                      <td className="text-center">
                        <Link
                          to={`/system/manage-clinic/update/${item.id}`}
                          className="btn-edit"
                        >
                          <i className="fas fa-pencil-alt"></i>
                        </Link>
                        <button
                          className="btn-delete"
                          onClick={handleDeleteClinic(item.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ConfirmDeleteClinic
        isOpenModal={isOpenConfirmDelete}
        toggleFromParent={toggleConfirmDelete}
        clinicDelete={clinicIdDelete}
        clinics={clinics}
      />
    </>
  );
}

export default DashBoardSpecialty;
