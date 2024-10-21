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
                        <div id="neighbourhood-inputbox" class="w-100 d-none mt-2 d-flex flex-column">
                            <InputText class="w-75" placeholder="le nom du quartier" v-model="addressFinded.neighbourhood" />
                            <small class="text text-danger">informez le nom du quartier</small>
                        </div>
                    </div>
                    <div class="col-md-10 d-flex flex-column mb-2">
                        <label for="" class="form-label">Zone</label>
                        <Chip class="p-0 w-auto">
                            <span style="width: 2rem; height: 2rem;" class="rounded-circle d-flex align-items-center justify-content-center"><i class="pi pi-chevron-circle-right"></i></span>
                            <span class="px-3">{{addressFinded.sector}}</span>
                        </Chip>
                    </div>
                    <div id="sector-inputbox" class="w-100 d-none mt-2 d-flex flex-column">
                        <InputText class="w-75" placeholder="le nom du quartier" v-model="addressFinded.sector" />
                        <small class="text text-danger">informez le nom du secteur</small>
                    </div>
                    <div class="col-md-10 d-flex flex-column mb-2">
                        <label for="" class="form-label">Rue</label>
                        <Chip class="p-0 w-auto">
                            <span style="width: 2rem; height: 2rem;" class="rounded-circle d-flex align-items-center justify-content-center"><i class="pi pi-chevron-circle-right"></i></span>
                            <span class="px-3">{{addressFinded.street_name}}</span>
                        </Chip>
                    </div>
                    <div id="streetName-inputbox" class="w-100 d-none mt-2 d-flex flex-column mb-2">
                        <InputText class="w-75" placeholder="le nom du quartier" v-model="addressFinded.street_name" />
                        <small class="text text-danger">informez le nom de la rue</small>
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
                street_name: null,
                sector: null,
                number: null,
                addressResume: null,
                complement: null,
                alert_description: null,
                city: null,
                origin: "Agent spapp",
                latitude: null,
                longitude: null,
            },
            confirm: useConfirm()
        }
    },
    methods: {
        onDraggend(marker){
            const geoData = marker.target._latlng;
            console.log(marker.target._latlng)
            this.loadLatLngAddress(geoData.lat, geoData.lng);
            this.addressFinded.latitude = marker.target._latlng.lat;
            this.addressFinded.longitude = marker.target._latlng.lng;

        },
        loadLatLngAddress(lat, lng){
            this.axios.get(this.apiUrl + `lat=${lat}&lon=${lng}`)
            .then(async response => {
                const toJson= xml2js(response.data);
                let neighbourhoodInput = document.getElementById('neighbourhood-inputbox');
                let sectorInput = document.getElementById('sector-inputbox');
                let streetNameInput = document.getElementById('streetName-inputbox');
                this.addressFinded.address = toJson.elements[0].elements;
                this.addressFinded.addressResume = this.addressFinded.address[0].elements[0].text;
                const allAddress = this.addressFinded.address[1].elements;
                this.addressFinded.street_name = null;
                this.addressFinded.neighbourhood = null;
                this.addressFinded.sector = null;
                this.addressFinded.municipality = null;
                for(let add of allAddress){
                    if (add.name == 'road'){
                        streetNameInput.classList.add('d-none');
                        this.addressFinded.street_name = add.elements[0].text
                    }
                    if (add.name == 'suburb'){
                        neighbourhoodInput.classList.add('d-none')
                        this.addressFinded.neighbourhood = add.elements[0].text
                    }

                    if (add.name == 'neighbourhood'){
                        sectorInput.classList.add('d-none')
                        this.addressFinded.sector = add.elements[0].text
                    }
                    if (add.name == 'city'){
                        this.addressFinded.municipality = add.elements[0].text
                    }
                    if (add.name == 'state'){
                        this.addressFinded.city = add.elements[0].text
                    }
                }
                if (this.addressFinded.neighbourhood == null){
                    neighbourhoodInput.classList.remove('d-none')
                }
                if (this.addressFinded.street_name == null){
                    sectorInput.classList.remove('d-none')
                }
                if (this.addressFinded.sector == null){
                    streetNameInput.classList.remove('d-none')
                }
                if (this.addressFinded.addressResume.includes('Plateau')){
                    this.addressFinded.municipality = 'Plateau';
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
                    try{
                        console.log(this.addressFinded);
                        this.validateForm();
                        this.Api.post(`${this.spappBaseUrl}/v1/address`, this.addressFinded)
                        .then(async response => {
                            this.Notify.success(await response.data.message);
                        }).catch(error => {
                            console.log(error);
                        })
                    }catch(error){
                        this.Notify.error(error.message)
                    }
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
        },
        validateForm(){
            if (!this.addressFinded.neighbourhood){
                throw new Error("Le quartier est obligatoire");
            }
            if (this.addressFinded.street_name == null && this.addressFinded.sector == null){
                throw new Error("Informez le nom de la rue ou le secteur pour continuer");
            }
        }
    },
    mounted(){
        
    }
}
</script>