import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

export const registerAuthStateListener = (callback: (user: User | null) => void) => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
        callback(user);
    });

    return unsubscribe;
};

export const getCurrentUid = () => {
    return getAuth().currentUser!.uid;
};

export const getCurrentEmail = () => {
    return getAuth().currentUser?.email;
};

export const getCurrentUserUid = (callback: Function) => {
    const user: User | null = getAuth().currentUser;
    if (user) {
        callback(user.uid);
    } else {
        registerAuthStateListener((user) => {
            if (user) {
                callback(user.uid);
            } else {
                callback(null);
            }
        });
    }
};
