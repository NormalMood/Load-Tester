import { SETTINGS_PAGE_PATH, TEST_PAGE_PATH, TEST_RESULTS_PAGE_PATH } from "../@types/consts/pagesPaths";
import { IRoute } from "../@types/interfaces/IRoute";
import TestResults from "../components/pages/TestResults";
import TestScenarios from "../components/pages/TestScenarios";
import Settings from '../components/pages/Settings'

export const routes: IRoute[] = [
    { path: TEST_PAGE_PATH, page: TestScenarios },
    { path: TEST_RESULTS_PAGE_PATH, page: TestResults },
    { path: SETTINGS_PAGE_PATH, page: Settings }
]