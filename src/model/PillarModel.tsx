import { Timestamp } from "firebase/firestore";

export interface PillarModel {
    name: string,
    active: boolean,
    added: Timestamp
}