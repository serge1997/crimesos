import { Container } from "./Container";

export default{
    install(app) {
        const container = Container.app();
        const Api = container.get('Api');
        app.config.globalProperties.spappBaseUrl = "url_crime";
        app.config.globalProperties.Api = Api;
    }
}