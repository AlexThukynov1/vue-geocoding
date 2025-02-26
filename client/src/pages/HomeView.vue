<template>
    <div class="home-page h-screen relative">
        <ErrorModalGeolocation
            v-if="geoError"
            :geoErrorMessage="geoErrorMessage"
            @closeModal="handleGeoErrorStatus"
        />
        <MapFeatures
            :coords="coords"
            :fetchCoords="fetchCoords"
            @getGeolocation="getGeolocation"
        />
       <div id="map" class="h-full z-[1]"></div>
    </div>
</template>

<script>
import leaflet from 'leaflet'
import { onMounted, ref } from 'vue';
import customMarkerRed from '../assets/map-marker-red.svg';
import ErrorModalGeolocation from '../components/ErrorModalGeolocation.vue';
import MapFeatures from '../components/MapFeatures.vue';

export default {
  components: { ErrorModalGeolocation,MapFeatures },
    name: "HomeView",
    setup() {
        let map;
        onMounted(() => {
            map = leaflet.map('map').setView([50.45000, 30.52333], 10);

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
        const geoError = ref(false);
        const geoErrorMessage = ref('')

        const getGeolocation = () => {
            if (coords.value) {
                coords.value = null;
                sessionStorage.removeItem("coords")
                map.removeLayer(marker.value);
                return;
            }

            if(sessionStorage.getItem('coords')) {
                coords.value = JSON.parse(sessionStorage.getItem("coords"));
                plotGeolocation(coords.value);
            } else {
                fetchCoords.value = true;
                navigator.geolocation.getCurrentPosition(setCoords, getLocError)
            }

           
        }

        const setCoords = (pos) => {
            fetchCoords.value = null;

            const setSessionCoords = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };

            sessionStorage.setItem("coords", JSON.stringify(setSessionCoords));

            coords.value = setSessionCoords;

            plotGeolocation(coords.value);
        };

        const getLocError = (e) => {
            fetchCoords.value = null;
            geoError.value = true;
            geoErrorMessage.value = e.message;
        };

        const plotGeolocation = (coords) => {
            const customMarket = leaflet.icon({
                iconUrl: customMarkerRed,
                iconSize: [35, 35]
            })

            marker.value = leaflet.marker([coords.lat, coords.lng], {icon: customMarket})
            .addTo(map);

            map.setView([coords.lat, coords.lng], 15);
            
        }

        const closeGeoError = () => {
            geoError.value = false;
            geoErrorMessage.value = null;
        }

        const handleGeoErrorStatus = (status) => {
            geoError.value = status
        }

        return {coords, marker, fetchCoords, closeGeoError, geoError,geoErrorMessage, getGeolocation, handleGeoErrorStatus}
    }
}
</script>
