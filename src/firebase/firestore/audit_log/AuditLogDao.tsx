import { getFirestore, Firestore, doc, setDoc, Timestamp } from 'firebase/firestore';
import firebaseApp from "src/firebase/Firebase"

class AuditLogDao {
    public static addLog(email: string, action: string) {
        const db: Firestore = getFirestore(firebaseApp);

        const timestamp: Timestamp = Timestamp.now();
        const key = action + "_" + timestamp.toMillis();

        setDoc(doc(db, 'audit_log/' + email + "/logs/", key), {
            "action": action,
            "timestamp": timestamp
        });
    }
}

export default AuditLogDao;