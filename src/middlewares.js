const fs = require('fs');

const validateFile = (req, res, next) => {
    const { file } = req;

    if (!file || Object.keys(file).length === 0) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    next(); 
};

const validateFileType = (...validExtensions) => { 
    return (req, res, next) => { 
        const { file } = req;
        const type = file.mimetype.split('/')[1];
        
        if (!validExtensions.includes(type)) {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            return res.status(400).json({ error: 'File must be CSV' });
        }

        next(); 
    };
};

module.exports = {
    validateFile,
    validateFileType
};
