'use client';
import React, { useState, useEffect } from 'react';
import SubjectForm from '../../components/SubjectForm';
import SubjectList from '../../components/SubjectList';
import GPAResult from '../../components/GPAResult';
import GoalForm from '../../components/GoalForm';
import { Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
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
          <FormControl fullWidth className="mb-4 bg-white rounded-md">
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

        <SubjectList subjects={subjects} deleteSubject={deleteSubject} editSubject={editSubject} />

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
          <Button
            onClick={addRemainingSubject}
            sx={{
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              px: 2,
              py: 1,
              mt: -0.5,
              transition: '0.3s ease',
              '&:hover': {
                background: 'rgba(255,255,255,0.4)',
                color: '#1d2b64',
              },
            }}
          >
            Add Remaining Subject
          </Button>
        </div>

        <div className="mb-4 text-white">
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

        <div className="flex flex-wrap gap-4">
          <Button
            onClick={calculateRequiredGPA}
            sx={{
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              px: 3,
              py: 1.2,
              fontWeight: 'bold',
              transition: '0.3s ease',
              '&:hover': {
                background: 'rgba(255,255,255,0.4)',
                color: '#1d2b64',
              },
            }}
          >
            Calculate Required GPA
          </Button>

          <Button
            onClick={saveCalculation}
            sx={{
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              px: 3,
              py: 1.2,
              fontWeight: 'bold',
              transition: '0.3s ease',
              '&:hover': {
                background: 'rgba(255,255,255,0.4)',
                color: '#1d2b64',
              },
            }}
          >
            Save This Calculation
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
