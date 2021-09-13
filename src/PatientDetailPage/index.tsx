import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Icon } from "semantic-ui-react";

import { PatientDetail } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue, addPatientDetail } from "../state";

const PatientDetailPage = () => {
  const [{ patientDetails, diagnoses }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  const patient = patientDetails[id];

  React.useEffect(() => {
    const fetchPatientDetail = async () => {
      const { data: newPatientDetail } = await axios.get<PatientDetail>(
        `${apiBaseUrl}/patients/${id}`
      );
      dispatch(addPatientDetail(newPatientDetail));
    };
    if (!patient) {
      void fetchPatientDetail();
    }
  }, [id]);

  if (!patient || Object.keys(diagnoses).length === 0) {
    return null;
  }

  return (
    <div className="App">
      <h2>
        {patient.name} <Icon name={patient.gender === "male" ? "mars" : "venus"} />
      </h2>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>
      <h3>entries</h3>
      {patient.entries.map(entry => (
        <div key={entry.id}>
          <div>
            {entry.date} {entry.description}
          </div>
          <ul>
            {entry.diagnosisCodes
              ? entry.diagnosisCodes.map(code => (
                  <li key={code}>
                    {code} {diagnoses[code].name}
                  </li>
                ))
              : null}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PatientDetailPage;
