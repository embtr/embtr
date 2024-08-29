module.exports = ({ config }) => {
    return {
        ...config,
        extra: {
            ...config.extra,
            apiUrl:
                process.env.APP_ENV === 'production'
                    ? 'https://api.embtr.com'
                    : process.env.APP_ENV === 'staging'
                        ? 'https://staging.embtr.com'
                        : 'http://10.0.0.146:3000',
        },
    };
};
