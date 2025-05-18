"use client";
import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

export default function QuickCalculator() {
  const [courses, setCourses] = useState([{ credit: "", grade: "" }]);
  const [result, setResult] = useState(null);

  const addCourse = () => setCourses([...courses, { credit: "", grade: "" }]);
  const handleChange = (idx, field, value) => {
    const updated = [...courses];
    updated[idx][field] = value;
    setCourses(updated);
  };
  const calculate = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(({ credit, grade }) => {
      const c = parseFloat(credit);
      const g = parseFloat(grade);
      if (!isNaN(c) && !isNaN(g)) {
        totalCredits += c;
        totalPoints += c * g;
      }
    });
    setResult(totalCredits ? (totalPoints / totalCredits).toFixed(2) : null);
  };

  return (
    <Box>
      {courses.map((course, idx) => (
        <Box key={idx} sx={{ display: "flex", gap: 1, mb: 1 }}>
          <TextField
            label="Credit Hours"
            value={course.credit}
            onChange={(e) => handleChange(idx, "credit", e.target.value)}
          />
          <TextField
            label="Grade (GPA)"
            value={course.grade}
            onChange={(e) => handleChange(idx, "grade", e.target.value)}
          />
        </Box>
      ))}
      <Button onClick={addCourse}>Add Course</Button>
      <Button variant="contained" sx={{ ml: 2 }} onClick={calculate}>
        Calculate CGPA
      </Button>
      {result !== null && <Box sx={{ mt: 2 }}>Current CGPA: {result}</Box>}
    </Box>
  );
}
