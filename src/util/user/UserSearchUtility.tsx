import UsersController from 'src/controller/user/UsersController';
import UserSearchResultObject from 'src/firebase/firestore/user/UserSearchResultObject';

export class UserSearchUtility {
    private searchText: string = "";
    private searchResults : UserSearchResultObject | undefined = undefined;

    public updateSearch (text: string, callback: Function) {
        console.log("updating")
        
        const runDownSubQuery: boolean = text.includes(this.searchText);
        const runUpQuery: boolean = this.searchText.includes(text);

        this.searchText = text;

        if (this.searchResults && runDownSubQuery) {
            UsersController.getUsersByDisplayNameSubQuery(text, this.searchResults, (newResults: UserSearchResultObject) => {
                this.searchResults = newResults;
                callback(this.searchResults);
            });

        } else if (this.searchResults && runUpQuery) {
            this.searchResults = this.searchResults.parentSearch;
            callback(this.searchResults);

        } else {
            UsersController.getUsersByDisplayName(text, (results: UserSearchResultObject) => {
                this.searchResults = results;
                callback(this.searchResults);
            });
        }
    }
}