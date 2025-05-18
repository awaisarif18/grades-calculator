// pages/api/auth/signup.js
import { auth } from '../../../src/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { email, password } = req.body;
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    return res.status(200).json({ uid: userCred.user.uid, email: userCred.user.email });
  } catch (err) {
    return res.status(400).json({ error: err.code || err.message });
  }
}
