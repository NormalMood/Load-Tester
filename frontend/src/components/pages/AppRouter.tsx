import { Routes, Route, Navigate } from 'react-router-dom';
import Main from '../layout/Main/Main';
import { routes } from '../../routes/routes';

const AppRouter = () => {
    return (
        <Routes>
            <Route key={'main'} element={<Main />}>
            {routes.map(route =>
                <Route key={route.path} path={route.path} element={ <route.page /> } />)}
            </Route>
            <Route path='*' element={ <Navigate to='/test' /> } />
        </Routes>
    )
}

export default AppRouter;