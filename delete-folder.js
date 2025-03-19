const fs = require('fs');
const path = require('path');

// Define the path to the folder with special characters
const folderPath = path.join(__dirname, 'src', 'app', 'api', 'events', '[type]');

// Check if the folder exists
if (fs.existsSync(folderPath)) {
  console.log(`Folder exists at: ${folderPath}`);
  
  // Delete the folder recursively
  fs.rm(folderPath, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error(`Error deleting folder: ${err.message}`);
    } else {
      console.log('Folder deleted successfully');
    }
  });
} else {
  console.log(`Folder not found at: ${folderPath}`);
} 