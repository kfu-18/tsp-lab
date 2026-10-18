/*
	描画用の関数
*/
export function createRenderer(canvas) {
    const ctx = canvas.getContext("2d");

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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

    function drawCity(city, color) {
        ctx.beginPath();
        ctx.fillStyle = color
        ctx.arc(city.x, city.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawCityLabel(city, index, color) {
        ctx.font = "24px serif";
        ctx.fillStyle = color;
        ctx.strokeText(index, city.x-10, city.y-10);
    }

    function drawCities(cities) {
        cities.forEach((city, index) => {
            const color = index === 0 ? "blue" : "black";
            drawCity(city, color);
            drawCityLabel(city, index, color);
        }); 
    }

    function drawRoute(route, color) {
        clearCanvas();
        ctx.strokeStyle = color;
        drawPath(route);
        drawCities(route);
    }

    return { drawRoute };

}