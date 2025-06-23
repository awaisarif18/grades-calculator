// pages/api/gpa.js
// Stub for CRUD’ing saved GPA entries in Firestore
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  const col = collection(db, "gpaRecords");
  if (req.method === "GET") {
    const snapshot = await getDocs(col);
    const records = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.status(200).json(records);
  }
  if (req.method === "POST") {
    const data = req.body; // expect { semester, subjects: [...] }
    const docRef = await addDoc(col, data);
    return res.status(201).json({ id: docRef.id });
  }
  return res.status(405).json({ error: "Only GET & POST allowed" });
}
