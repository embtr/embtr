import { Dispatch, SetStateAction } from "react";
import FollowerDao from "src/firebase/firestore/follower/FollowerDao";

class FollowerController {
    public static getFollowers(uid: string, callback: Function) {
        let followerIds: string[] = [];
        const result = FollowerDao.getFollowers(uid);

        result.then(documents => {
            documents.forEach(document => {
                let id = document.id;
                let active = document.data()['active'];

                if (active) {
                    followerIds.push(id);
                }
            });
        }).then(() => {
            callback(followerIds);
        }).catch(() => {
            callback(followerIds);
        });
    }

    public static getFollowing(uid: string, callback: Function) {
        let followerIds: string[] = [];
        const result = FollowerDao.getFollowing(uid);

        result.then(documents => {
            documents.forEach(document => {
                let id = document.id;
                let active = document.data()['active'];

                if (active) {
                    followerIds.push(id);
                }
            });
        }).then(() => {
            callback(followerIds);
        }).catch(() => {
            callback(followerIds);
        });
    }

    public static followUser(uid: string, uidToFollow: string, callback: Function) {
        FollowerDao.followUser(uid, uidToFollow);
        callback();
    }

    public static unfollowUser(uid: string, uidToUnfollow: string, callback: Function) {
        FollowerDao.unfollowUser(uid, uidToUnfollow);
        callback();
    }

    public static isFollowingUser(uid: string, uidInQuestion: string, callback: Function) {
        this.getFollowing(uid, (followers: string[]) => {
            callback(followers.includes(uidInQuestion));
        });
    }

}

export default FollowerController;