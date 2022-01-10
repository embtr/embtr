import { getFirestore, Firestore, doc, getDoc, setDoc } from 'firebase/firestore';
import firebaseApp from "src/firebase/Firebase"

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
        const db: Firestore = getFirestore(firebaseApp);
        const result = await getDoc(doc(db, "profiles/", uid));

        return result;
    }

    public static updateProfile(userProfile: UserProfileModel) {
       const db: Firestore = getFirestore(firebaseApp);

       if (!userProfile.uid) {
           return;
       }

       setDoc(doc(db, "profiles/", userProfile.uid), {
           "uid": userProfile.uid,
           "name": userProfile.name,
           "nameLower": userProfile.nameLower,
           "email": userProfile.email,
           "photoUrl": userProfile.photoUrl
       }, {merge: true});
   }

}

export default ProfileDao;