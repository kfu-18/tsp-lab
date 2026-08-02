console.log("TSP Lab start");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
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

function distance(city1, city2) {
    const dx = city1.x - city2.x;
    const dy = city1.y - city2.y;
    return Math.sqrt(dx*dx + dy*dy);
}

function totalDistance(route) {
    let total = 0;
    for (let i = 0; i < route.length - 1; i++) {
        total += distance(route[i], route[i+1]);
    }
    total += distance(route[route.length - 1], route[0]);
    return total;
}

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

            drawRoute(route, "gray");
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

        drawRoute(result.route, "red");
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

function nextFrame() {
    return new Promise((resolve) => {
        requestAnimationFrame(resolve);
    });
}

/*
	描画用の関数
*/

function drawCity(city) {
    ctx.beginPath();
    ctx.fillStyle = "black"
    ctx.arc(city.x, city.y, 5, 0, Math.PI * 2);
    ctx.fill();
}

function drawCities(cities) {
    for (const city of cities) {
        drawCity(city);
    }
}

function drawRoute(route, color) {
    clearCanvas();
    ctx.strokeStyle = color;
    drawPath(route);
    drawCities(route);
}

function drawPath(route) {
    ctx.beginPath();
    ctx.moveTo(route[0].x, route[0].y);

    for (let i = 1; i < route.length; i++) {
        ctx.lineTo(route[i].x, route[i].y);
    }

    ctx.lineTo(route[0].x, route[0].y);
    ctx.stroke();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}