import { DocumentData, DocumentSnapshot, Timestamp } from 'firebase/firestore';
import RoutineDao from 'src/firebase/firestore/routine/RoutineDao';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { UserModel } from '../user/UserController';

export interface RoutineModel {
	id: string;
	uid: string;
	name: string;
	description: string;
	active: boolean;
	added: Timestamp;
	modified: Timestamp;
}

export const FAKE_ROUTINE: RoutineModel = {
	id: '',
	uid: '',
	name: '',
	description: '',
	active: false,
	added: Timestamp.now(),
	modified: Timestamp.now(),
};

export const createRoutineModel = (name: string, description: string) => {
	const routine: RoutineModel = {
		id: '',
		uid: getCurrentUid(),
		name: name,
		description: description,
		active: true,
		added: Timestamp.now(),
		modified: Timestamp.now(),
	};

	return routine;
};

class RoutineController {
	public static async getAll(user: UserModel) {
		const results = await RoutineDao.getAll(user.uid);

		const routines: RoutineModel[] = [];
		results.forEach((result) => {
			const routineModel = this.getRoutineFromData(result);
			routines.push(routineModel);
		});

		return routines;
	}

	public static async create(routine: RoutineModel) {
		const results = await RoutineDao.create(routine);
		routine.id = results.id;

		return routine;
	}

	public static async update(routine: RoutineModel) {
		await RoutineDao.create(routine);
		return routine;
	}

	private static getRoutineFromData(data: DocumentSnapshot<DocumentData>): RoutineModel {
		let routine: RoutineModel = data.data() as RoutineModel;
		routine.id = data.id;

		return routine;
	}
}
export default RoutineController;
