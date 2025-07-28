const fs = require('fs');

const { csvToArray, recordService } = require('./services');
const Records = require('./records.model');

const RecordService = recordService();

const upload = async (req, res) => {
    const { file } = req;
    
    /* Acá va tu código! Recordá que podés acceder al archivo desde la constante file */
    try {                    
        const records = await csvToArray(file);
        await RecordService.insertMany(records);
        res.status(200).json({ message: 'File processed successfully' });
    } catch (err) {
        const errorMessage = (err.message !== 'Error reading file' || err.message !== 'Error saving data')
            ? 'Internal Error'
            : err.message;
        res.status(500).json({ error: errorMessage });
    } finally {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }
};

const list = async (_, res) => {
    try {
        const data = await Records
            .find({})
            .limit(10)
            .lean();
        
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports = {
    upload,
    list,
};
