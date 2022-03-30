export class DateUtil {
    public static getTomorrowKey = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const elements = tomorrow.toLocaleDateString("en-US").split("/");
        const month = elements[0].length == 1 ? "0" + elements[0] : elements[0];
        const day = elements[1].length == 1 ? "0" + elements[1] : elements[1];
        const year = elements[2];

        return month + day + year;
    }
}