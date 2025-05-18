// pages/api/auth/login.js
import { auth } from '../../../src/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { email, password } = req.body;
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    // You might set a cookie/JWT here if you want server-side sessions
    return res.status(200).json({ uid: userCred.user.uid, email: userCred.user.email });
  } catch (err) {
    return res.status(401).json({ error: err.code || err.message });
  }
}
