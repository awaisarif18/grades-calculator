import { Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const SubjectList = ({ subjects, deleteSubject, editSubject }) => {
  return (
    <div className="mb-4">
      <h2 className="font-semibold">Added Subjects</h2>
      <ul>
        {subjects.map((subject, index) => (
          <li key={index} className="flex justify-between items-center mb-2">
            <span>{subject.name} - {subject.creditHours} Credits - GPA: {subject.gpa}</span>
            <div>
              <Button onClick={() => editSubject(index)} color="primary" size="small">
                <EditIcon />
              </Button>
              <Button onClick={() => deleteSubject(index)} color="secondary" size="small">
                <DeleteIcon />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubjectList;
