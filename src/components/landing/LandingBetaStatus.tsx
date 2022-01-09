import * as React from 'react';
import { View, Text, TextStyle } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    registrationStatus: string
}

export const LandingBetaStatus = ({ registrationStatus }: Props) => {
    const { colors } = useTheme();

    const betaRequestStatusTextStyle = {
        textAlign: 'center',
        fontSize: 14,
        color: colors.secondary_border
    } as TextStyle;

    const registrationText =
        registrationStatus === "initial_beta_pending" ? "Thank you for your beta request! Please check your inbox for further steps." :
            registrationStatus === "beta_pending" ? "Your beta request has been previously submitted and is currently pending ✅." :
                registrationStatus === "beta_denied" ? "Beta registration is currently closed. We will send an email when we open access again." :
                    registrationStatus === "error_auth" ? "We failed to authenticate your account. Reach out to support@embtr.com if this error continues." :
                        registrationStatus === "error_data" ? "An error occured while requesting beta access. Reach out to support@embtr.com if this error continues." :
                            ""
    return (
        <Text style={betaRequestStatusTextStyle}>
            {registrationText}
        </Text>
    )
}