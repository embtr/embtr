import { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import RoutineDao from 'src/firebase/firestore/routine/RoutineDao';
import { UserModel } from '../user/UserController';

export interface RoutineModel {
	id: string;
	uid: string;
	name: string;
	description: string;
	active: boolean;
}

export const FAKE_ROUTINE: RoutineModel = {
	id: '',
	uid: '',
	name: '',
	description: '',
	active: false,
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

	private static getRoutineFromData(data: DocumentSnapshot<DocumentData>): RoutineModel {
		let routine: RoutineModel = data.data() as RoutineModel;
		routine.id = data.id;

		return routine;
	}
}

export default RoutineController;
