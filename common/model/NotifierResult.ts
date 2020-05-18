export interface NotifierResultEmailStatus {
    emailAddress: string,
    isSuccess: boolean,
    failureReason?: string,
}

export interface NotifierResult {
    timestamp: number,
    dealIDs: string[],
    results: NotifierResultEmailStatus[],
}