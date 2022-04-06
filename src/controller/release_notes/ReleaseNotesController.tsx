import { Timestamp } from "firebase/firestore";
import ReleaseNotesDao from "src/firebase/firestore/release_notes/ReleaseNotesDao";

export interface ReleaseNotesModel {
    id?: string,
    added: Timestamp,
    notes: string[],
    version: number
}

class ReleaseNotesController {
    public static getAll(callback: Function) {
        let allReleaseNotes: ReleaseNotesModel[] = [];
        const results = ReleaseNotesDao.getAll();
        results.then(collection => {
            collection.docs.forEach(doc => {
                let releaseNotes = doc.data() as ReleaseNotesModel;
                releaseNotes.id = doc.id;
                allReleaseNotes.push(releaseNotes);
            });
        }).then(() => {
            callback(allReleaseNotes);
        });
    }
}

export default ReleaseNotesController;