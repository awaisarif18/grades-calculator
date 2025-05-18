import { TextField, Button } from "@mui/material";

const SubjectForm = ({
  subjectName,
  setSubjectName,
  creditHours,
  setCreditHours,
  gpa,
  setGpa,
  addSubject,
}) => {
  return (
    <div className="mb-4">
      <TextField
        label="Subject Name"
        variant="outlined"
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
        fullWidth
        className="mb-2"
      />
      <TextField
        label="Credit Hours"
        type="number"
        variant="outlined"
        value={creditHours}
        onChange={(e) => setCreditHours(e.target.value)}
        fullWidth
        className="mb-2"
      />
      <TextField
        label="GPA"
        type="number"
        step="0.01"
        variant="outlined"
        value={gpa}
        onChange={(e) => setGpa(e.target.value)}
        fullWidth
        className="mb-2"
      />
      <Button variant="contained" onClick={addSubject} color="primary">
        Add Subject
      </Button>
    </div>
  );
};

export default SubjectForm;
