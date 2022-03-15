import ProfileController from "src/controller/profile/ProfileController";
import { UserProfileModel } from "src/firebase/firestore/profile/ProfileDao";

export class UsernameTagTracker {
    public static isTypingUsername(text: string): boolean {
        const lastAtIndex = text.lastIndexOf("@");
        if (lastAtIndex < 0) {
            return false;
        }

        const remainder = text.substring(lastAtIndex + 1);
        return remainder.indexOf(" ") < 0;
    }

    public static getUsernameFromText(text: string): string | undefined {
        const lastAtIndex = text.lastIndexOf("@");
        if (lastAtIndex < 0) {
            return undefined;
        }

        const remainder = text.substring(lastAtIndex + 1);
        return remainder;
    }

    public static clearUsernameTag(text: string): string {
        const lastAtIndex = text.lastIndexOf("@");
        if (lastAtIndex < 0) {
            return text;
        }

        const remainder = text.substring(0, lastAtIndex);
        return remainder;
    }

    public static encodeTaggedUsers(commentText: string, taggedUsers: UserProfileModel[]): string {
        let newCommentText = commentText;
        taggedUsers.forEach(taggedUser => {
            newCommentText = newCommentText.replaceAll(taggedUser.name!, "{user_uid:" + taggedUser.uid + "}");
        });

        return newCommentText;
    }

    public static dencodeTaggedUsers(commentText: string, callback: Function) {
        const uids: string[] = this.getUidsFromEncodedComment(commentText);
        ProfileController.getProfiles(uids, (userProfiles: UserProfileModel[]) => {
            let newCommentText = commentText;
            if (newCommentText.includes("user_uid")) {
                const startIndex = newCommentText.indexOf("{user_uid:") + "{user_uid:".length;
                if (startIndex + 29 >= commentText.length) {
                    callback(newCommentText);
                    return;
                }
                const uid = newCommentText.substring(startIndex, startIndex + 28);
                userProfiles.forEach(userProfile => {
                    if (uid === userProfile.uid) {
                        newCommentText = newCommentText.replaceAll("{user_uid:" + uid + "}", userProfile.name!);
                    }
                });
            }

            callback(newCommentText);
            return;
        });
    }

    private static getUidsFromEncodedComment(commentText: string): string[] {
        let uids: string[] = [];
        let newCommentText = commentText;
        if (newCommentText.includes("user_uid")) {
            const startIndex = newCommentText.indexOf("{user_uid:") + "{user_uid:".length;
            if (startIndex + 29 >= commentText.length) {
                return uids;
            }
            const uid = newCommentText.substring(startIndex, startIndex + 28);
            uids.push(uid);
            newCommentText = newCommentText.replaceAll("{user_uid:" + uid + "}", "");
        }

        return uids;
    }
}