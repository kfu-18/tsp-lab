import { totalDistance } from "./utils/distance.js";
import { sleep, nextFrame } from "./utils/wait.js";
import { createRenderer } from "./utils/renderer.js";

console.log("TSP Lab start");

const canvas = document.getElementById("canvas");
const renderer = createRenderer(canvas);
const cityCountElement = document.getElementById("city-count");
const statusElement = document.getElementById("status");
const distanceElement = document.getElementById("result-distance");

const MAX_CITIES = 11;

let cities = [];
let isCalculating = false;

async function main() {
    cities = await loadCities();
    cityCountElement.textContent = cities.length;

    if (cities.length > MAX_CITIES) {
        throw new Error(`都市データは最大${MAX_CITIES}件までです`);
    }

    await calculateAndDraw();
}

main();

function allPermutations(cities) {
    if (cities.length === 0) {
        return [[]];
    }

    const result = [];

    for (let i = 0; i < cities.length; i++) {
        const head = cities[i];
        const rest = cities.filter((_, index) => index !== i);

        const perms = allPermutations(rest);
        
        for (const perm of perms) {
            result.push([head, ...perm]);
        }
    }
    return result;
}

async function solveBruteForce(routes) {
    let bestDistance = Infinity;
    let bestRoute = null;

    for (const route of routes) {

        const d = totalDistance(route);
        
        if (d < bestDistance) {
            bestDistance = d;
            bestRoute = route;

            renderer.drawRoute(route, "gray");
            await sleep(50);
        }
    }
    return {
        route: bestRoute,
        distance: bestDistance
    };
}

/*
	共通関数
*/

async function loadCities() {
    const response = await fetch("./data/cities.json");

    if(!response.ok) {
        throw new Error(`都市データの取得に失敗しました: ${response.status}`);
    }

    const data = await response.json();

    return data.cities;
}

async function calculateAndDraw() {
    if (isCalculating) {
        return;
    }

    isCalculating = true;
    try{
        statusElement.textContent = "計算中...";
        distanceElement.textContent = "-";
        
        await nextFrame();
        
        const start = cities[0];
        const routes =
            allPermutations(cities.slice(1))
            .map(route => [start, ...route]);

        const result = await solveBruteForce(routes);

        renderer.drawRoute(result.route, "red");
        distanceElement.textContent = result.distance.toFixed(2);
        statusElement.textContent = "計算完了"
    } catch (error) {
        console.error(error);
        statusElement.textContent = "計算エラー";
        distanceElement.textContent = "-";
    } finally {
        isCalculating = false;
    }
}

canvas.addEventListener("click", async (event) => {
    if (isCalculating) {
        return;
    }

    if (cities.length >= MAX_CITIES) {
        alert(`都市は最大${MAX_CITIES}個までです`);
        return;
    }

    const rect = canvas.getBoundingClientRect();

    const x =
        (event.clientX - rect.left) *
        (canvas.width / rect.width);

    const y =
        (event.clientY - rect.top) *
        (canvas.height / rect.height);

    cities.push({ x, y });
    await nextFrame();
    cityCountElement.textContent = cities.length;
    statusElement.textContent = "計算中...";
    
    await calculateAndDraw();
});