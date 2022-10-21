import { Firestore, collection, addDoc } from 'firebase/firestore';
import { QuoteOfTheDayModel } from 'src/controller/widgets/quote_of_the_day/QuoteOfTheDayController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class QuoteOfTheDayDao {
	public static async save(quote: QuoteOfTheDayModel) {
		const db: Firestore = getFirebaseConnection(this.name, 'save');
		await addDoc(collection(db, 'quote_of_the_day'), quote);
	}
}

export default QuoteOfTheDayDao;
