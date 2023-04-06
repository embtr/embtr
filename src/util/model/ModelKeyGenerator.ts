import { PlannedDayResult, UserPost } from 'resources/schema';

export class ModelKeyGenerator {
    public static generatePlannedDayResultKey(plannedDayResult: PlannedDayResult): string {
        return `${plannedDayResult.id}
        ${plannedDayResult.description}
        ${plannedDayResult.likes?.length}
        ${plannedDayResult.comments?.length}}`;
    }

    public static generateUserPostKey(userPost: UserPost): string {
        return `${userPost.id}
        ${userPost.title}
        ${userPost.body}
        ${userPost.likes?.length}
        ${userPost.comments?.length}}`;
    }
}
