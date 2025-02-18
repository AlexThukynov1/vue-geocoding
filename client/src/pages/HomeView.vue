<template>
    <div class="home-page h-screen relative">
       <div id="map" class="h-full z-[1]"></div>
    </div>
</template>

<script>
import leaflet from 'leaflet'
import { onMounted } from 'vue';

export default {
    name: "HomeView",
    setup() {
        let map;
        onMounted(() => {
            map = leaflet.map = L.map('map').setView([50.45000, 30.52333], 10);
        })
    }
}
</script>
