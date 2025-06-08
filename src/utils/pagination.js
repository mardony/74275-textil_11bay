export const buildPagination = (req, result) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    const baseUrl = req.originalUrl.split('?')[0];

    return {
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage
            ? `${baseUrl}?limit=${limit}&page=${result.prevPage}&sort=${sort || ''}&query=${query || ''}`
            : null,
        nextLink: result.hasNextPage
            ? `${baseUrl}?limit=${limit}&page=${result.nextPage}&sort=${sort || ''}&query=${query || ''}`
            : null
    };
};