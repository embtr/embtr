import { Firestore, getFirestore } from 'firebase/firestore';
import firebaseApp from 'src/firebase/Firebase';

export const getFirebaseConnection = (className: string, methodName: string) => {
    const db: Firestore = getFirestore(firebaseApp);
    return db;
};
