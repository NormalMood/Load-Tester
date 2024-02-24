import { IRoute } from "../@types/interfaces/IRoute";
import TestResults from "../components/pages/TestResults";
import TestScenarios from "../components/pages/TestScenarios";

export const routes: IRoute[] = [
    { path: '/test', page: TestScenarios },
    { path: '/results', page: TestResults }
]