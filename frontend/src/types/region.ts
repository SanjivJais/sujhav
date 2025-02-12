export interface IRegion {
    id: string
    createdBy: string
    regionName: string
    createdAt: string
    updatedAt: string
}

export interface ICreateRegion {
    createdBy: string
    regionName: string
}