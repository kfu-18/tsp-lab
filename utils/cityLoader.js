export async function loadCities() {
    const response = await fetch("./data/cities.json");

    if(!response.ok) {
        throw new Error(`都市データの取得に失敗しました: ${response.status}`);
    }

    const data = await response.json();

    return data.cities;
}