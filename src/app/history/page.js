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

  if (loading || fetching) {
    return (
      <div
        className="min-h-screen flex justify-center items-center text-white"
        style={{ background: 'linear-gradient(to right, #1d2b64, #f8cdda)' }}
      >
        Loading your saved data...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(to right, #1d2b64, #f8cdda)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4 text-white"
      >
        <h1 className="text-2xl font-bold mb-6">📊 My Saved Calculations</h1>

        {calculations.length === 0 ? (
          <p>No saved calculations found 😶‍🌫️</p>
        ) : (
          <div className="grid gap-4">
            {calculations.map((calc, index) => (
              <div
                key={calc.id}
                className=" backdrop-blur-md p-4 rounded-md shadow-md border border-white/20"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">
                    Calculation #{index + 1}
                  </h2>
                  <button
                    onClick={() => handleDelete(calc.id)}
                    className="text-sm text-red-300 hover:text-red-500 border border-red-300 hover:border-red-500 px-2 py-1 rounded transition-all duration-150"
                  >
                    🗑️ Delete
                  </button>
                </div>

                <p>
                  <strong>Goal CGPA:</strong>{' '}
                  {calc.goalCGPA?.toFixed(2) ?? '--'}
                </p>
                <p>
                  <strong>Calculated CGPA:</strong>{' '}
                  {calc.calculatedCGPA?.toFixed(2) ?? '--'}
                </p>

                {calc.subjects?.length > 0 && (
                  <>
                    <p className="mt-2 font-semibold">Subjects:</p>
                    <ul className="list-disc pl-6">
                      {calc.subjects.map((sub, i) => (
                        <li key={i}>
                          {sub.name} - {sub.creditHours} hrs - GPA: {sub.gpa}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {calc.requiredGPAList?.length > 0 && (
                  <>
                    <p className="mt-2 font-semibold">
                      Remaining Subjects + Required GPA:
                    </p>
                    <ul className="list-disc pl-6">
                      {calc.requiredGPAList.map((item, i) => (
                        <li key={i}>
                          {item.name} - Required GPA:{' '}
                          {item.requiredGPA.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <Link
          href="/"
          className="mt-8 inline-block text-white underline hover:text-blue-200"
        >
          ⬅️ Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
