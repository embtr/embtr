import { getFirestore, Firestore, doc, setDoc, Timestamp } from 'firebase/firestore';
import firebaseApp from "src/firebase/Firebase"
import { Store } from 'src/redux/store';

class AuditLogDao {
    public static addLog(action: string) {
        const state = Store.getState();
        const email = state.user.email;

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