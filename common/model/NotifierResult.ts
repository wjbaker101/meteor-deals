export interface NotifierResultEmailStatus {
    emailAddress: string,
    isSuccess: boolean,
    failureReason?: string,
}

export interface NotifierResult {
    dealIDs: string[],
    results: NotifierResultEmailStatus[],
}