import { getAuth } from 'firebase/auth';

export const getAuthTokenId = async () => {
    const currentToken = await getAuth().currentUser?.getIdToken();
    return currentToken;
};

export const getUserIdFromToken = async () => {
    const decodedToken = await getAuth().currentUser?.getIdTokenResult();
    if (decodedToken) {
        return decodedToken.claims.userId;
    }

    return null;
};
