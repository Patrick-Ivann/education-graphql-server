export const getRandomString = (length) => {
    var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    var randS = "";

    while (length > 0) {
        randS += chars.charAt(Math.floor(Math.random() * chars.length));
        length--;
    }
    return randS;
}

export const mongoObjectId = function () {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
};


export const mapValues = (array) => {
    Object.entries(fruits)
  .reduce((a, [key, { toGroupBy }]) => {
    a[key] = toGroupBy;
    return a;
  }, {}
)
}

