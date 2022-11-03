import UsersDao from 'src/firebase/firestore/user/UsersDao';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import UserSearchResultObject from 'src/firebase/firestore/user/UserSearchResultObject';

class UsersController {
    public static getUsersByDisplayName(name: string, callback: Function) {
        const result = UsersDao.getUsersByDisplayName(name);

        let results: UserProfileModel[] = [];
        result
            .then((response) => {
                response.docs.forEach((doc) => {
                    if (doc.id === 'system') {
                        return;
                    }

                    const userProfileModel: UserProfileModel = doc.data();
                    results.push(userProfileModel);
                });
            })
            .then(() => {
                let resultObject: UserSearchResultObject = new UserSearchResultObject();
                resultObject.query = name;
                resultObject.results = results;

                callback(resultObject);
            });
    }

    public static getUsersByDisplayNameSubQuery(name: string, currentResults: UserSearchResultObject, callback: Function) {
        const nameLower = name.toLowerCase();

        let newResults: UserProfileModel[] = [];
        if (currentResults.results) {
            currentResults.results.forEach((userProfileModel) => {
                if (userProfileModel.nameLower?.startsWith(nameLower)) {
                    newResults.push(userProfileModel);
                }
            });

            let updatedResults = new UserSearchResultObject();
            updatedResults.query = name;
            updatedResults.parentSearch = currentResults;
            updatedResults.results = newResults;

            callback(updatedResults);
        } else {
            let emptyResults = new UserSearchResultObject();
            emptyResults.query = name;
            emptyResults.parentSearch = currentResults;

            callback(emptyResults);
        }
    }
}

export default UsersController;
