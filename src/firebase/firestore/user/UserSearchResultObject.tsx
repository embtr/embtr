import { UserProfileModel } from 'src/model/OldModels';

class UserSearchResultObject {
    public parentSearch?: UserSearchResultObject;
    public results?: UserProfileModel[];
    public query?: string;
}

export default UserSearchResultObject;
