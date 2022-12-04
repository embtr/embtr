import { getAuth } from 'firebase/auth';
import { Firestore, doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { UserModel } from 'src/controller/user/UserController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';
import { getCurrentUid } from 'src/session/CurrentUserProvider';

class UserDao {
    public static async getBetaRequestStatus(uid: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getBetaRequestStatus');
        const result = await getDoc(doc(db, 'users/', uid));

        return result;
    }

    public static async requestBetaAccess(uid: string, email: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'requestBetaAccess');

        const result = await getDoc(doc(db, 'users/', uid)).then((result) => {
            if (!result.exists()) {
                setDoc(doc(db, 'users/', uid), {
                    email: email,
                    access_level: 'beta_pending',
                    timestamp: Timestamp.now(),
                });
            }
        });

        return result;
    }

    public static async getCurrentUser() {
        return this.get(getCurrentUid());
    }

    public static async get(uid: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'get');
        const result = await getDoc(doc(db, 'users/', uid));

        return result;
    }

    public static async updateField(key: string, value: string | null) {
        const db: Firestore = getFirebaseConnection(this.name, 'updateField');

        const uid = getAuth().currentUser?.uid;
        if (!uid) {
            return;
        }

        const result = setDoc(doc(db, 'users/', uid), { [key]: value }, { merge: true });

        return result;
    }

    public static async update(user: UserModel) {
        const db: Firestore = getFirebaseConnection(this.name, 'update');

        const result = await setDoc(doc(db, 'users/', user.uid), user, { merge: true });
        return result;
    }
}

export default UserDao;
