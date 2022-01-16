import { getAuth } from 'firebase/auth';
import { Firestore, doc, setDoc, Timestamp } from 'firebase/firestore';
import { getFirebaseConnection as getFirestoreConnection } from 'src/firebase/firestore/ConnectionProvider';

class AuditLogDao {
    public static addLog(action: string) {
        const currentUser = getAuth().currentUser;
        if (!currentUser) {
            return;
        }

        const uid = currentUser.uid;

        const db: Firestore = getFirestoreConnection(this.name, "addLog");

        const timestamp: Timestamp = Timestamp.now();
        const key = action + "_" + timestamp.toMillis();

        setDoc(doc(db, "audit_log/" + uid + "/logs/", key), {
            "action": action,
            "timestamp": timestamp
        });
    }
}

export default AuditLogDao;