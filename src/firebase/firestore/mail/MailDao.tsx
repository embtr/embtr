import { getFirestore, Firestore, doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import firebaseApp from "src/firebase/Firebase"

class MailDao {

    public static async sendMail(email: string, subject: string, plainEmail: string, htmlEmail: string) {
        const db: Firestore = getFirestore(firebaseApp);

        await addDoc(collection(db, "mail"), {
            to: [email],
            message: {
                subject: subject,
                text: plainEmail,
                html: htmlEmail,
            }
        });
    }

}

export default MailDao;