export const multiply = (a, b) => a * b;

export const cartTotal = (products) => {
    return products.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);
};

export const firstImage = (thumbnails) => {
    return thumbnails.length > 0 ? thumbnails[0].url : null;
};

export const eq = (a, b) => a === b;