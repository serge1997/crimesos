import { createApp } from 'vue'
import App from './App.vue'
import VueAxios from 'vue-axios';
import axios from 'axios';
import router from './router';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import Chip from 'primevue/chip';
import Badge from 'primevue/badge';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import ConfirmationService from 'primevue/confirmationservice';
import Provider from './app/Service/Provider.mjs';


const app = createApp(App);

app.component('Button', Button)
app.component('Dialog', Dialog);
app.component('LMap', LMap);
app.component('LTileLayer', LTileLayer);
app.component('LMarker', LMarker);
app.component('Badge', Badge);
app.component('Chip', Chip);
app.component('Textarea', Textarea);
app.component('InputText', InputText);
app.component('ConfirmDialog', ConfirmDialog)
app.component('Toast', Toast);
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

app.use(router)
    .use(PrimeVue)
    .use(VueAxios, axios)
    .use(ConfirmationService)
    .use(Provider)
    .use(ElementPlus)
    .mount('#app')
