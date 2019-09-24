const path = require("path")

const assetResolver = relativePath => {
    const assestsPath = path.resolve(__dirname, ".", "assets");
    const absoluteImagePath = path.join(assestsPath, relativePath);
    const relPathFromAssets = path.relative(assestsPath, absoluteImagePath);
    const imageURL = process.env.BACKEND_URL + "/assets/" + relPathFromAssets;
    return imageURL;
}

module.exports = {
    assetResolver,
}