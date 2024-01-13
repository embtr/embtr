import UserController from 'src/controller/user/UserController';

export interface UsernameAvailabilityResult {
    message: string;
    available: boolean;
}

export class UserService {
    public static usernameIsValid(username: string): boolean {
        const onlyAlphaNumericOrUnderscore = /^[a-zA-Z0-9_]*$/.test(username);
        const tooLong = username.length > 20;

        return onlyAlphaNumericOrUnderscore && !tooLong;
    }

    public static async usernameIsAvailable(
        targetUsername: string,
        currentUsername?: string
    ): Promise<UsernameAvailabilityResult> {
        if (currentUsername === targetUsername) {
            return { message: 'available', available: true };
        }

        const empty = targetUsername.length === 0;
        if (empty) {
            return { message: 'required', available: false };
        }

        const tooShort = targetUsername.length < 3;
        if (tooShort) {
            return { message: 'too short', available: false };
        }

        const onlyAlphaNumericOrUnderscore = /^[a-zA-Z0-9_]*$/.test(targetUsername);
        if (!onlyAlphaNumericOrUnderscore) {
            const invalidCharacterCount = targetUsername.replace(/[a-zA-Z0-9_]/g, '').length;
            const message =
                invalidCharacterCount === 1 ? 'invalid character' : `invalid characters`;
            return { message: message, available: false };
        }

        const exists = await UserController.usernameExists(targetUsername);
        if (exists) {
            return { message: 'username in use', available: false };
        }

        return { message: 'available', available: true };
    }
}
