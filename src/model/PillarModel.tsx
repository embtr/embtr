import { Timestamp } from "firebase/firestore";

export interface PillarModel {
    id?: string,
    name: string,
    active: boolean,
    added: Timestamp
}