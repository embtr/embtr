module.exports = ({ config }) => {
    return {
        ...config,
        extra: {
            ...config.extra,
            //apiUrl: "https://api.embtr.com" 
            apiUrl: "http://192.168.1.213:3000" 
        }, 
    };
};