import MailDao from "src/firebase/firestore/mail/MailDao";
import { BETA_EMAIL_HTML, BETA_EMAIL_PLAIN } from "src/static/mail/BetaMail";

class MailController {
    public static sendWelcomeToBetaMail(email: string) {
        MailDao.sendMail(email, "Welcome to embtr.", BETA_EMAIL_PLAIN, BETA_EMAIL_HTML);
    }
}

export default MailController;