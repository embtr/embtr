import EventDao from "src/firebase/firestore/event/EventDao";

class EventController {
    public static addGogginsRegistration(name: string, address: string, email: string, tSize: string) {
        EventDao.addGogginsRegistration(name, address, email, tSize);
    }

    static addGogginsSponsorship(name: string, email: string, runnerNameEmail: string) {
        EventDao.addGogginsSponsorship(name, email, runnerNameEmail);
    }

    static addGogginsDonation(name: string, email: string) {
        EventDao.addGogginsDonation(name, email);
    }
}

export default EventController;