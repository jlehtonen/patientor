import { State } from "./state";
import { Diagnosis, Entry, Patient, PatientDetail } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "ADD_PATIENT_DETAIL";
      payload: PatientDetail;
    }
  | {
      type: "SET_DIAGNOSIS_LIST";
      payload: Diagnosis[];
    }
  | {
      type: "ADD_ENTRY";
      id: string;
      payload: Entry;
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients,
        },
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case "ADD_PATIENT_DETAIL":
      return {
        ...state,
        patientDetails: {
          ...state.patientDetails,
          [action.payload.id]: action.payload,
        },
      };
    case "SET_DIAGNOSIS_LIST":
      return {
        ...state,
        diagnoses: action.payload.reduce(
          (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
          {}
        ),
      };
    case "ADD_ENTRY":
      return {
        ...state,
        patientDetails: {
          ...state.patientDetails,
          [action.id]: {
            ...state.patientDetails[action.id],
            entries: [...state.patientDetails[action.id].entries, action.payload],
          },
        },
      };
    default:
      return state;
  }
};

export const setPatientList = (patients: Patient[]): Action => {
  return {
    type: "SET_PATIENT_LIST",
    payload: patients,
  };
};

export const addPatient = (patient: Patient): Action => {
  return {
    type: "ADD_PATIENT",
    payload: patient,
  };
};

export const addPatientDetail = (patientDetail: PatientDetail): Action => {
  return {
    type: "ADD_PATIENT_DETAIL",
    payload: patientDetail,
  };
};

export const setDiagnosisList = (diagnoses: Diagnosis[]): Action => {
  return {
    type: "SET_DIAGNOSIS_LIST",
    payload: diagnoses,
  };
};

export const addEntry = (patientId: string, entry: Entry): Action => {
  return {
    type: "ADD_ENTRY",
    id: patientId,
    payload: entry,
  };
};
