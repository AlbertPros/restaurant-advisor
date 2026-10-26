const baseMenu = [
    { slug: '/restaurants/page/1', title: 'Restaurants' },
    { slug: '/tags', title: 'Tags' },
    { slug: '/restaurants/top', title: 'Top' },
    { slug: '/restaurants/new', title: 'Add' },
];

function getMenuForRole(role = 'guest') {
    if (role === 'admin') {
        return [...baseMenu, { slug: '/admin', title: 'Admin Panel' }];
    }
    if (role === 'user') {
        return baseMenu;
    }
    return baseMenu.filter(item => item.slug !== '/add');
}
module.exports = { getMenuForRole };