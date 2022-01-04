import BetaDao from "src/firebase/firestore/beta/BetaDao";

class BetaController {
    public static requestBetaAccess(email: string, callback: Function) {
        const result = BetaDao.getBetaRequestStatus(email);
        result.then(document => {
            if (document.exists() && document.data() && document.data()["status"]) {
                callback(document.data()["status"]);
            } else {
                const betaCreateResult = BetaDao.requestBetaAccess(email);
                betaCreateResult.then(() => {
                    callback("initial_pending");
                });
            }
        });
    }
}

export default BetaController;