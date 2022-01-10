import { current } from '@reduxjs/toolkit';
import { getAuth } from 'firebase/auth';
import { getFirestore, Firestore, doc, setDoc, Timestamp } from 'firebase/firestore';
import firebaseApp from "src/firebase/Firebase"
import { Store } from 'src/redux/store';

class AuditLogDao {
    public static addLog(action: string) {
        const currentUser = getAuth().currentUser;
        if (!currentUser) {
            return;
        }

        const uid = currentUser.uid;

        const db: Firestore = getFirestore(firebaseApp);

        const timestamp: Timestamp = Timestamp.now();
        const key = action + "_" + timestamp.toMillis();

        setDoc(doc(db, "audit_log/" + uid + "/logs/", key), {
            "action": action,
            "timestamp": timestamp
        });
    }
}

export default AuditLogDao;