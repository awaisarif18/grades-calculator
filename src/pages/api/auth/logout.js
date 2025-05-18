// pages/api/auth/logout.js
import { auth } from '../../../src/lib/firebase';
import { signOut } from 'firebase/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    await signOut(auth);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.code || err.message });
  }
}
