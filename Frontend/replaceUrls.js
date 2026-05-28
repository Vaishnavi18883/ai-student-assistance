const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

walk('./src', function(filePath) {
    if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;
        
        // Replace backticks
        newContent = newContent.replace(/`http:\/\/localhost:5000(.*?)`/g, '`${import.meta.env.VITE_API_URL}$1`');
        
        // Replace single quotes
        newContent = newContent.replace(/'http:\/\/localhost:5000(.*?)'/g, '`${import.meta.env.VITE_API_URL}$1`');
        
        // Replace double quotes
        newContent = newContent.replace(/"http:\/\/localhost:5000(.*?)"/g, '`${import.meta.env.VITE_API_URL}$1`');
        
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log('Updated', filePath);
        }
    }
});
