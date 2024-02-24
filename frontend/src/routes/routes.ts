import { TEST_PAGE_PATH, TEST_RESULTS_PAGE_PATH } from "../@types/consts/consts";
import { IRoute } from "../@types/interfaces/IRoute";
import TestResults from "../components/pages/TestResults";
import TestScenarios from "../components/pages/TestScenarios";

export const routes: IRoute[] = [
    { path: TEST_PAGE_PATH, page: TestScenarios },
    { path: TEST_RESULTS_PAGE_PATH, page: TestResults }
]