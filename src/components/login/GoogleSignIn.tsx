import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Button } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignIn() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '376803163073-nivsntdkkej9ltf8lm7o46u1m2o63hcg.apps.googleusercontent.com',
    iosClientId: '376803163073-8pb7iligkf6p5ea4roucb23fe8v857r8.apps.googleusercontent.com',
    androidClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    webClientId: '376803163073-qle8k2tk1phjd3mmatmdknvafnivgcba.apps.googleusercontent.com',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
        }}
    />
  );
}
