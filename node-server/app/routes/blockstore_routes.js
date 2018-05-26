var multer = require("multer");
var path = require("path");
const fs = require('fs');


const storageDir = 'uploadedimages/';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storageDir)
  },
  filename: function (req, file, cb) {
    cb(null, /*uuid.v4() +*/ path.basename(file.originalname, path.extname(file.originalname)) + '.jpg');
  }
})

var upload = multer({ storage: storage });




module.exports = function(app) {
  // "files" should be the same name as what's coming from the field name on the client side.
  app.post("/upload", upload.array("files", 12), function(req, res) {
      res.send(req.files);
      console.log("files = ", req.files);
  });

  app.get("/itemlist", function(req, res) {
    var filelist = new Array();
    fs.readdir(storageDir, (err, files) => {
      files.forEach(file => {
        filelist.push(file)
        console.log(file);
      });
    })
    console.log(filelist)
    res.send('get em yourself ' + filelist);
  });
};
