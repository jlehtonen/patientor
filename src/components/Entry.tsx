import React from "react";
import { Icon, Card } from "semantic-ui-react";
import { SemanticCOLORS } from "semantic-ui-react/dist/commonjs/generic";
import {
  Entry,
  HospitalEntry as HospitalEntryType,
  HealthCheckEntry as HealthCheckEntryType,
  OccupationalHealthcareEntry as OccupationalHealthcareEntryType,
  Diagnosis,
  HealthCheckRating,
} from "../types";

const getHeartColor = (healthRating: HealthCheckRating): SemanticCOLORS => {
  switch (healthRating) {
    case HealthCheckRating.Healthy:
      return "green";
    case HealthCheckRating.LowRisk:
      return "yellow";
    case HealthCheckRating.HighRisk:
      return "orange";
    case HealthCheckRating.CriticalRisk:
      return "red";
    default:
      return assertNever(healthRating);
  }
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const DiagnosisList = ({
  codes,
  diagnoses,
}: {
  codes: string[] | undefined;
  diagnoses: Record<string, Diagnosis>;
}) => {
  return (
    <ul>
      {codes
        ? codes.map(code => (
            <li key={code}>
              {code} {diagnoses[code].name}
            </li>
          ))
        : null}
    </ul>
  );
};

const HospitalEntry = ({
  entry,
  diagnoses,
}: {
  entry: HospitalEntryType;
  diagnoses: Record<string, Diagnosis>;
}) => {
  return (
    <Card>
      <Card.Content>
        <h3>
          {entry.date} <Icon name="hospital" size="large" />
        </h3>
        <div>
          <i>{entry.description}</i>
        </div>
        <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
        <div>
          <div>
            <b>Discharged on {entry.discharge.date}</b>
          </div>
          <div>
            <i>{entry.discharge.criteria}</i>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

const HealthCheckEntry = ({
  entry,
  diagnoses,
}: {
  entry: HealthCheckEntryType;
  diagnoses: Record<string, Diagnosis>;
}) => {
  return (
    <Card>
      <Card.Content>
        <h3>
          {entry.date} <Icon name="doctor" size="large" />
        </h3>
        <div>
          <i>{entry.description}</i>
        </div>
        {entry.healthCheckRating !== undefined ? (
          <div>
            <Icon name="heart" color={getHeartColor(entry.healthCheckRating)} />
          </div>
        ) : null}
        {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 ? (
          <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
        ) : null}
      </Card.Content>
    </Card>
  );
};

const OccupationalHealthcareEntry = ({
  entry,
  diagnoses,
}: {
  entry: OccupationalHealthcareEntryType;
  diagnoses: Record<string, Diagnosis>;
}) => {
  return (
    <Card>
      <Card.Content>
        <h3>
          {entry.date} <Icon name="stethoscope" size="large" /> {entry.employerName}
        </h3>
        <div>
          <i>{entry.description}</i>
        </div>
        <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
        {entry.sickLeave ? (
          <div>
            <b>
              Sick leave {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
            </b>
          </div>
        ) : null}
      </Card.Content>
    </Card>
  );
};

const EntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: Entry;
  diagnoses: Record<string, Diagnosis>;
}) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntry entry={entry} diagnoses={diagnoses} />;
    case "HealthCheck":
      return <HealthCheckEntry entry={entry} diagnoses={diagnoses} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntry entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
