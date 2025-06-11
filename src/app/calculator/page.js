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

// Firebase imports
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

export default function CalculatorPage() {
  const { user } = useAuth();

  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [creditHours, setCreditHours] = useState("");
  const [gpa, setGpa] = useState("");
  const [goalCGPA, setGoalCGPA] = useState("");
  const [remainingSubjects, setRemainingSubjects] = useState([]);
  const [requiredGPA, setRequiredGPA] = useState([]);
  const [remainingSubjectName, setRemainingSubjectName] = useState("");
  const [remainingCreditHours, setRemainingCreditHours] = useState("");

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

  const deleteSubject = (index) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(newSubjects);
  };

  const deleteRemainingSubject = (index) => {
    const newRemainingSubjects = remainingSubjects.filter((_, i) => i !== index);
    setRemainingSubjects(newRemainingSubjects);
  };

  const editSubject = (index) => {
    const subject = subjects[index];
    setSubjectName(subject.name);
    setCreditHours(subject.creditHours);
    setGpa(subject.gpa);
    deleteSubject(index);
  };

  const editRemainingSubject = (index) => {
    const subject = remainingSubjects[index];
    setRemainingSubjectName(subject.name);
    setRemainingCreditHours(subject.creditHours);
    deleteRemainingSubject(index);
  };

  const calculateCGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    subjects.forEach((subject) => {
      totalPoints += subject.gpa * subject.creditHours;
      totalCredits += subject.creditHours;
    });
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const calculateRequiredGPA = () => {
    const currentCGPA = calculateCGPA();
    const totalCredits = subjects.reduce((acc, subject) => acc + subject.creditHours, 0);
    const remainingCredits = remainingSubjects.reduce((acc, subject) => acc + subject.creditHours, 0);

    if (goalCGPA && remainingCredits > 0) {
      const requiredGPAPerSubject =
        (goalCGPA * (totalCredits + remainingCredits) - currentCGPA * totalCredits) / remainingCredits;

      const requiredGPAList = remainingSubjects.map((subject) => ({
        name: subject.name,
        requiredGPA: requiredGPAPerSubject,
      }));

      setRequiredGPA(requiredGPAList);
    } else {
      setRequiredGPA([]);
    }
  };

  const saveCalculation = async () => {
    if (!user) return alert("Login kar bhai pehle!");

    try {
            console.log({
  userId: user.uid,
  subjects,
  remainingSubjects,
  goalCGPA,
  calculatedCGPA: calculateCGPA(),
  requiredGPAList: requiredGPA,
});
      await addDoc(collection(db, "calculations"), {
        userId: user.uid,
        subjects,
        remainingSubjects,
        goalCGPA: parseFloat(goalCGPA),
        calculatedCGPA: calculateCGPA(),
        requiredGPAList: requiredGPA,
        timestamp: serverTimestamp(),
      });
      alert("Calculation saved successfully ✅");
    } catch (err) {
      console.error("Save error:", err);
      alert("Kuch garbar hogayi saving mein 💀");
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
        <Button variant="contained" onClick={addRemainingSubject} color="secondary">
          Add Remaining Subject
        </Button>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold">Remaining Subjects:</h2>
        <ul>
          {remainingSubjects.map((subject, index) => (
            <li key={index} className="flex items-center justify-between mb-2">
              <span>
                {subject.name} - {subject.creditHours} Credit Hours
              </span>
              <div className="flex">
                <Button onClick={() => editRemainingSubject(index)} color="primary" size="small">
                  <EditIcon />
                </Button>
                <Button onClick={() => deleteRemainingSubject(index)} color="secondary" size="small">
                  <DeleteIcon />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Button variant="contained" onClick={calculateRequiredGPA} color="primary">
        Calculate Required GPA
      </Button>

      <Button
        variant="outlined"
        color="success"
        onClick={saveCalculation}
        sx={{ mt: 2, ml: 2 }}
      >
        Save This Calculation
      </Button>
    </div>
  );
}
