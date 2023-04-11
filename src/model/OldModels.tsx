import { Timestamp } from 'firebase/firestore';

export interface Comment {
    uid: string;
    comment: string;
    timestamp: Timestamp;
}

export interface Like {
    uid: string;
    added: Timestamp;
}

export interface TimelinePostModel {
    id?: string;
    added: Timestamp;
    modified: Timestamp;
    type: string;
    uid: string;
    public: {
        comments: Comment[];
        likes: Like[];
    };
    data: {};
    active: boolean;
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
