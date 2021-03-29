
function insertPlantQuery (plantDetail) {
    const query = 
        `INSERT INTO plants
        (id, expiry, common, imgs,
        category, water, sun, ph,
        propagation, height,
        spacing, hardiness,
        location, toxicity, seed,
        foliage, bloom)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15, $16,
        $17)
        RETURNING id`;

    const values = [plantDetail.id, plantDetail.expiry, 
        plantDetail.common, plantDetail.imgs, 
        plantDetail.Category, plantDetail.Water, 
        plantDetail.Sun, plantDetail.pH, 
        plantDetail.Propagation, plantDetail.Height, 
        plantDetail.Spacing, plantDetail.Hardiness, 
        plantDetail.location, plantDetail.Toxicity, 
        plantDetail.Seed, plantDetail.Foliage, 
        plantDetail.Bloom];

    return { query, values };
}

module.exports = { insertPlantQuery };