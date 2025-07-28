const fs = require('fs');
const csv = require('csv-parser');

const Records = require('./records.model');

const csvToArray = (file) => {
    const records = [];

    return new Promise((resolve, reject) => { 
        const stream = fs.createReadStream(file.path)
            .pipe(csv({
                mapValues: ({ header, value }) => {
                    if (header === 'id') return Number(value);
                    return value;
                }
            }));

        stream.on('data', (data) => {
            records.push(data);
        });

        stream.on('end', () => {
            resolve(records);
        });

        stream.on('error', (err) => {
            reject(new Error('Error reading file'));
        });
    });
}

const recordService = () => { 
    async function insertMany(records) {
        try {
            await Records.insertMany(records);
        } catch (error) {
            throw new Error('Error saving data');
        }
    }

    return {
        insertMany,
    }
};

module.exports = {
    csvToArray,
    recordService,
};
