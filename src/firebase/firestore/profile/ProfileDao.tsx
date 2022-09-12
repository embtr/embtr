import { Firestore, doc, getDoc, setDoc, getDocs, collection, where, query } from 'firebase/firestore';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

export interface UserProfileModel {
    uid?: string,
    name?: string,
    nameLower?: string,
    username?: string,
    email?: string,
    photoUrl?: string,
    bannerUrl?: string,
    bio?: string,
    location?: string
    level?: number
}

export const USER_PROFILE_SKELECTON: UserProfileModel = {
    uid: "",
    name: "",
    nameLower: "",
    username: "",
    email: "",
    photoUrl: "",
    bannerUrl: "",
    bio: "",
    location: "",
    level: 0
}

class ProfileDao {
    public static async getProfile(uid: string) {
        const db: Firestore = getFirebaseConnection(this.name, "getProfile");
        const result = await getDoc(doc(db, "profiles/", uid));

        return result;
    }

    public static async getProfiles(uids: string[]) {
        const db: Firestore = getFirebaseConnection(this.name, "getProfiles");
        const q = query(collection(db, "profiles"), where("uid", "in", uids));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

    public static async updateProfile(userProfile: UserProfileModel) {
       const db: Firestore = getFirebaseConnection(this.name, "updateProfile");

       if (!userProfile.uid) {
           return;
       }

       await setDoc(doc(db, "profiles/", userProfile.uid), userProfile, {merge: true});
   }

}

export default ProfileDao;
