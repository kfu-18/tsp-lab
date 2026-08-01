console.log("TSP Lab start");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const cities = [
    { x: 120, y: 80  },
    { x: 200, y: 500 },
    { x: 200, y: 220 },
    { x: 430, y: 90  },
    { x: 620, y: 420 } 
]

for (const city of cities) {
    drawCity(city.x, city.y);
}

let routes = allPermutations(cities);

let bestRoute = solveBruteForce(routes).route

drawPath(bestRoute);

console.log(totalDistance(cities))

function drawCity(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
}

function drawPath(cities) {
    ctx.beginPath();
    ctx.moveTo(cities[0].x, cities[0].y);

    for (let i = 1; i < cities.length; i++) {
        ctx.lineTo(cities[i].x, cities[i].y);
    }

    ctx.lineTo(cities[0].x, cities[0].y);

    ctx.stroke();
}

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
    if (cities.length == 1) {
        return [cities];
    }

    let result = [];

    for (let i = 0; i < cities.length; i++) {
        let head = cities[i];
        let rest = cities.filter((_, index) => index !== i);

        let perms = allPermutations(rest);
        
        for (let perm of perms) {
            result.push([head, ...perm]);
        }
    }
    return result;
}

function solveBruteForce(routes) {
    let bestDistance = Infinity;
    let bestRoute = null;

    for (const route of routes) {
        const d = totalDistance(route)

        if (d < bestDistance) {
            bestDistance = d;
            bestRoute = route;
        }
    }
    return {
        route: bestRoute,
        distance: bestDistance
    };
}