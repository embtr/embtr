import { getAuth } from 'firebase/auth';
import { Firestore, collection, addDoc, query, orderBy, getDocs, setDoc, doc, arrayUnion, Timestamp, getDoc } from 'firebase/firestore';
import { StoryModel } from 'src/controller/timeline/story/StoryController';
import { Comment, Like } from 'src/controller/timeline/TimelineController';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';

class StoryDao {
    public static async addStory(story: StoryModel, callback: Function) {
        const uid = getAuth().currentUser?.uid;

        if (!uid) {
            callback();
            return;
        }

        const db: Firestore = getFirebaseConnection(this.name, "addStory");

        await addDoc(collection(db, "timeline"), story);
        callback();
    };

    public static async getStories() {
        const db: Firestore = getFirebaseConnection(this.name, "getStories");

        const q = query(collection(db, "timeline"), orderBy("added", "desc"));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

    public static async getStory(id: string) {
        const db: Firestore = getFirebaseConnection(this.name, "getStory");

        const result = await getDoc(doc(db, "timeline/" + id));
        return result;
    }

    public static likeStory(id: string, userUid: string) {
        const db: Firestore = getFirebaseConnection(this.name, "likeStory");

        const like: Like = {
            uid: userUid,
            added: Timestamp.now()
        };

        setDoc(doc(db, "timeline/" + id), {
            public: {
                likes: arrayUnion(like)
            }
        }, { merge: true })
    }

    public static addComment(id: string, uid: string, comment: string) {
        const db: Firestore = getFirebaseConnection(this.name, "addComment");

        return setDoc(doc(db, "timeline/" + id), {
            public: {
                comments: arrayUnion({
                    uid: uid,
                    comment: comment,
                    timestamp: Timestamp.now()
                })
            }
        }, { merge: true });
    }
}

export default StoryDao;
