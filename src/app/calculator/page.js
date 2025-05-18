// src/app/calculator/page.js
"use client";
import React, { useState } from "react";
import Link from "next/link";
import SubjectForm from "../../components/SubjectForm";
import SubjectList from "../../components/SubjectList";
import GPAResult from "../../components/GPAResult";
import GoalForm from "../../components/GoalForm";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CalculatorPage() {
  // ← copy all your state hooks (subjects, addSubject, etc.) here
  // ← copy all your handlers (addSubject, deleteSubject, calculateCGPA, etc.) here

  const [subjects, setSubjects] = useState([]);
    const [subjectName, setSubjectName] = useState("");
    const [creditHours, setCreditHours] = useState("");
    const [gpa, setGpa] = useState("");
    const [goalCGPA, setGoalCGPA] = useState("");
    const [remainingSubjects, setRemainingSubjects] = useState([]);
    const [requiredGPA, setRequiredGPA] = useState([]);
    const [remainingSubjectName, setRemainingSubjectName] = useState("");
    const [remainingCreditHours, setRemainingCreditHours] = useState("");
  
    // Add Completed Subject
    const addSubject = () => {
      if (subjectName && creditHours && gpa) {
        const newSubject = {
          name: subjectName,
          creditHours: parseFloat(creditHours),
          gpa: parseFloat(gpa),
        };
        setSubjects([...subjects, newSubject]);
        setSubjectName("");
        setCreditHours("");
        setGpa("");
      }
    };
  
    // Add Remaining Subject
    const addRemainingSubject = () => {
      if (remainingSubjectName && remainingCreditHours) {
        const newRemainingSubject = {
          name: remainingSubjectName,
          creditHours: parseFloat(remainingCreditHours),
        };
        setRemainingSubjects([...remainingSubjects, newRemainingSubject]);
        setRemainingSubjectName("");
        setRemainingCreditHours("");
      }
    };
  
    // Delete a Completed Subject
    const deleteSubject = (index) => {
      const newSubjects = subjects.filter((_, i) => i !== index);
      setSubjects(newSubjects);
    };
  
    // Delete a Remaining Subject
    const deleteRemainingSubject = (index) => {
      const newRemainingSubjects = remainingSubjects.filter((_, i) => i !== index);
      setRemainingSubjects(newRemainingSubjects);
    };
  
    // Edit Completed Subject
    const editSubject = (index) => {
      const subject = subjects[index];
      setSubjectName(subject.name);
      setCreditHours(subject.creditHours);
      setGpa(subject.gpa);
      deleteSubject(index); // Temporarily delete and then re-add the updated subject
    };
  
    // Edit Remaining Subject
    const editRemainingSubject = (index) => {
      const subject = remainingSubjects[index];
      setRemainingSubjectName(subject.name);
      setRemainingCreditHours(subject.creditHours);
      deleteRemainingSubject(index); // Temporarily delete and then re-add the updated subject
    };
  
    // Calculate CGPA
    const calculateCGPA = () => {
      let totalPoints = 0;
      let totalCredits = 0;
      subjects.forEach((subject) => {
        totalPoints += subject.gpa * subject.creditHours;
        totalCredits += subject.creditHours;
      });
      return totalPoints / totalCredits;
    };
  
    // Calculate Required GPA for Remaining Subjects
    const calculateRequiredGPA = () => {
      const currentCGPA = calculateCGPA();
      const totalCredits = subjects.reduce(
        (acc, subject) => acc + subject.creditHours,
        0
      );
      const remainingCredits = remainingSubjects.reduce(
        (acc, subject) => acc + subject.creditHours,
        0
      );
  
      if (goalCGPA && remainingCredits > 0) {
        const requiredGPAPerSubject =
          (goalCGPA * (totalCredits + remainingCredits) -
            currentCGPA * totalCredits) /
          remainingCredits;
        
        // Map the required GPA for each remaining subject and include their names
        const requiredGPAList = remainingSubjects.map((subject) => ({
          name: subject.name, // Include the subject name
          requiredGPA: requiredGPAPerSubject, // Assign the calculated required GPA
        }));
        
        setRequiredGPA(requiredGPAList);
      } else {
        setRequiredGPA([]);
      }
    };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Grades and CGPA Calculator</h1>

      <SubjectForm
        subjectName={subjectName}
        setSubjectName={setSubjectName}
        creditHours={creditHours}
        setCreditHours={setCreditHours}
        gpa={gpa}
        setGpa={setGpa}
        addSubject={addSubject}
      />

      <SubjectList
        subjects={subjects}
        deleteSubject={deleteSubject}
        editSubject={editSubject}
      />

      <GoalForm goalCGPA={goalCGPA} setGoalCGPA={setGoalCGPA} />

      <GPAResult
        calculateCGPA={calculateCGPA}
        requiredGPA={requiredGPA}
        requiredGPAList={requiredGPA}
      />

      {/* Remaining Subject Form */}
      <div className="mb-4">
        <h2 className="font-semibold">Remaining Subjects</h2>
        <input
          type="text"
          placeholder="Remaining Subject Name"
          value={remainingSubjectName}
          onChange={(e) => setRemainingSubjectName(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Remaining Credit Hours"
          value={remainingCreditHours}
          onChange={(e) => setRemainingCreditHours(e.target.value)}
          className="border p-2 mr-2"
        />
        <Button
          variant="contained"
          onClick={addRemainingSubject}
          color="secondary"
        >
          Add Remaining Subject
        </Button>
      </div>

      {/* Display Remaining Subjects Dynamically with Edit/Delete buttons */}
      <div className="mb-4">
        <h2 className="font-semibold">Remaining Subjects:</h2>
        <ul>
          {remainingSubjects.map((subject, index) => (
            <li key={index} className="flex items-center justify-between mb-2">
              <span>
                {subject.name} - {subject.creditHours} Credit Hours
              </span>
              <div className="flex">
                <Button
                  onClick={() => editRemainingSubject(index)}
                  color="primary"
                  size="small"
                >
                  <EditIcon />
                </Button>
                <Button
                  onClick={() => deleteRemainingSubject(index)}
                  color="secondary"
                  size="small"
                >
                  <DeleteIcon />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Button to calculate required GPA */}
      <Button
        variant="contained"
        onClick={calculateRequiredGPA}
        color="primary"
      >
        Calculate Required GPA
      </Button>
    </div>
  );
}
