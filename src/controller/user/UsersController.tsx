import { User } from "firebase/auth";
import UsersDao from "src/firebase/firestore/user/UsersDao";
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';

class UsersController {
    public static getUsersByDisplayName(name: string, callback: Function) {
        const result = UsersDao.getUsersByDisplayName(name);

        let results: UserProfileModel[] = [];
        result.then(response => {
            response.docs.forEach(doc => {
                const userProfileModel : UserProfileModel = doc.data();
                results.push(userProfileModel);
                
            });
        }).then(() => {
            callback(results);
        });
    }
}

export default UsersController;