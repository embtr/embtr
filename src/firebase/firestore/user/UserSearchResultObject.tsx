import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';

class UserSearchResultObject {
    public parentSearch? : UserSearchResultObject;
    public results?: UserProfileModel[];
    public query?: string;
}

export default UserSearchResultObject;