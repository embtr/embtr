import { Dispatch, SetStateAction } from "react";
import FollowerDao from "src/firebase/firestore/follower/FollowerDao";
import NotificationController, { NotificationType } from "../notification/NotificationController";

export interface FollowCounts {
    follower_count: number;
    following_count: number;
}

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

    public static getFollowCounts(uid: string, callback: Function) {
        const result = FollowerDao.getFollow(uid);
        result.then(document => {
            if (document && document.exists()) {
                let followCounts: FollowCounts = document.data() as FollowCounts;
                if (followCounts?.follower_count === undefined || followCounts?.following_count === undefined) {
                    this.initFollowCounts(uid, callback);
                } else {
                    callback(followCounts);
                }
            } else {
                this.initFollowCounts(uid, callback);
            }
        });
    }

    private static initFollowCounts(uid: string, callback: Function) {
        this.getFollowers(uid, (followers: string[]) => {
            this.getFollowing(uid, (following: string[]) => {
                let followCounts: FollowCounts = { "follower_count": followers.length, "following_count": following.length };
                FollowerDao.setFollow(uid, followCounts);
                callback(followCounts);
            });
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
        NotificationController.addNotification(uid, uidToFollow, NotificationType.NEW_FOLLOWER, uid);
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
