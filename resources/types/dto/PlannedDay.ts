import { PlannedDayResult } from '../../schema';
import { Constants } from '../constants/constants';
import { PureDate } from '../date/PureDate';

export interface PlannedDayCompletionStatus {
    dayKey: string;
    date: PureDate;
    status: Constants.CompletionState;
}

export interface PlannedDayAttribute {
    body: string;
    remoteImageUrl?: string;
    localImage?: string;
}

export interface PlannedDayTimelineElementDto extends PlannedDayResult {
    attribute?: PlannedDayAttribute;
}
