export interface Deal {
    id: string,
    title: string,
    categories: string[],
    startDate: Date,
    endDate: Date,
    description: string,
    url: string,
    isHot: boolean,
}
