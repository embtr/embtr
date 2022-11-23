import { getAuth } from 'firebase/auth';
import { Firestore, doc, setDoc, deleteDoc, Timestamp, getDocs, collection, getDoc } from 'firebase/firestore';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';

class PillarDao {
    public static async addPillar(pillar: string, callback: Function) {
        getCurrentUserUid((uid: string | undefined) => {
            if (!uid) {
                callback();
                return;
            }

            const db: Firestore = getFirebaseConnection(this.name, 'addPillar');

            const timestamp = Timestamp.now();

            setDoc(
                doc(db, 'pillars/' + uid + '/active/' + pillar),
                {
                    timestamp: timestamp,
                },
                { merge: true }
            ).then(() => {
                callback();
            });
        });
    }

    public static async deletePillar(pillar: string, callback: Function) {
        const db: Firestore = getFirebaseConnection(this.name, 'deletePillar');

        const uid = getAuth().currentUser?.uid;

        if (!uid) {
            return;
        }

        await getDoc(doc(db, 'pillars/' + uid + '/active/' + pillar)).then((result) => {
            if (!result.exists()) {
                callback();
                return;
            }

            setDoc(doc(db, 'pillars/' + uid + '/inactive/', pillar), result.data()).then(() => {
                deleteDoc(doc(db, 'pillars/' + uid + '/active/' + pillar)).then(() => {
                    callback();
                });
            });
        });
    }

    public static async get(uid: string, id: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'get');
        const result = await getDoc(doc(db, 'pillars/' + uid + '/active/' + id));

        return result;
    }

    public static async getPillars(uid: string) {
        if (uid) {
            const db: Firestore = getFirebaseConnection(this.name, 'getPillars');
            const result = await getDocs(collection(db, 'pillars/' + uid + '/active'));

            return result;
        }

        return undefined;
    }
}

export default PillarDao;
