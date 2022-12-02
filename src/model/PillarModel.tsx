import { Timestamp } from 'firebase/firestore';

export interface PillarModel {
    id?: string;
    uid: string;
    name: string;
    active: boolean;
    added: Timestamp;
}
