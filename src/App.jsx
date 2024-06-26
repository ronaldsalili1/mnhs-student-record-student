import {
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Route,
} from 'react-router-dom';

// Layouts
import Basic from './layouts/Basic';
import Navigation from './layouts/Navigation';

import LoginPage from './containers/LoginPage/LoginPage';
import GradePage from './containers/GradePage/GradePage';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route element={<Basic />}>
                <Route
                    path="/"
                    element={<LoginPage/>}
                />
                <Route
                    path="login"
                    element={<LoginPage/>}
                />
            </Route>
            <Route element={<Navigation/>}>
                <Route
                    path="grades"
                    element={<GradePage/>}
                />
            </Route>
        </Route>,
    ),
    {
        basename: '/student',
    },
);

const App = () => {
    return (
        <RouterProvider router={router} />
    );
};

export default App;