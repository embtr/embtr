import { Firestore, getFirestore } from 'firebase/firestore';
import firebaseApp from 'src/firebase/Firebase';

export const getFirebaseConnection = (className: string, methodName: string) => {
    //console.log("providing connection for " + className + "." + methodName + "()");

    const db: Firestore = getFirestore(firebaseApp);
    return db;
};
