const fs = require('fs')

module.exports = {
    writeToFile: async (data, fileName) => {
        try {
            await fs.promises.writeFile(fileName, JSON.stringify(data, null, 2));
        } catch (err) {
            console.error(err);
        }
    }
}