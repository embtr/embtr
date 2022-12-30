import { DocumentData, DocumentSnapshot, Timestamp } from 'firebase/firestore';
import RoutineHabitDao from 'src/firebase/firestore/routine/RoutineHabitDao';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { FAKE_HABIT, TaskModel } from '../planning/TaskController';
import { RoutineModel } from './RoutineController';

export interface RoutineHabitModel {
	id: string;
	uid: string;
	routineId: string;
	habit: TaskModel;
	startMinute: number;
	duration: number;
	active: boolean;
	added: Timestamp;
	modified: Timestamp;
}

export const FAKE_ROUTINE_HABIT: RoutineHabitModel = {
	id: '',
	uid: '',
	routineId: '',
	habit: FAKE_HABIT,
	startMinute: 0,
	duration: 0,
	active: false,
	added: Timestamp.now(),
	modified: Timestamp.now(),
};

export const createRoutineHabitModels = (routine: RoutineModel, habits: TaskModel[]): RoutineHabitModel[] => {
	const routineHabitModels: RoutineHabitModel[] = [];
	for (const habit of habits) {
		const routineHabitModel = createRoutineHabitModel(routine, habit);
		routineHabitModels.push(routineHabitModel);
	}

	return routineHabitModels;
};
export const createRoutineHabitModel = (routine: RoutineModel, habit: TaskModel): RoutineHabitModel => {
	const routineHabit: RoutineHabitModel = {
		id: '',
		uid: getCurrentUid(),
		routineId: routine.id,
		habit: habit,
		startMinute: 0,
		duration: 0,
		active: true,
		added: Timestamp.now(),
		modified: Timestamp.now(),
	};

	return routineHabit;
};

class RoutineHabitController {
	public static async getAllInRoutine(routine: RoutineModel) {
		const results = await RoutineHabitDao.getAllInRoutine(routine.id);

		const routineHabits: RoutineHabitModel[] = [];
		results.forEach((result) => {
			const routineHabit: RoutineHabitModel = this.getRoutineHabitFromData(result);
			routineHabits.push(routineHabit);
		});

		return routineHabits;
	}

	public static async create(routineHabit: RoutineHabitModel) {
		const results = await RoutineHabitDao.create(routineHabit);
		routineHabit.id = results.id;

		return routineHabit;
	}

	public static async createAll(routineHabits: RoutineHabitModel[]) {
		const createdRoutineHabits: RoutineHabitModel[] = [];

		for (const routineHabit of routineHabits) {
			const createdRoutineHabit = await this.create(routineHabit);
			createdRoutineHabits.push(createdRoutineHabit);
		}

		return createdRoutineHabits;
	}

	private static getRoutineHabitFromData(data: DocumentSnapshot<DocumentData>): RoutineHabitModel {
		let routineHabit: RoutineHabitModel = data.data() as RoutineHabitModel;
		routineHabit.id = data.id;

		return routineHabit;
	}
}

export default RoutineHabitController;
