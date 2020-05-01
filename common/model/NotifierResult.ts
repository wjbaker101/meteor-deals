export interface NotifierResultEmailStatus {
    emailAddress: string,
    isSuccess: boolean,
    failureReason?: string,
}

export interface NotifierResult {
    dealID: string,
    results: NotifierResultEmailStatus[],
}