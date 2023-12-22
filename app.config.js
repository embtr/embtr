module.exports = ({ config }) => {
    return {
        ...config,
        extra: {
            ...config.extra,
            apiUrl:"https://api.embtr.com"
        }, 
    };
};
