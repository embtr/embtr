import { Timestamp } from 'firebase/firestore';

export interface PillarModel {
    id?: string;
    uid: string;
    name: string;
    active: boolean;
    added: Timestamp;
    timestamp?: Timestamp; //deprecated
    deprecatedKey?: string;
}

export const FAKE_PILLAR: PillarModel = {
    uid: '',
    name: '',
    active: true,
    added: Timestamp.now(),
};
