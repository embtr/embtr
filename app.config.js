module.exports = ({ config }) => {
    return {
        ...config,
        extra: {
            ...config.extra,
            apiUrl: process.env.APP_ENV === "production" ? "https://api.embtr.com" : "http://192.168.0.171:3000"
        }, 
    };
};