'use client';
import React, { useState, useEffect } from 'react';
import SubjectForm from '../../components/SubjectForm';
import GoalForm from '../../components/GoalForm';
import GPAResult from '../../components/GPAResult';
import { Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export default function CalculatorPage() {
  const { user } = useAuth();

  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [creditHours, setCreditHours] = useState('');
  const [gpa, setGpa] = useState('');
  const [goalCGPA, setGoalCGPA] = useState('');
  const [remainingSubjects, setRemainingSubjects] = useState([]);
  const [requiredGPA, setRequiredGPA] = useState([]);
  const [remainingSubjectName, setRemainingSubjectName] = useState('');
  const [remainingCreditHours, setRemainingCreditHours] = useState('');
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [selectedCalcId, setSelectedCalcId] = useState('');

  useEffect(() => {
    const fetchSaved = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'calculations'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSavedCalculations(data);
      } catch (err) {
        console.error('🔥 Error fetching calculations:', err);
      }
    };

    if (user) fetchSaved();
  }, [user]);

  const loadCalculation = (calcId) => {
    const selected = savedCalculations.find(calc => calc.id === calcId);
    if (!selected) return;
    setSubjects(selected.subjects || []);
    setRemainingSubjects(selected.remainingSubjects || []);
    setGoalCGPA(selected.goalCGPA?.toString() || '');
    setRequiredGPA(selected.requiredGPAList || []);
    setSelectedCalcId(calcId);
  };

  const addSubject = () => {
    if (subjectName && creditHours && gpa) {
      const newSubject = {
        name: subjectName,
        creditHours: parseFloat(creditHours),
        gpa: parseFloat(gpa),
      };
      setSubjects([...subjects, newSubject]);
      setSubjectName('');
      setCreditHours('');
      setGpa('');
    }
  };

  const addRemainingSubject = () => {
    if (remainingSubjectName && remainingCreditHours) {
      const newRemainingSubject = {
        name: remainingSubjectName,
        creditHours: parseFloat(remainingCreditHours),
      };
      setRemainingSubjects([...remainingSubjects, newRemainingSubject]);
      setRemainingSubjectName('');
      setRemainingCreditHours('');
    }
  };

  const deleteSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const deleteRemainingSubject = (index) => {
    setRemainingSubjects(remainingSubjects.filter((_, i) => i !== index));
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
    if (!user) return alert('Login kar bhai pehle!');

    try {
      await addDoc(collection(db, 'calculations'), {
        userId: user.uid,
        subjects,
        remainingSubjects,
        goalCGPA: parseFloat(goalCGPA),
        calculatedCGPA: calculateCGPA(),
        requiredGPAList: requiredGPA,
        timestamp: serverTimestamp(),
      });
      alert('Calculation saved successfully ✅');
    } catch (err) {
      console.error('Save error:', err);
      alert('Kuch garbar hogayi saving mein 💀');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to right, #1d2b64, #f8cdda)' }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4"
      >
        <h1 className="text-2xl font-bold mb-4 text-white">Grades and CGPA Calculator</h1>

        {savedCalculations.length > 0 && (
          <FormControl fullWidth className="mb-4 rounded-md">
            <InputLabel>Select a saved calculation</InputLabel>
            <Select
              value={selectedCalcId}
              label="Select a saved calculation"
              onChange={(e) => loadCalculation(e.target.value)}
            >
              {savedCalculations.map((calc, i) => (
                <MenuItem key={calc.id} value={calc.id}>
                  Calculation #{i + 1} — Goal CGPA: {calc.goalCGPA?.toFixed(2) ?? '--'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <SubjectForm
          subjectName={subjectName}
          setSubjectName={setSubjectName}
          creditHours={creditHours}
          setCreditHours={setCreditHours}
          gpa={gpa}
          setGpa={setGpa}
          addSubject={addSubject}
        />

        {subjects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Added Subjects</h2>
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="w-full bg-linear-gradient(to right, #1d2b64, #f8cdda) bg-opacity-90 text-sm text-left">
                <thead className="text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Credit Hours</th>
                    <th className="px-4 py-3">GPA</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject, index) => (
                    <tr key={index} className="bg-linear-gradient(to right, #1d2b64, #f8cdda)  hover:bg-white/10">
                      <td className="px-4 py-2">{subject.name}</td>
                      <td className="px-4 py-2">{subject.creditHours}</td>
                      <td className="px-4 py-2">{subject.gpa}</td>
                      <td className="px-4 py-2">
                        <Button onClick={() => editSubject(index)} size="small"><EditIcon /></Button>
                        <Button onClick={() => deleteSubject(index)} size="small" color="secondary"><DeleteIcon /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <GoalForm goalCGPA={goalCGPA} setGoalCGPA={setGoalCGPA} />

        <GPAResult calculateCGPA={calculateCGPA} requiredGPA={requiredGPA} requiredGPAList={requiredGPA} />

        <div className="mb-4 text-white">
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
          <Button onClick={addRemainingSubject} variant="outlined" color="inherit">Add Remaining Subject</Button>
        </div>

        {remainingSubjects.length > 0 && (
          <div className="mb-6 text-white">
            <h2 className="font-semibold">Remaining Subjects</h2>
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="w-full  bg-opacity-90 text-sm text-left rounded-xl">
                <thead className="text-gray-700 uppercase bg-linear-gradient(to right, #1d2b64, #f8cdda) text-xs">
                  <tr>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Credit Hours</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {remainingSubjects.map((subject, index) => (
                    <tr key={index} className="bg-linear-gradient(to right, #1d2b64, #f8cdda) border-collapse hover:bg-white/10 text-black">
                      <td className="px-4 py-2">{subject.name}</td>
                      <td className="px-4 py-2">{subject.creditHours}</td>
                      <td className="px-4 py-2">
                        <Button onClick={() => editRemainingSubject(index)} size="small"><EditIcon /></Button>
                        <Button onClick={() => deleteRemainingSubject(index)} size="small" color="secondary"><DeleteIcon /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          <Button onClick={calculateRequiredGPA} variant="contained" color="primary">Calculate Required GPA</Button>
          <Button onClick={saveCalculation} variant="contained" color="secondary">Save This Calculation</Button>
        </div>
      </motion.div>
    </div>
  );
}
