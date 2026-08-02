console.log("TSP Lab start");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const distanceElement = document.getElementById("result-distance")

const cities = [
    { x: 120, y: 80  },
    { x: 200, y: 500 },
    { x: 200, y: 220 },
    { x: 430, y: 90  },
    { x: 620, y: 420 }, 
    { x: 320, y: 10  },
    { x: 400, y: 300 },
    { x: 750, y: 50  },
    { x: 480, y: 550 },
    { x: 30,  y: 350 },     // 限界
]

async function main() {
    distanceElement.textContent = "計算中...";

    const start = cities[0];
    const routes =
        allPermutations(cities.slice(1))
        .map(route => [start, ...route]);

    const result = await solveBruteForce(routes);

    drawRoute(result.route, "red")

    distanceElement.textContent = result.distance.toFixed(2);
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
    if (cities.length === 1) {
        return [cities];
    }

    const result = [];

    for (let i = 0; i < cities.length; i++) {
        const head = cities[i];
        const rest = cities.filter((_, index) => index !== i);

        const perms = allPermutations(rest);
        
        for (let perm of perms) {
            result.push([head, ...perm]);
        }
    }
    return result;
}

async function solveBruteForce(routes) {
    let bestDistance = Infinity;
    let bestRoute = null;

    for (const route of routes) {

        const d = totalDistance(route)
        
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
	描画用の関数
*/

function drawCity(city) {
    ctx.beginPath();
    ctx.fillStyle = "black"
    ctx.arc(city.x, city.y, 5, 0, Math.PI * 2);
    ctx.fill();
}

function drawCities() {
    for (const city of cities) {
        drawCity(city);
    }
}

function drawRoute(route, color) {
    clearCanvas();
    ctx.strokeStyle = color;
    drawPath(route);
    drawCities();
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