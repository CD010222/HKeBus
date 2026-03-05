<template>
    <ControlPanel
    :updateFn="updateTime"
    :loopLength="loopLength"
    :timeConvertFn="updateTimeString"
    :showVloume="true"
    >
    <div class="legend" id="legend">
          <div class="legend-item">
              <div class="legend-color" style="background-color: rgb(23, 184, 190);"></div>
              <span>Bus</span>
          </div>
          <div class="legend-item">
              <div class="legend-color" style="background-color: rgb(253, 128, 93);"></div>
              <span>Minibus</span>
          </div>
      </div>
  </ControlPanel>
  <MapComponent
      :center="center"
      :zoom="11"
      width="100%"
      height="80vh"
      @map-loaded="handleMapLoaded"
  />
</template>

<script setup>
import ControlPanel from '@/components/TimeControl.vue';

import { onUnmounted} from 'vue';
import MapComponent from '@/components/map.vue';
import { useDeckOverlay } from '@/composables/useDeckOverlay.js';
import { TripsLayer } from '@deck.gl/geo-layers';

import pkg from 'lodash';
const { throttle } = pkg;

import MyWorker from '@/workers/worker.js?worker';
import { data as myData} from '@/loaders/city/Shanxi_Xinzhou.data.js';

const worker = new MyWorker();

const center = myData.center;
const loopLength = myData.loopLength;

worker.postMessage({ type: 'INITIALIZE_DATA', data: myData });

let deckMap = null;
let data = null;

const BLUE = [23, 184, 190];
const RED = [253, 128, 93];

async function generateTrajectoryDataForRows(timestamp) {
  worker.postMessage({ type: 'GENERATE_TRAJECTORY', timestamp });
  return new Promise((resolve, reject) => {
      worker.onmessage = function(e) {
          const { type, data, error } = e.data;

          if (type === 'TRAJECTORY_DATA') {
              resolve(data);
          } else {
              reject(error);
          }
      };
  });
}

function createTripsLayer(data, currentTime) {
  return new TripsLayer({
      id: 'trips',
      data,
      getPath: d => d.path,
      getTimestamps: d => d.timestamps,
      getColor: d => (d.vendor === 0 ? RED : BLUE),
      opacity: 0.5,
      widthMinPixels: 3,
      rounded: true,
      trailLength: 80,
      currentTime,
  });
}

async function updateTime(newTime) {
  data = await generateTrajectoryDataForRows(newTime);
  const newLayer = createTripsLayer(data, newTime);

  deckMap.setProps({
      layers: [newLayer],
  });

  return data.length;
}

async function handleMapLoaded(map) {
  deckMap = useDeckOverlay(map);
  data = await generateTrajectoryDataForRows(0);
  const tripsLayer = createTripsLayer(data, 0);
  deckMap.setProps({
      layers: [tripsLayer],
  });
}

onUnmounted(() => {
  worker.terminate();
});

function time_convert_reverse(x, min=1726617600) {
  return new Date((x + min) * 1000);
}

function updateTimeString(currentTime) {
  return time_convert_reverse(currentTime).toUTCString();
}

</script>


<style scoped>

#time-slider {
  width: 100%;
  margin-top: 10px;
}

#control-panel {
position: absolute;
bottom: 0;
left: 0;
margin: 12px;
padding: 20px;
z-index: 1;
border: 1px solid var(--vp-c-border);
border-radius: 5px;
box-shadow: var(--vp-shadow-1);
backdrop-filter: blur(18px);
width: 25%;
}

#legend {
  background-color: var(---vp-c-bg-soft);
  padding: 10px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  z-index: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  color: var(--vp-c-text-1);
}

.legend-color {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 50%;
}

#play-btn{
  border: 1px solid var(--vp-c-border);
  border-radius: 5px;
  width: 100px;
  margin: 5px;
  padding: 5px;
}

#play-btn:hover{
  background-color: var(--vp-c-bg-soft);
}
</style>
