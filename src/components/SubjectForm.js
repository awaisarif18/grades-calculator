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
        sx={{mt: 1}}
        variant="outlined"
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
        fullWidth
        className="mb-2"
      />
      <TextField
        label="Credit Hours"
        sx={{mt: 1}}
        type="number"
        variant="outlined"
        value={creditHours}
        onChange={(e) => setCreditHours(e.target.value)}
        fullWidth
        className="mb-2"
      />
      <TextField
        label="GPA"
        sx={{mt: 1}}
        type="number"
        step="0.01"
        variant="outlined"
        value={gpa}
        onChange={(e) => setGpa(e.target.value)}
        fullWidth
        className="mb-2"
      />
      <Button variant="contained"             
      sx={{   background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              px: 2,
              py: 1,
              mt: 1,
              transition: '0.3s ease',
              '&:hover': {
                background: 'rgba(255,255,255,0.4)',
                color: '#1d2b64',
              },
            }}
            onClick={addSubject}
            color="primary">
        Add Subject
      </Button>
    </div>
  );
};

export default SubjectForm;
