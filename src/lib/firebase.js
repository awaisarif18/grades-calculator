import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADRaQ4v1paMacXkBPayIgO5Jv3HhpkeIU",
  authDomain: "grade-calculator-3e769.firebaseapp.com",
  databaseURL: "https://grade-calculator-3e769-default-rtdb.firebaseio.com",
  projectId: "grade-calculator-3e769",
  storageBucket: "grade-calculator-3e769.appspot.com",
  messagingSenderId: "451745310137",
  appId: "1:451745310137:web:b21ec4da26f23ccfafc268",
  measurementId: "G-2ZSKZ093FJ"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];const auth = getAuth(app);
const db = getFirestore(app); // 🔥 Add Firestore instance

export { app, auth, db }; // 👈 Export Firestore
