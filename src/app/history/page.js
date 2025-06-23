'use client';
import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@mui/material';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function SavedCalculationsPage() {
  const { user, loading } = useAuth();
  const [calculations, setCalculations] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchCalculations = async () => {
      if (!user) return;

      try {
        let q;

        try {
          q = query(
            collection(db, 'calculations'),
            where('userId', '==', user.uid),
            orderBy('timestamp', 'desc')
          );
        } catch (error) {
          console.warn('orderBy(timestamp) failed, using fallback query');
          q = query(
            collection(db, 'calculations'),
            where('userId', '==', user.uid)
          );
        }

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCalculations(data);
      } catch (err) {
        console.error('🔥 Error fetching history:', err);
      } finally {
        setFetching(false);
      }
    };

    if (!loading && user) {
      fetchCalculations();
    }
  }, [user, loading]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'calculations', id));
      setCalculations(prev => prev.filter(calc => calc.id !== id));
    } catch (err) {
      console.error('❌ Error deleting calculation:', err);
    }
  };

  const handleDownloadSingle = (calc, index) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Saved Calculation #${index + 1}`, 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['Field', 'Value']],
      body: [
        ['Goal CGPA', calc.goalCGPA?.toFixed(2) ?? '--'],
        ['Calculated CGPA', calc.calculatedCGPA?.toFixed(2) ?? '--'],
      ],
    });

    if (calc.subjects?.length > 0) {
      autoTable(doc, {
        head: [['Subject', 'Credit Hours', 'GPA']],
        body: calc.subjects.map(sub => [sub.name, sub.creditHours, sub.gpa]),
      });
    }

    if (calc.requiredGPAList?.length > 0) {
      autoTable(doc, {
        head: [['Remaining Subject', 'Required GPA']],
        body: calc.requiredGPAList.map(item => [item.name, item.requiredGPA.toFixed(2)]),
      });
    }

    doc.save(`Calculation_${index + 1}.pdf`);
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white" style={{ background: 'linear-gradient(to right, #1d2b64, #f8cdda)' }}>
        Loading your saved data...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1d2b64] to-[#f8cdda]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl mx-auto p-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-white text-center">📊 My Saved Calculations</h1>

        {calculations.length === 0 ? (
          <p className="text-white text-center">No saved calculations found 😶‍🌫️</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-white table-auto border-collapse">
              <thead>
                <tr className="bg-white/10">
                  <th className="border border-white/20 px-4 py-2">#</th>
                  <th className="border border-white/20 px-4 py-2">Goal CGPA</th>
                  <th className="border border-white/20 px-4 py-2">Calculated CGPA</th>
                  <th className="border border-white/20 px-4 py-2">Subjects</th>
                  <th className="border border-white/20 px-4 py-2">Remaining + Required GPA</th>
                  <th className="border border-white/20 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {calculations.map((calc, index) => (
                  <tr key={calc.id} className="hover:bg-white/10">
                    <td className="border border-white/20 px-4 py-2 text-center">{index + 1}</td>
                    <td className="border border-white/20 px-4 py-2 text-center">{calc.goalCGPA?.toFixed(2) ?? '--'}</td>
                    <td className="border border-white/20 px-4 py-2 text-center">{calc.calculatedCGPA?.toFixed(2) ?? '--'}</td>
                    <td className="border border-white/20 px-4 py-2">
                      <ul className="list-disc pl-4">
                        {calc.subjects?.map((sub, i) => (
                          <li key={i}>{sub.name} - {sub.creditHours} hrs - GPA: {sub.gpa}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="border border-white/20 px-4 py-2">
                      <ul className="list-disc pl-4">
                        {calc.requiredGPAList?.map((item, i) => (
                          <li key={i}>{item.name} - GPA: {item.requiredGPA.toFixed(2)}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="border border-white/20 px-4 py-2 text-center space-y-2">
                      <Button
                        onClick={() => handleDelete(calc.id)}
                        variant="outlined"
                        color="error"
                        size="small"
                      >
                        Delete
                      </Button>
                      <Button
                        onClick={() => handleDownloadSingle(calc, index)}
                        variant="outlined"
                        color="info"
                        size="small"
                      >
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-block px-6 py-2 border border-white/30 text-white rounded-xl hover:bg-white/20 hover:text-white transition-all duration-200 bg-white/10 backdrop-blur-md"
          >
            ⬅ Return to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
