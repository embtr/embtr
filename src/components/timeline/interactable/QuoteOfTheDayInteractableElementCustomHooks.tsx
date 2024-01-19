import { Comment, QuoteOfTheDay } from 'resources/schema';
import { InteractableData, InteractableElementCustomHooks } from './InteractableElementCustomHooks';
import { LikeController } from 'src/controller/api/general/LikeController';
import { Interactable } from 'resources/types/interactable/Interactable';

const EMPTY_COMMENTS: Comment[] = [];

export namespace QuoteOfTheDayInteractableElementCustomHooks {
    export const useQuoteOfTheDayInteractableElement = (
        quoteOfTheDay: QuoteOfTheDay
    ): InteractableData => {
        const addLike = async () => {
            if (!quoteOfTheDay.id) {
                console.log('no id - returning');
                return;
            }

            await LikeController.add(Interactable.QUOTE_OF_THE_DAY, quoteOfTheDay.id);
        };

        const addComment = async (text: string) => {
            return undefined;
        };

        const deleteComment = async (comment: Comment) => {
            return undefined;
        };

        return InteractableElementCustomHooks.useInteractableElement(
            quoteOfTheDay.likes ?? [],
            EMPTY_COMMENTS,
            addLike,
            addComment,
            deleteComment
        );
    };
}
