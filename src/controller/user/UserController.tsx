import UserDao from "src/firebase/firestore/user/UserDao";

class UserController {
    public static requestBetaAccess(email: string, callback: Function) {
        const result = UserDao.getBetaRequestStatus(email);
        result.then(document => {
            if (document.exists() && document.data() && document.data()["status"]) {
                callback(document.data()["status"]);
            } else {
                const betaCreateResult = UserDao.requestBetaAccess(email);
                betaCreateResult.then(() => {
                    callback("initial_pending");
                });
            }
        });
    }
}

export default UserController;