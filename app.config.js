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
                        : //   ethernet
                        //'http://10.0.0.146:3000',
                        //   wifi
                        //'http://10.0.0.91:3000',
                        // other wifi
                        'http://192.168.5.11:3000',
        },
    };
};
