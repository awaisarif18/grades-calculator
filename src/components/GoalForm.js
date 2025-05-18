import { TextField } from "@mui/material";

const GoalForm = ({ goalCGPA, setGoalCGPA }) => {
  return (
    <div className="mb-4">
      <TextField
        label="Enter Goal CGPA"
        type="number"
        step="0.01"
        variant="outlined"
        value={goalCGPA}
        onChange={(e) => setGoalCGPA(e.target.value)}
        fullWidth
      />
    </div>
  );
};

export default GoalForm;
