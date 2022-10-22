import { getAuth } from 'firebase/auth';
import { DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import NotificationController, { NotificationType } from 'src/controller/notification/NotificationController';
import QuoteOfTheDayDao from 'src/firebase/firestore/widgets/quote_of_the_day/QuoteOfTheDayDao';
import { getDaysOld } from 'src/util/GeneralUtility';

export interface QuoteOfTheDayModel {
    id?: string;
    uid: string;
    quote: string;
    author: string;
    likes: string[];
    added: Timestamp;
}

export interface QuoteOfTheDayMetadata {
    activeId: string;
    updated: Timestamp;
    history: string[];
}

const INVALID_QUOTE_OF_THE_DAY: QuoteOfTheDayModel = {
    id: '',
    uid: '',
    quote: '',
    author: '',
    likes: [],
    added: Timestamp.fromMillis(Date.now() - 6048000000),
};

class QuoteOfTheDayController {
    public static create(quote: string, author: string): QuoteOfTheDayModel {
        const quoteModel: QuoteOfTheDayModel = {
            uid: getAuth().currentUser!.uid,
            quote: quote,
            author: author,
            likes: [],
            added: Timestamp.now(),
        };

        return quoteModel;
    }

    public static clone(quote: QuoteOfTheDayModel): QuoteOfTheDayModel {
        const clone: QuoteOfTheDayModel = {
            id: quote.id,
            uid: quote.uid,
            quote: quote.quote,
            author: quote.author,
            added: quote.added,
            likes: quote.likes,
        };

        return clone;
    }

    public static async save(quote: QuoteOfTheDayModel) {
        await QuoteOfTheDayDao.save(quote);
    }

    public static async get(id: string): Promise<QuoteOfTheDayModel> {
        const result = await QuoteOfTheDayDao.get(id);
        if (!result.exists()) {
            return INVALID_QUOTE_OF_THE_DAY;
        }

        const quoteOfTheDay = this.getQuoteOfTheDayFromResult(result);
        return quoteOfTheDay;
    }

    public static async getAll(): Promise<QuoteOfTheDayModel[]> {
        const results = await QuoteOfTheDayDao.getAll();

        let quotes: QuoteOfTheDayModel[] = [];
        results.docs.forEach((result) => {
            if (result.id === 'metadata') {
                return;
            }
            const quote = this.getQuoteOfTheDayFromResult(result);
            quotes.push(quote);
        });

        return quotes;
    }

    public static async getCurrentQuoteOfTheDay(): Promise<QuoteOfTheDayModel> {
        const results = await QuoteOfTheDayDao.get('metadata');
        let metadata: QuoteOfTheDayMetadata = results.data() as QuoteOfTheDayMetadata;
        if (!this.metadataHasAllFields(metadata)) {
            metadata = this.resetMetadata();
        }

        let quoteOfTheDay = undefined;
        if (metadata.activeId) {
            quoteOfTheDay = await this.get(metadata.activeId);
        }

        if (quoteOfTheDay && quoteOfTheDay !== INVALID_QUOTE_OF_THE_DAY) {
            if (this.quoteIsToday(metadata)) {
                return quoteOfTheDay;
            }
        }

        quoteOfTheDay = await this.getNewQuoteOfTheDay(metadata);
        if (!quoteOfTheDay) {
            metadata = this.resetMetadata();
            quoteOfTheDay = await this.getNewQuoteOfTheDay(metadata);
        }

        if (!quoteOfTheDay) {
            return INVALID_QUOTE_OF_THE_DAY;
        }

        metadata.activeId = quoteOfTheDay.id!;
        metadata.history.push(quoteOfTheDay.id!);
        metadata.updated = Timestamp.now();
        QuoteOfTheDayDao.updateMetadata(metadata);
        NotificationController.addNotification('system', getAuth().currentUser!.uid, NotificationType.QUOTE_SELECTED, '');

        return quoteOfTheDay;
    }

    public static async addLike(quote: QuoteOfTheDayModel, uid: string): Promise<QuoteOfTheDayModel> {
        if (!quote.likes.includes(uid)) {
            quote.likes.push(uid);
            await QuoteOfTheDayDao.update(quote);
            NotificationController.addNotification(getAuth().currentUser!.uid, uid, NotificationType.QUOTE_LIKE, '');
        }

        return quote;
    }

    private static async getNewQuoteOfTheDay(metadata: QuoteOfTheDayMetadata) {
        let quotes = await this.getAll();
        quotes.sort(() => Math.random() - 0.5);
        for (const quote of quotes) {
            if (!metadata.history.includes(quote.id!)) {
                return quote;
            }
        }

        return undefined;
    }

    private static quoteIsToday(metadata: QuoteOfTheDayMetadata) {
        const then = metadata.updated.toDate();
        const now = Timestamp.now().toDate();
        const daysOld = getDaysOld(then, now);

        return daysOld < 1;
    }

    private static metadataHasAllFields(metadata: QuoteOfTheDayMetadata): boolean {
        return metadata !== undefined && metadata.activeId !== undefined && metadata.updated !== undefined && metadata.history !== undefined;
    }

    private static resetMetadata(): QuoteOfTheDayMetadata {
        const metadata: QuoteOfTheDayMetadata = {
            activeId: '',
            updated: Timestamp.now(),
            history: [],
        };

        return metadata;
    }

    private static getQuoteOfTheDayFromResult(result: QueryDocumentSnapshot<DocumentData>) {
        let quoteOfTheDay = result.data() as QuoteOfTheDayModel;
        quoteOfTheDay.id = result.id;
        if (!quoteOfTheDay.likes) {
            quoteOfTheDay.likes = [];
        }

        return quoteOfTheDay;
    }
}

export default QuoteOfTheDayController;
