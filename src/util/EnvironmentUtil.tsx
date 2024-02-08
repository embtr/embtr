export namespace EnvironmentUtil {
    export const isDevelopment = () => {
        return process.env.EXPO_PUBLIC_ENV === 'development';
    };
}
