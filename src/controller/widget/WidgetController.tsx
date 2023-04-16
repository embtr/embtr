import { Widget, WidgetType } from 'resources/schema';
import { UpdateWidgetsRequest } from 'resources/types/requests/WidgetTypes';
import axiosInstance from 'src/axios/axios';

export class WidgetController {
    public static async get(): Promise<Widget[]> {
        return await axiosInstance
            .get(`/widget/`)
            .then((success) => {
                return success.data.widgets;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async update(widgets: Widget[]) {
        for (let i = 0; i < widgets.length; i++) {
            const widget = widgets[i];
            widget.order = i;
        }

        const request: UpdateWidgetsRequest = {
            widgets,
        };

        return await axiosInstance
            .post(`/widget/`, request)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static getDefaults() {
        const values = Object.values(WidgetType);
        const defaults: Widget[] = values.map((value, index) => {
            return { type: value, order: index };
        });
        return defaults;
    }
}
