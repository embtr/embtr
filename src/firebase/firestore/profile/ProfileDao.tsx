import { getFirestore, Firestore, doc, getDoc, setDoc } from 'firebase/firestore';
import firebaseApp from "src/firebase/Firebase"

export interface UserProfileModel {
    name?: string,
    nameLower?: string,
    email?: string,
    photoUrl?: string,
    bio?: string
}

class ProfileDao {

    public static async getProfile(email: string) {
        const db: Firestore = getFirestore(firebaseApp);
        const result = await getDoc(doc(db, "profiles/", email));

        return result;
    }

    public static updateProfile(userProfile: UserProfileModel) {
       const db: Firestore = getFirestore(firebaseApp);

       setDoc(doc(db, "profiles/", userProfile.email!), {
           "name": userProfile.name,
           "nameLower": userProfile.nameLower,
           "email": userProfile.email,
           "photoUrl": userProfile.photoUrl
       }, {merge: true});
   }

}

export default ProfileDao;