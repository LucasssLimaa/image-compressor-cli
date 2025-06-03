const sharp = require('sharp');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.on('SIGINT', () => {
    console.log('\nClosing... Good Bye!');
    rl.close();
    process.exit(0);
});

function askQuestion(query) {
    return new Promise(resolve => {
        rl.question(query, answer => {
            resolve(answer);
        })
    })
}

function getFirstImageFromFolder(folderPath) {
    let files = fs.readdirSync(folderPath);
    return files.find(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
}

async function waitForImage(folderPath) {
    return new Promise(resolve => {
        let interval = setInterval(() => {
            let file = getFirstImageFromFolder(folderPath);
            if(file) {
                clearInterval(interval);
                resolve(file);
            }
        }, 100);
    })
}

async function compressImage(input, outputPath) {
    console.clear();
    let ext = path.extname(input).slice(1).toLowerCase();

    try {
        let inputBuffer = await fsPromises.readFile(input);
        let pipeline = sharp(inputBuffer);

        if (ext === 'jpg' || ext === 'jpeg') {
            pipeline = pipeline.jpeg({ quality: 60, mozjpeg: true });
        } else if (ext === 'png') {
            pipeline = pipeline.png({palette: true, quality: 60});
        } else if (ext === 'webp') {
            pipeline = pipeline.webp({ quality: 60 });
        } else {
            console.log("Unsupported format for compression");
        }

        await pipeline.toFile(outputPath);
        console.log("Image Compressed");
        console.log("You can find the file in the folder 'processed'");
    } catch (err) {
        console.log(err);
    }
}

async function main() {
    console.clear();
    
    let inputFolder = './temp'
    let outputFolder = './processed';

    if(!fs.existsSync(inputFolder)) {
        fs.mkdirSync(inputFolder);
    }

    if(!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder);
    }

    while(true) {
        console.log("Waiting for an image in 'temp' folder...");
        console.log("Press 'ctrl + c' to exit\n");
        let imageFile = await waitForImage(inputFolder);

        console.log(`Found image: ${imageFile}`);
        let confirm = await askQuestion("Do you want to compress the image? (y/n): ");

        if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
            console.log("Compression cancelled");
            try {
                await fsPromises.unlink(path.join(inputFolder, imageFile));
                console.log("Original file deleted\n");
            } catch (err) {
                console.log("Error deleting original file: ", err);
            }
            continue;
        }

        const inputPath = path.join(inputFolder, imageFile);
        const outputPath = path.join(outputFolder, 'processed_' + imageFile);

        await compressImage(inputPath, outputPath);

        try {
            await fsPromises.unlink(inputPath);
            console.log("Original file deleted\n");
        } catch (err) {
            console.log("Error deleting original file: ", err);
        }
    }
}

main();