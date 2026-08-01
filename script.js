console.log("TSP Lab start");

const cnavas = document.getElementById("canvas");
const ctx = cnavas.getContext("2d");

ctx.beginPath();
ctx.arc(100, 100, 5, 0, Math.PI * 2)
ctx.fill();