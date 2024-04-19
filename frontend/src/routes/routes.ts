import { SERVER_PAGE_PATH, SETTINGS_PAGE_PATH, TEST_PAGE_PATH, TEST_RESULTS_PAGE_PATH } from "../@types/consts/pagesPaths";
import { IRoute } from "../@types/interfaces/IRoute";
import TestResults from "../components/pages/TestResults";
import TestScenarios from "../components/pages/TestScenarios";
import Settings from '../components/pages/Settings'
import Server from "../components/pages/Server";

export const routes: IRoute[] = [
    { path: TEST_PAGE_PATH, page: TestScenarios },
    { path: TEST_RESULTS_PAGE_PATH, page: TestResults },
    { path: SERVER_PAGE_PATH, page: Server },
    { path: SETTINGS_PAGE_PATH, page: Settings }
]