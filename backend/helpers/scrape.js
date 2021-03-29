const BASE_URL = 'https://davesgarden.com';

/**
 * 
 */
function scrapeSearch(searchResults) {
	const plantList = [];

	for (let result of searchResults) {
		let id;
		if (result.querySelectorAll('a')[5]) {
			id = Number(result.querySelectorAll('a')[5].href.match(/\/\d+$/)[0].slice(1));
		} else {
			id = Number(result.querySelectorAll('a')[4].href.match(/\/\d+$/)[0].slice(1));
		}

		const common = result.querySelector('h2').textContent;

		let imgs = [];
		if (result.querySelector('.plant-info-block-img')) {
				const imgLength = result.querySelector('.plant-info-block-img')
										.style.backgroundImage.length;
			let imgURL =
				BASE_URL + result.querySelector('.plant-info-block-img')
										.style.backgroundImage
										.slice(4, imgLength - 1);
			imgs.push(imgURL)
		}
		

		let category, height, location;
		const infoArray = Array.from(result.querySelectorAll('.plant-info-label'));
		infoArray.forEach((each) => {
			switch (each.textContent) {
				case 'Type:':
					category = each.nextElementSibling.textContent;
					break;
				case 'Height:':
					height = each.nextElementSibling.textContent;
					break;
				case 'Conditions:':
                    location = each.nextElementSibling.textContent;
					break;
				default:
				    break;
			}
		});
        const plant = ({ id, common, imgs, category, height, location })
		plantList.push(plant);
	}
	return plantList;
}

function nextElement(element, array) {
	const newElement = element.nextSibling;

	if (newElement.tagName === 'P' && newElement.textContent !== 'Unknown - Tell us') {
		const text = newElement.textContent.replace(/[��]/g,"");
		array.push(text);
		nextElement(newElement, array);
	} else {
		return;
	}
}

/**
 * 
 */
function scrapePlant(id, plantData) {
	let plantObj = { id: Number(id) };

	plantObj.common = plantData.querySelector('h1').textContent;

    let imgArray = [];
	if (plantData.querySelector('.plantfiles-gallery-image img')) {
		let mainImg = BASE_URL +
        	plantData.querySelector('.plantfiles-gallery-image img').src;
    	imgArray.push(mainImg);

    	let imgNodes = Array.from(plantData.querySelectorAll('.plantfiles-gallery-thumbnails img'));
		if (imgNodes) {
			for (let img of imgNodes) {
				imgArray.push(img.src);
			}
		}
	}
	plantObj.imgs = imgArray;

	const titleNodes = Array.from(plantData.querySelectorAll('.plant-body h4'));
	const validTitles = {
		["Category:"] : "Category",
		["Water Requirements:"] : "Water",
		["Sun Exposure:"] : "Sun",
		["Soil pH requirements:"] : "pH",
		["Propagation Methods:"] : "Propagation",
		["Height:"] : "Height",
		["Spacing:"] : "Spacing",
		["Hardiness:"] : "Hardiness",
		["Where to Grow:"] : "location",
		["Danger:"] : "Toxicity",
		["Seed Collecting:"] : "Seed",
		["Foliage:"] : "Foliage",
		["Bloom Characteristics:"] : "Bloom"
    };
    
	for (let section of titleNodes) {
        const sectionTitle = section.textContent;
		if (!Object.keys(validTitles).includes(section.textContent)) {
                continue;
            }	
		const sectionInfo = [];

		nextElement(section, sectionInfo);
        if (sectionInfo.length) {
            // let finalizedSection = JSON.stringify(sectionInfo);
		    plantObj[validTitles[sectionTitle]] = sectionInfo;
        }
	}
	return plantObj;
}

module.exports = { scrapeSearch, scrapePlant };
