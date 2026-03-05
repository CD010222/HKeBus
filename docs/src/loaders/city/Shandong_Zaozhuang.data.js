import fs from 'node:fs';
import { parse } from 'csv-parse/sync';

const dataPath = './data/city/Shandong_Zaozhuang';
const indexURL = `${dataPath}/index.csv`;
const trajectoryURL = `${dataPath}/trajectory.json`;

function calculateCenter(trajectory) {
    let minLng = Infinity, maxLng = -Infinity;
    let minLat = Infinity, maxLat = -Infinity;
    
    trajectory.forEach(track => {
        if (track.path && Array.isArray(track.path)) {
            track.path.forEach(point => {
                const [lng, lat] = point;
                minLng = Math.min(minLng, lng);
                maxLng = Math.max(maxLng, lng);
                minLat = Math.min(minLat, lat);
                maxLat = Math.max(maxLat, lat);
            });
        }
    });
    
    const centerLng = (minLng + maxLng) / 2;
    const centerLat = (minLat + maxLat) / 2;
    
    return [centerLng, centerLat];
}

function calculateTimeRange(index) {
    let maxTime = 0;
    
    index.forEach(row => {
        if (row.e_time > maxTime) {
            maxTime = row.e_time;
        }
    });
    
    return maxTime;
}

export default {
    watch: [indexURL, trajectoryURL],
    load() {
        const index = parse(fs.readFileSync(indexURL, 'utf8'), {
            columns: true,
            cast: (value, context) => {
                if (!isNaN(value)) {
                    return parseInt(value, 10);
                }
                return value;
            }
        });

        const trajectory = JSON.parse(fs.readFileSync(trajectoryURL, 'utf8'));
        
        const center = calculateCenter(trajectory);
        const loopLength = calculateTimeRange(index);

        return { index, trajectory, center, loopLength };
    },
};
