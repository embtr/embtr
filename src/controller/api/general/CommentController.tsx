import { getInteractableEndpoint } from 'resources/endpoints';
import { Comment } from 'resources/schema';
import { Interactable } from 'resources/types/interactable/Interactable';
import { CreateCommentRequest } from 'resources/types/requests/GeneralTypes';
import axiosInstance from 'src/axios/axios';

export class CommentController {
    public static async add(interactable: Interactable, id: number, comment: string) {
        const endpoint = getInteractableEndpoint(interactable);
        const request: CreateCommentRequest = {
            comment,
        };

        return await axiosInstance
            .post(`${endpoint}${id}/comment/`, request)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async delete(interactable: Interactable, comment: Comment) {
        const endpoint = getInteractableEndpoint(interactable);

        return await axiosInstance
            .delete(`${endpoint}/comment/${comment.id}`)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }
}
