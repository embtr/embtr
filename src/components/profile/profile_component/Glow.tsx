import * as React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

export const Glow = () => {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Svg viewBox="0 0 100 100" fill="none">
                <Circle cx={50} cy={50} r={50} stroke="url(#paint0_radial_1_2)" strokeWidth={20} />
                <Defs>
                    <RadialGradient
                        id="paint0_radial_1_2"
                        cx={0}
                        cy={0}
                        r={1}
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(0 50 -50 0 50 50)"
                    >
                        <Stop stopColor="#B52AF7" />
                        <Stop offset={0.5} stopColor="#B52AF7" />
                        <Stop offset={0.635} stopColor="#C235EC" stopOpacity={0.35} />
                        <Stop offset={1} stopColor="#FF69B4" stopOpacity={0} />
                        <Stop offset={1} stopColor="#B52AF7" stopOpacity={0} />
                    </RadialGradient>
                </Defs>
            </Svg>
        </View>
    );
};
