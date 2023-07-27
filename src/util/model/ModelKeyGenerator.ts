import { PlannedDayResult, PlannedTask, User, UserPost } from 'resources/schema';

export class ModelKeyGenerator {
    public static generatePlannedDayResultKey(plannedDayResult: PlannedDayResult): string {
        let tasksKey = '';
        if (plannedDayResult.plannedDay?.plannedTasks) {
            for (const plannedTask of plannedDayResult.plannedDay.plannedTasks) {
                tasksKey += ModelKeyGenerator.generatePlannedTaskKey(plannedTask);
            }
        }

        return `${plannedDayResult.id}
        ${plannedDayResult.description}
        ${plannedDayResult.likes?.length}
        ${plannedDayResult.comments?.length}
        ${plannedDayResult.images?.length}
        ${tasksKey}`;
    }

    public static generateUserPostKey(userPost: UserPost): string {
        return `${userPost.id}
        ${userPost.title}
        ${userPost.body}
        ${userPost.likes?.length}
        ${userPost.comments?.length}}`;
    }

    public static generatePlannedTaskKey(plannedTask: PlannedTask): string {
        return `${plannedTask.id}${plannedTask.updatedAt?.toISOString()}`;
    }

    public static generateUserKey(user: User): string {
        return `${user.id}${user.displayName}`;
    }
}
