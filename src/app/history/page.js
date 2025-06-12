'use client';
import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
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
        console.log('Fetching for UID:', user.uid);

        let q;

        try {
          // Try fetching with timestamp
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
        console.log('Fetched docs:', snapshot.docs.length);

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log('Parsed data:', data);
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

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white" style={{ background: 'linear-gradient(to right, #1d2b64, #f8cdda)' }}>
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#fff',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#fff',
                    },
                  },
                }}
                key={calc.id}
                className="bg-opacity-10 backdrop-blur-md p-4 rounded-md shadow-md border border-white/20"
              >
                <h2 className="text-lg font-semibold">
                  Calculation #{index + 1}
                </h2>
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
