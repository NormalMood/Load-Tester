import { IThreadGroup } from "../@types/interfaces/IThreadGroup"

export const getNewThreadGroupName = (threadGroups: IThreadGroup[]) => `Тестовый сценарий ${threadGroups.length + 1}`