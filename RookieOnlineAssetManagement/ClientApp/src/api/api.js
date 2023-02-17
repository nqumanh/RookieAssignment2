import axios from "axios"

export const endpoint = {
    'Users': (page, type, find, sort, sortby) => `api/Users/Pagination/${page}/${type}/${find}/${sort}/${sortby}`,
    'ListUser': (page) => `api/Users/Current/${page}`,
    'FindUser': (find) => `api/Users/Find/${find}`,
    'SortUser': (sort) => `api/Users/Sort/${sort}`,
    'ListUserByType': (type, page) => `api/Users/${type}/${page}`,
    'Categories': 'api/Categories',
    'History': (assetCode) => `api/Assets/${assetCode}`,
}

export default axios.create({
    baseURL: '/'
})