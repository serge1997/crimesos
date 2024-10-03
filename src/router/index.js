import { createRouter, createWebHistory } from "vue-router";

import Login from "@/components/Page/Register/Login.vue";
import Home from "@/components/Page/Home.vue";

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;