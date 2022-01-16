import { Firestore, collection, addDoc } from 'firebase/firestore';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class MailDao {

    public static async sendMail(email: string, subject: string, plainEmail: string, htmlEmail: string) {
        const db: Firestore = getFirebaseConnection(this.name, "sendMail");

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
