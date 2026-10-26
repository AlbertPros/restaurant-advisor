import DOMPurify from 'dompurify';
import { searchRestaurants } from './restaurantApi';

function searchResultsHTML(restaurants) {
    return restaurants.map(restaurant => {
        return `
            <a href="/restaurants/${restaurant.id}"class="search__result">
                <strong>${restaurant.name}</strong>
            </a>
        `;
    }).join('');
}
function initializeTypeahead(search) {
    if (!search) { return; }
    const searchInput = search.querySelector('input[name="search"]');
    const searchResults = search.querySelector('.search__results');

    searchInput.addEventListener('input', async function () {
        if (!this.value) { //no input --> hide div
            searchResults.style.display = 'none';
            searchResults.innerHTML = '';
            return;
        }
        searchResults.style.display = 'block'; //input --> show div
        try {
            const restaurants = await searchRestaurants(this.value);
            if (restaurants.length > 0) {
                const html = searchResultsHTML(restaurants);
                searchResults.innerHTML = DOMPurify.sanitize(html);
            } else {
                searchResults.innerHTML = `
                    <div class="search__result">
                        <strong>No results found</strong>
                    </div>
                `;
            }
        } catch (error) {
            console.error(error);
        }
    });
}
export {
    initializeTypeahead
}; 