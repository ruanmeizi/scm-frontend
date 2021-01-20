import vue from 'vue';
import Router from 'Router';
import routes from "./config";

vue.use(Router);

const router = new Router({
	mode: 'history',
	routes
});

router.beforeEach((to, from, next) => {
	if(to.path == "/main" || to.path == "/register") {
		next();
	} else {
		if(localStorage.token) {
			next();
		} else {
			next();
		}
	}
});

export default router;