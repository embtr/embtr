import { getAuth } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import QuoteOfTheDayDao from 'src/firebase/firestore/widgets/quote_of_the_day/QuoteOfTheDayDao';

export interface QuoteOfTheDayModel {
    uid: string;
    quote: string;
    author: string;
    added: Timestamp;
}

class QuoteOfTheDayController {
    public static create(quote: string, author: string): QuoteOfTheDayModel {
        const quoteModel: QuoteOfTheDayModel = {
            uid: getAuth().currentUser!.uid,
            quote: quote,
            author: author,
            added: Timestamp.now(),
        };

        return quoteModel;
    }
    public static async save(quote: QuoteOfTheDayModel) {
        await QuoteOfTheDayDao.save(quote);
    }
}

export default QuoteOfTheDayController;
