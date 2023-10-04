import { getAuth } from 'firebase/auth';

export const getAuthTokenId = async () => {
    const currentToken = await getAuth().currentUser?.getIdToken();
    return currentToken;
};

export const getUserIdFromToken = async (): Promise<number | null> => {
    const decodedToken = await getAuth().currentUser?.getIdTokenResult();
    if (decodedToken) {
        const id = decodedToken.claims.userId;
        if (typeof id === 'number') {
            return id;
        }
    }

    return null;
};
