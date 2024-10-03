<template>
   <div class="container-fluid">
        <div class="row min-vh-100 d-flex align-items-center">
            <div class="col-md-10 m-auto">
                <div class="row d-flex flex-column justify-content-center align-items-center gap-3">
                    <div class="col-md-4">
                        <Button class="w-100" label="SOS Vole" />
                    </div>
                    <div class="col-md-4">
                        <SOSAgressionComponent />
                    </div>
                    <div class="col-md-4">
                        <Button class="w-100" label="SOS Incendie" />
                    </div>
                </div>
            </div>
        </div>
   </div>
</template>

<script>
import SOSAgressionComponent from '../SOSAgressionComponent.vue';
export default {
  name: 'Home',

  components: {
    SOSAgressionComponent
  },
  mounted(){
    
  }
}
</script>

<style>

</style>
