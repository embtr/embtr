import { Firestore, doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { AccessLogModel } from 'src/controller/access_log/AccessLogController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class AccessLogDao {
    public static async add(accessLog: AccessLogModel) {
        const db: Firestore = getFirebaseConnection(this.name, 'add');
        const result = await addDoc(collection(db, 'access_log'), accessLog);

        return result;
    }
}

export default AccessLogDao;
