import React from "react";
import { useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { Icon, Button } from "semantic-ui-react";

import { Entry, PatientDetail } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue, addPatientDetail } from "../state";
import EntryDetails from "../components/Entry";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";
import { addEntry } from "../state";

const PatientDetailPage = () => {
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();
  const [{ patientDetails, diagnoses }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  const patient = patientDetails[id];

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        {
          ...values,
          healthCheckRating: Number(values.healthCheckRating),
        }
      );
      dispatch(addEntry(id, newEntry));
      closeModal();
    } catch (_e) {
      const e = _e as AxiosError;
      console.error(e.response?.data || "Unknown Error");
      setError(e.response?.data?.error || "Unknown error");
    }
  };

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
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Entry</Button>
    </div>
  );
};

export default PatientDetailPage;
