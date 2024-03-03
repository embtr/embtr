export interface PlannedDayGetByUser {
    id: number;
    user: {
        id: number;
        username: string;
    };
    plannedTasks: [
        {
            id: number;
            title: string;
            description: string;
            remoteImage: string;
            localImage: string;
            quantity: number;
            completedQuantity: number;
        },
    ];
}
