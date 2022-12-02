import * as React from 'react';
import { View, ViewStyle, Text, TextStyle, TextInput } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { Ionicons } from '@expo/vector-icons';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { Pillar } from 'src/components/profile/profile_component/pillar/Pillar';
import PillarController from 'src/controller/pillar/PillarController';
import { PillarModel } from 'src/model/PillarModel';
import { useFocusEffect } from '@react-navigation/native';
import { Pillars } from 'src/components/profile/profile_component/pillar/Pillars';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';

interface Props {
    userProfileModel: UserProfileModel;
}

export const PillarsConfiguration = ({ userProfileModel }: Props) => {
    const { colors } = useTheme();

    const textStyle = {
        fontSize: 18,
        color: colors.text,
    } as TextStyle;

    const pillarContainerViewStyle = {
        paddingBottom: 5,
    } as ViewStyle;

    const [addPillarText, setAddPillarText] = React.useState('');
    const [pillars, setPillars] = React.useState<PillarModel[]>([]);

    const getPillars = () => {
        if (userProfileModel?.uid) {
            PillarController.getPillars(userProfileModel.uid, (updatedPillars: PillarModel[]) => {
                setPillars(updatedPillars);
            });
        }
    };

    const addPillar = () => {
        if (addPillarText) {
            PillarController.addPillar(addPillarText, getPillars);
            setAddPillarText('');
        }
    };

    const maxPillersUsed = () => {
        return pillars.length > 4;
    };

    let pillarViews: JSX.Element[] = [];
    pillars.forEach((pillarModel) => {
        pillarViews.push(
            <View style={pillarContainerViewStyle} key={pillarModel.name}>
                <Pillar pillarModel={pillarModel} />
            </View>
        );
    });

    useFocusEffect(
        React.useCallback(() => {
            getPillars();
        }, [])
    );

    return (
        <Screen>
            <Banner name="Pillar Configuration" leftIcon={'arrow-back'} leftRoute="BACK" />

            <View style={{ width: '100%', alignItems: 'center' }}>
                <View style={{ width: isDesktopBrowser() ? '60%' : '100%' }}>
                    <View style={{ flexDirection: 'row', marginTop: 30 }}>
                        <View style={{ flex: 4 }}>
                            <TextInput
                                style={{
                                    marginLeft: '10%',
                                    marginRight: maxPillersUsed() ? '10%' : 0,
                                    paddingLeft: 10,
                                    height: 40,
                                    borderColor: colors.text,
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    color: colors.text,
                                    fontSize: 20,
                                }}
                                onChangeText={setAddPillarText}
                                value={addPillarText}
                                placeholderTextColor={colors.secondary_text}
                                placeholder={maxPillersUsed() ? 'max pillars used' : 'add pillar'}
                                autoCapitalize="none"
                                editable={!maxPillersUsed()}
                            />
                        </View>

                        {!maxPillersUsed() && (
                            <View style={{ flex: 1 }}>
                                <View
                                    style={{
                                        marginLeft: 10,
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        borderColor: colors.text,
                                        height: 40,
                                        width: 40,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Ionicons name={'add'} size={25} color={colors.text} onPress={addPillar} />
                                </View>
                            </View>
                        )}
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={[textStyle, { textAlign: 'center' }]}>Pillars ({pillars.length}/5)</Text>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={[textStyle, { textAlign: 'center', fontSize: 12 }]}>
                            Core Life Pillars are your personal values that mean the most to you. Rank your Pillars from highest to lowest priority.
                        </Text>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Pillars userProfileModel={userProfileModel} />
                    </View>
                </View>
            </View>
        </Screen>
    );
};
