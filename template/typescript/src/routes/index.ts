import Home from 'Container/home';
import About from 'Pages/about';

export default [
    {
        exact: true,
        path: '/',
        component: Home
    },
    {
        path: '/login',
        component: About,
        routes: [
            // {
            //     exact: true,
            //     path: '/about/bus',
            //     component: Bus
            // },
            // {
            //     exact: true,
            //     path: '/about/taxi',
            //     component: Taxi
            // }
        ]
    }
];
