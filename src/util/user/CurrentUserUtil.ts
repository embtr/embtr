import { getAuth } from 'firebase/auth';

export const getAuthTokenId = async () => {
    const currentToken = await getAuth().currentUser?.getIdToken();
    return currentToken;
};
