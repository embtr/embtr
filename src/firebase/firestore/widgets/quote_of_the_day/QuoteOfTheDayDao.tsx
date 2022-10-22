import { Firestore, collection, addDoc, getDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { QuoteOfTheDayMetadata, QuoteOfTheDayModel } from 'src/controller/widgets/quote_of_the_day/QuoteOfTheDayController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class QuoteOfTheDayDao {
	public static async save(quote: QuoteOfTheDayModel | QuoteOfTheDayMetadata) {
		const db: Firestore = getFirebaseConnection(this.name, 'save');
		await addDoc(collection(db, 'quote_of_the_day'), quote);
	}

	public static async updateMetadata(metadata: QuoteOfTheDayMetadata) {
		const db: Firestore = getFirebaseConnection(this.name, 'updateMetadata');
		const result = await setDoc(doc(db, 'quote_of_the_day', 'metadata'), metadata);

		return result;
	}

	public static async get(id: string) {
		const db: Firestore = getFirebaseConnection(this.name, 'get');
		const result = await getDoc(doc(db, 'quote_of_the_day/', id));

		return result;
	}

	public static async getAll() {
		const db: Firestore = getFirebaseConnection(this.name, 'getAll');
		const result = await getDocs(collection(db, 'quote_of_the_day/'));

		return result;
	}
}

export default QuoteOfTheDayDao;
