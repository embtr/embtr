import { Timestamp } from "firebase/firestore";

export interface PillarModel {
    id?: string,
    name: string,
    active: boolean,
    added: Timestamp
}

export const FAKE_PILLAR: PillarModel = {
    added: Timestamp.now(),
    name: '',
    active: false
}