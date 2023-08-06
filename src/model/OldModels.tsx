import { Timestamp } from 'firebase/firestore';
import { Comment, Like, Image, User } from 'resources/schema';
import { TimelineType } from 'resources/types/Types';
import { CompletedHabit } from 'resources/types/planned_day_result/PlannedDayResult';

export interface TimelinePostModel {
    user: User;
    type: TimelineType;
    id: number;
    sortDate: Date;

    comments: Comment[];
    likes: Like[];
    images: Image[];
    title?: string;
    body?: string;
    // experience points
    // completed habits
    completedHabits?: CompletedHabit[];
    // banner

    secondaryText?: string;
    data: {};
}

export interface UserProfileModel {
    uid?: string;
    name?: string;
    nameLower?: string;
    username?: string;
    email?: string;
    photoUrl?: string;
    bannerUrl?: string;
    bio?: string;
    location?: string;
    level?: number;
}

export interface QuoteOfTheDayModel {
    id?: string;
    uid: string;
    quote: string;
    author: string;
    likes: string[];
    added: Timestamp;
}

export interface QuoteOfTheDayMetadata {
    activeId: string;
    updated: Timestamp;
    history: string[];
}
