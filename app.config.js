module.exports = ({ config }) => {
    return {
        ...config,
        extra: {
            ...config.extra,
            apiUrl: process.env.ENVIRONMENT === "production" ? "https://api.embtr.com" : "http://192.168.1.213:3000" 
        }, 
    };
};