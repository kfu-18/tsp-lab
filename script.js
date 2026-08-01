console.log("TSP Lab start");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    let x = canvas.clientWidth * Math.random()
    let y = canvas.clientHeight * Math.random()
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fill();
}
