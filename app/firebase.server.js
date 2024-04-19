import { initializeApp, applicationDefault, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';
import serviceAccount from "../memofox-app-firebase-admin.json";

// console.log('getApps().length', getApps().length);
if (getApps().length === 0) {
    if (!serviceAccount) {
        throw new Error("Missing serviceAccountKey.json file");
    }

    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();

export { db };
