import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

export const registerAuthStateListener = (callback: Function) => {
    onAuthStateChanged(getAuth(), (user) => {
        callback(user);
    });
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
        registerAuthStateListener((user: User) => {
            if (user) {
                callback(user.uid);
            } else {
                callback(null);
            }
        });
    }
};
