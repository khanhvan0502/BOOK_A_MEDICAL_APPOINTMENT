import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import DOCTOR_DEFAULT from "../../assets/images/doctor-default.jpg";
import { LANGUAGES } from "../../utils";
import "./SearchResult.scss";

function SearchResult({ data: { clinics, doctors, specialties, language } }) {
  function handleImageError(e) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = DOCTOR_DEFAULT;
  }
  function handleDoctorName(doctor) {
    let nameVi = "";
    let nameEn = "";
    if (doctor && doctor.positionData) {
      nameVi = `${doctor.positionData.valueVi}, ${doctor.lastName} ${doctor.firstName} `;
      nameEn = `${
        doctor.positionData.valueEn !== "None"
          ? doctor.positionData.valueEn + ","
          : ""
      } ${doctor.firstName} ${doctor.lastName} `;
    }
    return language === LANGUAGES.VI ? nameVi : nameEn;
  }

  return (
    <div className="search-result">
      <div className="result-container">
        <div className="result-title p-1">
          <FormattedMessage id="homeheader.speciality" />
        </div>
        <div className="result-content">
          {specialties.map((specialty) => (
            <Link
              to={`detail-specialty/${specialty.id}`}
              key={specialty.id}
              className="item d-flex p-1"
            >
              <img src={specialty.image} alt="" className="image" />
              <div className="name">{specialty.name}</div>
            </Link>
          ))}
        </div>
      </div>
      <div className="result-container">
        <div className="result-title p-1">
          <FormattedMessage id="homeheader.doctor" />
        </div>
        <div className="result-content">
          {doctors.map((doctor) => (
            <Link
              to={`detail-doctor/${doctor.id}`}
              key={doctor.id}
              className="item d-flex p-1"
            >
              <img
                src={doctor.image ?? ""}
                alt=""
                className="image"
                onError={handleImageError}
              />
              <div className="name">{handleDoctorName(doctor)}</div>
            </Link>
          ))}
        </div>
      </div>
      <div className="result-container">
        <div className="result-title p-1">
          <FormattedMessage id="homeheader.clinic" />
        </div>
        <div className="result-content">
          {clinics.map((clinic) => (
            <Link
              to={`detail-clinic/${clinic.id}`}
              key={clinic.id}
              className="item d-flex p-1"
            >
              <img src={clinic.image} alt="" className="image" />
              <div className="name">{clinic.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchResult;
