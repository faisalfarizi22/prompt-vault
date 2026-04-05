const fs = require('fs');

function getCats(file) {
    try {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        return [...new Set(data.map(x => x.category))];
    } catch (e) {
        return [];
    }
}

const promptsCats = getCats('data/prompts.json');
const imageCats = getCats('data/image-prompts.json');

const result = {
    prompts: promptsCats,
    images: imageCats
};

fs.writeFileSync('temp_categories.json', JSON.stringify(result, null, 2));
console.log('Categories saved to temp_categories.json');
