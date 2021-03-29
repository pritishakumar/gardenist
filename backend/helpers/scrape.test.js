"use strict";

const { scrapeSearch, scrapePlant } = require("./scrape");
const {JSDOM} = require("jsdom")

/**  */
describe("scrapeSearch functionality", function() {
    const { sabaNutSearchData } = require("../models/plantMockData")
    test("scrapeSearch works", function () {
        const dom = new JSDOM(sabaNutSearchData)
        const searchResults = Array.from(dom.window.document.querySelectorAll(".plant-info-block"));
        const plantsList = scrapeSearch(searchResults);

        expect(plantsList).toEqual([{
            category: "Edible Fruits and Nuts, Trees, Tropicals and Tender Perennials",
            common: "Pachira Species, French Peanut, Guiana Chestnut, Malabar Chestnut, Money Tree, Saba Nut",
            height: "10-15 ft. | 3-4.7 m",
            id: 56220,
            imgs: [
                "https://davesgarden.com/guides/pf/thumbnail.php?image=2003/06/07/IslandJim/526a5c.jpg&width=163&height=163"
            ],
            location: "Zone 9-11, Sun to Partial Shade, Light Shade"
        }]);
    });
});
describe("scrapePlant functionality", function() {
    const { sabaNutPage } = require("../models/plantMockData")
    const id = 56220;

    test("scrapePlant works", function () {
        const dom = new JSDOM(sabaNutPage)
        const plantData = dom.window.document.querySelector(".plants-files");
        const plantDetail = scrapePlant(id, plantData);

        expect(plantDetail).toEqual({
            Bloom: ["This plant is attractive to bees, butterflies and/or birds"], 
            Category: ["Edible Fruits and Nuts", "Trees", 
                "Tropicals and Tender Perennials"], 
            common: "Pachira Species, French Peanut, Guiana Chestnut, Malabar Chestnut, Money Tree, Saba Nut", 
            Foliage: ["Evergreen"], 
            Hardiness: ["USDA Zone 9b: to -3.8 °C (25 °F)", 
                "USDA Zone 10a: to -1.1 °C (30 °F)", 
                "USDA Zone 10b: to 1.7 °C (35 °F)", 
                "USDA Zone 11: above 4.5 °C (40 °F)"], 
            Height: ["10-12 ft. (3-3.6 m)", "12-15 ft. (3.6-4.7 m)"], 
            id: 56220, 
            imgs: ["https://davesgarden.com/guides/pf/thumbnail.php?image=2005/03/23/palmbob/b6aaaa.jpg&widht=700&height=312", 
                "https://pics.davesgarden.com/pics/2003/07/12/IslandJim/561de5_tn.jpg", 
                "https://pics.davesgarden.com/pics/2003/08/16/OlgaN/73ac37_tn.jpg", 
                "https://pics.davesgarden.com/pics/2003/06/07/IslandJim/526a5c_tn.jpg", 
                "https://pics.davesgarden.com/pics/2003/09/21/IslandJim/72fb3c_tn.jpg"], 
            location: ["Suitable for growing in containers"], 
            Propagation: ["From softwood cuttings", 
                "From seed; direct sow outdoors in fall", 
                "By air layering"], 
            Spacing: ["18-24 in. (45-60 cm)"], 
            Sun: ["Sun to Partial Shade", "Light Shade"], 
            Water: ["Average Water Needs;  Water regularly; do not overwater"]});
    });
});