<template>
    <Button @click="visibleSosAgression = true" class="w-100" label="SOS Agression" />
    <Dialog v-model:visible="visibleSosAgression" maximizable header="Edit Profile" :style="{ width: '100%' }"  :modal="true" :draggable="false">
        <div class="row">
            <div class="col-md-6 mb-3">
               <div class="row">
                    <div class="col-md-10 d-flex flex-column mb-2">
                        <label for="" class="form-label">Commune</label>
                        <Chip class="p-0 w-auto">
                            <span style="width: 2rem; height: 2rem;" class="rounded-circle d-flex align-items-center justify-content-center"><i class="pi pi-chevron-circle-right"></i></span>
                            <span class="px-3">{{addressFinded.municipality}}</span>
                        </Chip>
                    </div>
                    <div class="col-md-10 d-flex flex-column mb-2">
                        <label for="" class="form-label">Quartier</label>
                        <Chip class="p-0 w-auto">
                            <span style="width: 2rem; height: 2rem;" class="rounded-circle d-flex align-items-center justify-content-center"><i class="pi pi-chevron-circle-right"></i></span>
                            <span class="px-3">{{addressFinded.neighbourhood}}</span>
                        </Chip>
                    </div>
                    <div class="col-md-10 d-flex flex-column mb-2">
                        <label for="" class="form-label">Zone</label>
                        <Chip class="p-0 w-auto">
                            <span style="width: 2rem; height: 2rem;" class="rounded-circle d-flex align-items-center justify-content-center"><i class="pi pi-chevron-circle-right"></i></span>
                            <span class="px-3">{{addressFinded.sector}}</span>
                        </Chip>
                    </div>
                    <div class="col-md-10 d-flex flex-column mb-2">
                        <label for="" class="form-label">Rue</label>
                        <Chip class="p-0 w-auto">
                            <span style="width: 2rem; height: 2rem;" class="rounded-circle d-flex align-items-center justify-content-center"><i class="pi pi-chevron-circle-right"></i></span>
                            <span class="px-3">{{addressFinded.streetName}}</span>
                        </Chip>
                    </div>
                    <div class="col-md-10 d-flex flex-column mb-3">
                        <label for="" class="form-label">Resume de l'address</label>
                        <Chip class="p-0 w-auto">
                            <span style="width: 2rem; height: 2rem;" class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"><i class="pi pi-map-marker"></i></span>
                            <span class="px-3">{{addressFinded.addressResume}}</span>
                        </Chip>
                    </div>
                    <div class="col-md-10 d-flex flex-column mb-3">
                        <label for="" class="form-label">Complement</label>
                        <InputText v-model="addressFinded.complement" placeholder="complement de l'address" />
                    </div>
                    <div class="col-md-10 d-flex flex-column mt-2">
                        <label for="" class="form-label">Description</label>
                        <Textarea v-model="addressFinded.addressFinded" placeholder="donnez une breve description de l'alerte" />
                    </div>
                    <div class="col-md-10 d-flex flex-column mt-3 p-3">
                       <Button @click="sendAlerte" label="Envoyer l'alerte" />
                    </div>
               </div>
            </div>
            <div class="col-md-6">
                <div style="height: 500px; width: 100%">
                    <l-map v-model:zoom="zoom" :center="mapCenterLatLng">
                        <l-tile-layer
                            :url="url"
                            layer-type="base"
                            name="OpenStreetMap"
                        ></l-tile-layer>
                        <l-marker 
                            :lat-lng="initialMarkerLatLng"
                            :draggable="true" @moveend="onDraggend"
                        />
                    </l-map>
                </div>
            </div>
        </div>
    </Dialog>
    <ConfirmDialog>

    </ConfirmDialog>
</template>
<script>
import { latLng } from 'leaflet';
import { xml2js } from 'xml-js';
import { useConfirm } from 'primevue/useconfirm';

export default{
    name: 'SOSAgressionComponent',

    data(){
        return {
            zoom:13,
            visibleSosAgression: false,
            initialMarkerLatLng: latLng(5.3291, -4.0213),
            mapCenterLatLng: latLng(5.3291, -4.0213),
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            mapOptions: {
                zoomSnap: 0.5
            },
            apiUrl: "https://nominatim.openstreetmap.org/reverse?",
            addressFinded: {
                address: null,
                municipality: null,
                neighbourhood: null,
                streetName: null,
                sector: null,
                number: null,
                addressResume: null,
                complement: null,
                alert_description: null
            },
            confirm: useConfirm()
        }
    },
    methods: {
        onDraggend(marker){
            const geoData = marker.target._latlng;
            console.log(marker.target._latlng)
            this.loadLatLngAddress(geoData.lat, geoData.lng);

        },
        loadLatLngAddress(lat, lng){
            this.axios.get(this.apiUrl + `lat=${lat}&lon=${lng}`)
            .then(async response => {
                const toJson= xml2js(response.data);
                this.addressFinded.address = toJson.elements[0].elements;
                this.addressFinded.addressResume = this.addressFinded.address[0].elements[0].text;
                const allAddress = this.addressFinded.address[1].elements;
                this.addressFinded.streetName = null;
                this.addressFinded.neighbourhood = null;
                this.addressFinded.sector = null;
                this.addressFinded.municipality = null;
                for(let add of allAddress){
                    if (add.name == 'road'){
                        this.addressFinded.streetName = add.elements[0].text
                    }
                    if (add.name == 'suburb'){
                        this.addressFinded.neighbourhood = add.elements[0].text
                    }
                    if (add.name == 'neighbourhood'){
                        this.addressFinded.sector = add.elements[0].text
                    }
                    if (add.name == 'city'){
                        this.addressFinded.municipality = add.elements[0].text
                    }
                }
            })
        },
        sendAlerte(){
            this.confirm.require({
                message: "Confirmez l'envoi de l'alerte ?",
                header: 'Avis',
                icon: 'pi pi-exclamation-triangle',
                rejectLabel: 'Annuler',
                acceptLabel: 'Confirmer',
                accept: () => {
                    alert("accepted")
                },
                reject: () => {
                    setTimeout(() => {
                        this.UICancelAlert()
                    }, 200)
                }
            })
        },
        UICancelAlert(){
            console.log("hei")
            this.confirm.require({
                message: "Alerte annulée",
                header: 'Avis',
                icon: 'pi pi-times',
                rejectLabel: ' ',
                acceptLabel: 'Ok',
                reject: () => {
                    return false;
                }
            })
        }
    },
    mounted(){
        console.log(this.Api.get());
    }
}
</script>