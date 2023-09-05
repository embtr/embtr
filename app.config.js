module.exports = ({ config }) => {
    return {
        ...config,
        extra: {
            ...config.extra,
            apiUrl: process.env.APP_ENV === "production" ? "https://api.embtr.com" : "http://192.168.1.212:3000"
        }, 
    };
};