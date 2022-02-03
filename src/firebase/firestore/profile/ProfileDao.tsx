import { Firestore, doc, getDoc, setDoc, getDocs, collection, where, query } from 'firebase/firestore';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

export interface UserProfileModel {
    uid?: string,
    name?: string,
    nameLower?: string,
    email?: string,
    photoUrl?: string,
    bio?: string
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

    public static updateProfile(userProfile: UserProfileModel) {
       const db: Firestore = getFirebaseConnection(this.name, "updateProfile");

       if (!userProfile.uid) {
           return;
       }

       setDoc(doc(db, "profiles/", userProfile.uid), {
           "uid": userProfile.uid,
           "bio": userProfile.bio ? userProfile.bio : "",
           "name": userProfile.name,
           "nameLower": userProfile.nameLower,
           "email": userProfile.email,
           "photoUrl": userProfile.photoUrl
       }, {merge: true});
   }

}

export default ProfileDao;