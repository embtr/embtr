import { getInteractableEndpoint } from 'resources/endpoints';
import { Interactable } from 'resources/types/interactable/Interactable';
import axiosInstance from 'src/axios/axios';

export class LikeController {
    public static async add(interactable: Interactable, id: number) {
        const endpoint = getInteractableEndpoint(interactable);

        return axiosInstance
            .post(`${endpoint}v1/${id}/like/`)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }
}
