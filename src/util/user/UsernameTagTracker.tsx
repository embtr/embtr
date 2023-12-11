import { Text } from 'react-native';
import { UserProfileModel } from 'src/model/OldModels';

export class UsernameTagTracker {
    public static isTypingUsername(text: string): boolean {
        const lastAtIndex = text.lastIndexOf('@');
        if (lastAtIndex < 0) {
            return false;
        }

        const remainder = text.substring(lastAtIndex + 1);
        return remainder.indexOf(' ') < 0;
    }

    public static getUsernameFromText(text: string): string | undefined {
        const lastAtIndex = text.lastIndexOf('@');
        if (lastAtIndex < 0) {
            return undefined;
        }

        const remainder = text.substring(lastAtIndex + 1);
        return remainder;
    }

    public static clearUsernameTag(text: string): string {
        const lastAtIndex = text.lastIndexOf('@');
        if (lastAtIndex < 0) {
            return text;
        }

        const remainder = text.substring(0, lastAtIndex);
        return remainder;
    }

    public static encodeTaggedUsers(commentText: string, taggedUsers: UserProfileModel[]): string {
        let newCommentText = commentText;
        taggedUsers.forEach((taggedUser) => {
            newCommentText = newCommentText.replace(new RegExp(taggedUser.name!, 'g'), '<user_uid>' + taggedUser.uid + '</user_uid>');
        });

        return newCommentText;
    }

    public static dencodeTaggedUsers(commentText: string, colors: any, callback: Function) {
        const uids: string[] = this.getUidsFromEncodedComment(commentText);
        if (uids.length === 0) {
            callback(<Text style={{ fontWeight: 'normal' }}>{commentText}</Text>);
            return;
        }
    }

    private static getUidsFromEncodedComment(commentText: string): string[] {
        if (!commentText.includes('</user_uid>')) {
            return [];
        }

        let uids: string[] = [];
        const splitByEndTag: string[] = commentText.split('</user_uid>');
        splitByEndTag.forEach((frontOfString) => {
            if (frontOfString.includes('<user_uid>')) {
                const splitByFrontTag: string[] = frontOfString.split('<user_uid>');
                uids.push(splitByFrontTag[splitByFrontTag.length - 1]);
            }
        });

        return uids;
    }
}
