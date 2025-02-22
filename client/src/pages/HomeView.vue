<template>
    <div class="home-page h-screen relative">
       <div id="map" class="h-full z-[1]"></div>
    </div>
</template>

<script>
import leaflet, { PolyUtil } from 'leaflet'
import { onMounted, ref } from 'vue';

export default {
    name: "HomeView",
    setup() {
        let map;
        onMounted(() => {
            map = leaflet.map = L.map('map').setView([50.45000, 30.52333], 10);

            leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', 
            {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                accessToken: import.meta.env.CLIENT_APP_API_KEY,
            })
            .addTo(map);

            getGeolocation();
        })
        
        const coords = ref(null);
        const fetchCoords = ref(null);
        const marker = ref(null);

        const getGeolocation = () => {
            fetchCoords.value = true;
            navigator.geolocation.getCurrentPosition(setCoords, getLocError)
        }

        const setCoords = (pos) => {
            fetchCoords.value = null;

            const setSessionCoords = {
                lat: pos.coords.latitude,
                lng: pos.coors.longitude
            };

            sessionStorage.setItem("coords", JSON.stringify(setSessionCoords));

            coords.value = setSessionCoords;

            plotGeolocation(coords,value);
        };

        const getLocError = (e) => {
            console.log(e)
        };

        const plotGeolocation = (coords) => {
            const customMarket = leaflet.icon({
                iconUrl: require('../assets/map-marker-red.svg'),
                iconSize: [35, 35]
            })

            geoMarker.value = leaflet.marker([coords.lat, coords.lng], {icon: customMarket})
            .addTo(map)
        }
        return {coords, geoMarker}
    }
}
</script>
