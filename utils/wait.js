export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function nextFrame() {
    return new Promise((resolve) => {
        requestAnimationFrame(resolve);
    });
}