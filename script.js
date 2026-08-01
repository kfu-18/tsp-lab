console.log("TSP Lab start");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const cities = [
    { x: 120, y: 80  },
    { x: 350, y: 500 },
    { x: 200, y: 220 },
    { x: 430, y: 90  },
    { x: 620, y: 420 } 
]

for (const city of cities) {
    drawCity(city.x, city.y);
}

function drawCity(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
}

