import { Firestore, setDoc, doc } from 'firebase/firestore';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class EventDao {
    public static async addGogginsRegistration(name: string, address: string, email: string, tSize: string) {
        const db: Firestore = getFirebaseConnection(this.name, "addGogginsRegistration");

        await setDoc(doc(db, "goggins_2022_athletes/" + email), {
            name, address, email, tSize
        }, { merge: true })
    }

    public static async addGogginsSponsorship(name: string, email: string, runnerNameEmail: string) {
        const db: Firestore = getFirebaseConnection(this.name, "addGogginsSponsorship");

        await setDoc(doc(db, "goggins_2022_sponsors/" + email), {
            name, email, runnerNameEmail
        }, { merge: true })
    }

    public static async addGogginsDonation(name: string, email: string) {
        const db: Firestore = getFirebaseConnection(this.name, "addGogginsDonation");

        await setDoc(doc(db, "goggins_2022_donations/" + email), {
            name, email
        }, { merge: true })
    }
}

export default EventDao;
