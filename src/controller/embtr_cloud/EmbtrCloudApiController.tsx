class EmbtrCloudApiController {

    public static sendPostNotificationApiRequest(notificationId: string) {
        fetch('https://us-central1-embtr-app.cloudfunctions.net/sendPushNotification?notification_id=' + notificationId)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson.movies;
            })
            .catch((error) => {
                return undefined;
            });
    }
}

export default EmbtrCloudApiController;