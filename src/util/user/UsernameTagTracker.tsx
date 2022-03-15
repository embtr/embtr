import * as React from 'react';

import ProfileController from "src/controller/profile/ProfileController";
import { UserProfileModel } from "src/firebase/firestore/profile/ProfileDao";
import { Text, View } from 'react-native';
import { ThemeContext } from 'src/components/theme/ThemeProvider';
import { NavigatableUsername } from 'src/components/profile/NavigatableUsername';


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

    public static dencodeTaggedUsers(commentText: string, colors: any, callback: Function) {
        const uids: string[] = this.getUidsFromEncodedComment(commentText);
        if (uids.length === 0) {
            callback(<Text style={{ color: colors.text, fontWeight: "normal" }}>{commentText}</Text>);
            return;
        }

        ProfileController.getProfiles(uids, (userProfiles: UserProfileModel[]) => {
            let textElements: JSX.Element[] = [];

            const splitComment: string[] = commentText.split(" ");
            let currentText = "";
            splitComment.forEach(token => {
                if (!token.startsWith("{user_uid:")) {
                    currentText += token + " ";
                } else {
                    if (currentText.length > 0) {
                        textElements.push(<Text style={{ color: colors.text, fontWeight: "normal" }}>{currentText}</Text>);
                    }

                    const uid = token.substring("{user_uid:".length, token.length - 1);
                    userProfiles.forEach(userProfile => {
                        if (userProfile.uid === uid) {
                            textElements.push(<NavigatableUsername userProfile={userProfile}></NavigatableUsername>);
                        }
                    });

                    currentText = "";
                }
            });

            if (currentText.length > 0) {
                textElements.push(<Text style={{ color: colors.text, fontWeight: "normal" }}>{currentText}</Text>);
            }

            callback(<Text>{textElements}</Text>);

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