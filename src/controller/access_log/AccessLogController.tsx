import { Timestamp } from 'firebase/firestore';
import AccessLogDao from 'src/firebase/firestore/access_log/AccessLogDao';
import { getCurrentUid } from 'src/session/CurrentUserProvider';

const PAGE_TYPE = 'page';

const TIMELINE_PAGE = 'timeline';
const TODAY_PAGE = 'today';
const PLANNING_CALENDAR_PAGE = 'planning.calendar';
const PLANNING_LIST_PAGE = 'planning.list';
const PROFILE_PROFILE_PAHE = 'profile.profile';
const PROFILE_TODAY_PAGE = 'profile.today';
const PROFILE_ACTIVITY = 'profile.activity';

export interface AccessLogModel {
	uid: string;
	type: string;
	name: string;
	timestamp: Timestamp;
}

export const createAccessLog = (type: string, name: string) => {
	const accessLog: AccessLogModel = {
		uid: getCurrentUid(),
		timestamp: Timestamp.now(),
		type: type,
		name: name,
	};

	return accessLog;
};

class AccessLogController {
	public static async addProfileProfilePageAccesLog() {
		const accessLog = createAccessLog(PAGE_TYPE, PROFILE_PROFILE_PAHE);
		await this.add(accessLog);
	}

	public static async addProfileTodayPageAccesLog() {
		const accessLog = createAccessLog(PAGE_TYPE, PROFILE_TODAY_PAGE);
		await this.add(accessLog);
	}

	public static async addProfileActivityPageAccesLog() {
		const accessLog = createAccessLog(PAGE_TYPE, PROFILE_ACTIVITY);
		await this.add(accessLog);
	}

	public static async addPlanningCalendarPageAccesLog() {
		const accessLog = createAccessLog(PAGE_TYPE, PLANNING_CALENDAR_PAGE);
		await this.add(accessLog);
	}

	public static async addPlanningListPageAccesLog() {
		const accessLog = createAccessLog(PAGE_TYPE, PLANNING_LIST_PAGE);
		await this.add(accessLog);
	}

	public static async addTodayPageAccesLog() {
		const accessLog = createAccessLog(PAGE_TYPE, TODAY_PAGE);
		await this.add(accessLog);
	}

	public static async addTimelinePageAccesLog() {
		const accessLog = createAccessLog(PAGE_TYPE, TIMELINE_PAGE);
		await this.add(accessLog);
	}

	private static async add(accessLog: AccessLogModel) {
		await AccessLogDao.add(accessLog);
	}
}

export default AccessLogController;
