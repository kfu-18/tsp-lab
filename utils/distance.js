// 2都市間の距離を計算
export function distance(city1, city2) {
    const dx = city1.x - city2.x;
    const dy = city1.y - city2.y;
    return Math.sqrt(dx*dx + dy*dy);
}

// 経路長を計算
export function totalDistance(route) {
    let total = 0;
    for (let i = 0; i < route.length - 1; i++) {
        total += distance(route[i], route[i+1]);
    }
    total += distance(route[route.length - 1], route[0]);
    return total;
}
