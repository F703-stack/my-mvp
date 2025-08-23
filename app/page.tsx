'use client';

import { writeTestData, readTestData } from "../lib/firestoreTest";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    writeTestData();
    readTestData();
  }, []);
  return (
    <main>
      <h1>Firestore Test</h1>
    </main>
  );
}