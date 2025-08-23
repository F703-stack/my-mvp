// Firebase imports - commented out since test functions are disabled
// import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
// import { db } from "./firebaseConfig";

// Test functions - commented out for production
/*
export async function writeTestData() {
  try {
    const docRef = await addDoc(collection(db, "testCollection"), {
      message: "Hello from Devcanva!",
      timestamp: Timestamp.fromDate(new Date()),
    });
    console.log("Document written with ID:", docRef.id);
  } catch (e) {
    console.error("Error adding document:", e);
  }
}

export async function readTestData() {
  try {
    const querySnapshot = await getDocs(collection(db, "testCollection"));
    querySnapshot.forEach((doc) => {
      console.log(`Doc ID: ${doc.id}", Data:`, doc.data());
    });
  } catch (e) {
    console.error("Error reading documents:", e);
  }
}
*/

// Placeholder exports to prevent import errors
export async function writeTestData() {
  console.log("Test function disabled in production");
}

export async function readTestData() {
  console.log("Test function disabled in production");
} 