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
}