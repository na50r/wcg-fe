function pathToRegex(path) {
    return new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "([^\\/]+)") + "$");
}

function getParams(match) {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);
    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }))
}



export default class Router {
    constructor(routes)
    {
        this.routes = routes;
        // To prevent losing access to "this"
        this.navigate = this.navigate.bind(this);
    }

    async navigate() {
        const potentialMatches = this.routes.map(route => {
            const path = location.pathname
            return { route: route, result: path.match(pathToRegex(route.path)) }
        });
        let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);
        if (!match) {
            match = {
                route: this.routes[0],
                result: [location.pathname]
            }
            return;
        }
        const view = new match.route.view(getParams(match));
        const container = await view.getHtml();
        const app = document.querySelector("#app");
        if (!app) return;
        app.replaceChildren(container);
    }

    start() {
        window.addEventListener("popstate", this.navigate);
        window.addEventListener("load", this.navigate);
        document.addEventListener("DOMContentLoaded", this.navigate);
    }

    navigateTo(url) {
        history.pushState(null, "", url);
        this.navigate();
    }
}