import { getAuth } from "firebase/auth";
import UserDao from "src/firebase/firestore/user/UserDao";

class UserController {
    public static requestBetaAccess(email: string, callback: Function) {
        const result = UserDao.getBetaRequestStatus(email);
        result.then(document => {
            if (document.exists() && document.data() && document.data()["access_level"]) {
                callback(document.data()["access_level"]);
            } else {
                const betaCreateResult = UserDao.requestBetaAccess(email);
                betaCreateResult.then(() => {
                    callback("initial_beta_pending");
                });
            }
        });
    }

    public static updateProfile() {
        //console.log(getAuth().currentUser);
    }
}

export default UserController;