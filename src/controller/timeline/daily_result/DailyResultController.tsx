import { getAuth } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { PlannedDay, PlannedTaskModel } from "src/controller/planning/PlannedDayController";
import { TimelinePostModel } from "src/controller/timeline/TimelineController";
import DailyResultDao from "src/firebase/firestore/daily_result/DailyResultDao";

export interface DailyResultModel extends TimelinePostModel {
    data: {
        day: string,
        status: string,
        plannedDayId: string
    }
}

class DailyResultController {
    public static createDailyResultModel(plannedDay: PlannedDay, status: string): DailyResultModel {
        const uid = getAuth().currentUser!.uid;

        const dailyResult: DailyResultModel = {
            data: {
                day: plannedDay.id!,
                status: status,
                plannedDayId: plannedDay.id!
            },
            added: Timestamp.now(),
            type: "DAILY_RESULT",
            uid: uid,
            public: {
                comments: [],
                likes: []
            }
        };

        return dailyResult;
    }

    public static async create(dailyResult: DailyResultModel) {
        const result = await DailyResultDao.create(dailyResult);
        dailyResult.id = result?.id;

        return dailyResult;
    }

    public static async getAll() {
        const result = await DailyResultDao.getAll();

        let dailyResults: DailyResultModel[] = [];
        result.forEach(doc => {
            let dailyResult = doc.data() as DailyResultModel;
            dailyResult.id = doc.id;
            dailyResults.push(dailyResult);
        });

        return dailyResults;
    }
};

export default DailyResultController;