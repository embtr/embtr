import { Comment, QuoteOfTheDay } from 'resources/schema';
import { InteractableData, InteractableElementCustomHooks } from './InteractableElementCustomHooks';
import { LikeController } from 'src/controller/api/general/LikeController';
import { Interactable } from 'resources/types/interactable/Interactable';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';

const EMPTY_COMMENTS: Comment[] = [];

export namespace QuoteOfTheDayInteractableElementCustomHooks {
    export const useQuoteOfTheDayInteractableElement = (
        quoteOfTheDay: QuoteOfTheDay
    ): InteractableData => {
        const addLike = async () => {
            if (!quoteOfTheDay.id) {
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

        const report = async () => { };

        const currentUser = useAppSelector(getCurrentUser);
        return InteractableElementCustomHooks.useInteractableElement(
            quoteOfTheDay.likes?.length ?? 0,
            quoteOfTheDay.likes?.some((like) => like.userId === currentUser.id) ?? false,
            EMPTY_COMMENTS,
            addLike,
            addComment,
            deleteComment,
            report
        );
    };
}
