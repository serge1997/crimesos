import { Container } from "./Container";

export default{
    install(app) {
        const container = Container.app();
        const Api = container.get('Api');
        app.config.globalProperties.spappBaseUrl = "http://127.0.0.1:8000/api";
        app.config.globalProperties.Api = Api;
        app.config.globalProperties.Notify = container.get('Notify');
    }
}