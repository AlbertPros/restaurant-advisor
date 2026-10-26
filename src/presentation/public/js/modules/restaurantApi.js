async function searchRestaurants(query) {
    const response = await fetch( `/api/v1/restaurants/search?q=${encodeURIComponent(query)}` );
    const data = await response.json();
    return data.restaurants;
}
export {
    searchRestaurants
};