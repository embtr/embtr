export namespace ShadowUtility {
    export const getDefaultShadow = () => {
        return getShadow(25);
    };

    export const getShadow = (intensity: number) => {
        const shadow = {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: intensity / 100,
            shadowRadius: 3.84,

            elevation: 5,
        };

        return shadow;
    };

    export const getColoredShadow = (intensity: number, color: string) => {
        const shadow = {
            shadowColor: color,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: intensity / 100,
            shadowRadius: 3.84,

            elevation: 5,
        };

        return shadow;
    };
}
