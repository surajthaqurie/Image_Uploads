const express = require('express');
const ejs = require('ejs');
const multer = require('multer');
const path = require('path');


// SET Storage ENGINE
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() +
            path.extname(file.originalname));
    }
});
// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mine this is for when ext of imnage is renamed
    //  const minetype = filetypes.test(file.minetype);

    // if (minetype && extname) {
    if (extname) {
        return cb(null, true);
    } else {
        cb('Error:Images Only!');
    }

}

//Init App
const app = express();

// EJS
app.set('view engine', 'ejs');
// Public Folder
app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.render('index');

});
app.post('/upload', (req, res) => {
    // res.send('test');
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.render('index', {
                    msg: 'Error: No File Selected'
                });
            } else {
                res.render('index', {
                    msg: 'File Uploaded !',
                    file: `uploads/${req.file.filename}`
                });
            }
        }
    });
});


const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}..`));