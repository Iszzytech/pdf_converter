// imports

const express = require('express');  
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require("path");
const nodemailer = require("nodemailer");
const fs = require("fs"); 
const maxSize = 3 * 1024 * 1024 //3mb;

const PORT = process.env.PORT || 5000

const CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');
const request = require('request');

var defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;
// Configure API key authorization: Apikey
var Apikey = defaultClient.authentications['Apikey'];
Apikey.apiKey = '40041bc0-e40f-4492-8ced-3a296f0f44cf';

var apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();

var outputFilePath;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '--' + file.originalname)
    } 
}); 

//VALIDATION ---------------------------------------------------------------/
//Doc to PDF

const docxtopdf = function (req, file, callback){
  var ext = path.extname(file.originalname);
  if (
      ext !== ".docx" &&
      ext !== ".doc"
  ){
      return callback("This Extension is not supported");
  }
  callback(null, true);
};
const upload = multer({storage: fileStorageEngine, fileFilter:docxtopdf, limits:{fileSize: maxSize}}) 

  //Excel Structure
const exceltopdf = function (req, file, callback){
  var ext = path.extname(file.originalname);
  if (
      ext !== ".xlsx" &&
      ext !== ".xlsm" &&
      ext !== ".xlsb" &&
      ext !== ".xltx" 
  ){
      return callback("This Extension is not supported");
  }
  callback(null, true);
};
const upload2 = multer({storage: fileStorageEngine, fileFilter:exceltopdf, limits:{fileSize: maxSize}}) 

//PPT Structure
const ppttopdf = function (req, file, callback){
  var ext = path.extname(file.originalname);
  if (
      ext !== ".ppt" &&
      ext !== ".pptx" 
  ){
      return callback("This Extension is not supported");
  }
  callback(null, true);
};
const upload3 = multer({storage: fileStorageEngine, fileFilter:ppttopdf, limits:{fileSize: maxSize}}) 

//JPEG Structure
const jpegtopdf = function (req, file, callback){
  var ext = path.extname(file.originalname);
  if (
      ext !== ".jpg" &&
      ext !== ".jpeg" 
      
  ){
      return callback("This Extension is not supported");
  }
  callback(null, true);
};
const upload4 = multer({storage: fileStorageEngine, fileFilter:jpegtopdf, limits:{fileSize: maxSize}}) 


//PNG Structure
const pngtopdf = function (req, file, callback){
  var ext = path.extname(file.originalname);
  if (
      ext !== ".png"
  ){
      return callback("This Extension is not supported");
  }
  callback(null, true);
};
const upload5 = multer({storage: fileStorageEngine, fileFilter:pngtopdf, limits:{fileSize: maxSize}}) 

//PDF Structure
const pdftojpeg = function (req, file, callback){
  var ext = path.extname(file.originalname);
  if (
      ext !== ".pdf"
  ){
      return callback("This Extension is not supported");
  }
  callback(null, true);
};
const upload6 = multer({storage: fileStorageEngine, fileFilter:pdftojpeg, limits:{fileSize: maxSize}}) 


//Static Files
app.use(express.static('public'))
app.use('/uploads', express.static('uploads'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

//Set views
app.set('views', './views')
app.set('view engine', 'ejs')


app.get('', (req, res) => {
    res.render('index')
})

app.get('/docxtopdf', (req, res) => {
  res.render('docxtopdf')
})

app.get('/index', (req, res) => {
  res.render('index')
})

app.get('/exceltopdf', (req, res) => {
  res.render('exceltopdf')
})
app.get('/jpegtopdf', (req, res) => {
  res.render('jpegtopdf')
})
app.get('/ppttopdf', (req, res) => {
  res.render('ppttopdf')
})

app.get('/downloadPage', (req, res) => {
  res.render('downloadPage')
})

app.get('/pngtopdf', (req, res) => {
  res.render('pngtopdf')
})

app.get('/pdftojpeg', (req, res) => {
  res.render('pdftojpeg')
})



//----------------------------- PROCESS (DOCX) ------------------------------
app.post("/single", upload.single('myFile'), (req, res) => {

  if (req.file){
   console.log(req.file.path);
   const file = fs.readFileSync(req.file.path);
   outputFilePath = 'uploads/' + Date.now() + "output.pdf" 

   
   var callback = function(error, data, response) {
      if (error) {
          
           res.send("Error occurred in the conversion process")

      } else {
      //   console.log('API called successfully. Returned data: ' + data);
      fs.writeFileSync(outputFilePath, data, "binary", function(err) {
              if(err){

                  console.log(err);
              } else {
                       console.log("file was saved");
                      
                       
              }
      });
       

      console.log('Successful - done.');
      res.render('downloadPage',
      {
          downloadLink: outputFilePath
      });
      }
    };
    apiInstance.convertDocumentDocToPdf(file, callback);


}

});


// Excel to Pdf

app.post("/singleExcel", upload2.single('myFileExcel'), (req, res) => {
  if (req.file){
      console.log(req.file.path);
      const file = fs.readFileSync(req.file.path);
      outputFilePath = 'uploads/' + Date.now() + "output.pdf" 
 
      
      var callback = function(error, data, response) {
         if (error) {
             
              res.send("Error occurred in the conversion process")
 
         } else {
         //   console.log('API called successfully. Returned data: ' + data);
         fs.writeFileSync(outputFilePath, data, "binary", function(err) {
                 if(err){
 
                     console.log(err);
                 } else {
                          console.log("file was saved");
                         
                          
                 }
         });
          
   
         console.log('Successful - done.');
         res.render('downloadPage',
         {
             downloadLink: outputFilePath
         });
         }
       };
       apiInstance.convertDocumentAutodetectToPdf(file, callback);
 
   
  }
 
 });

  // PPT to Pdf

app.post("/singlePPT", upload3.single('myFilePPT'), (req, res) => {
  if (req.file){
      console.log(req.file.path);
      const file = fs.readFileSync(req.file.path);
      outputFilePath = 'uploads/' + Date.now() + "output.pdf" 
 
      
      var callback = function(error, data, response) {
         if (error) {
             
              res.send("Error occurred in the conversion process")
 
         } else {
         //   console.log('API called successfully. Returned data: ' + data);
         fs.writeFileSync(outputFilePath, data, "binary", function(err) {
                 if(err){
 
                     console.log(err);
                 } else {
                          console.log("file was saved");
                         
                          
                 }
         });
          
   
         console.log('Successful - done.');
         res.render('downloadPage',
         {
             downloadLink: outputFilePath
         });
         }
       };
       apiInstance.convertDocumentAutodetectToPdf(file, callback);
 
   
  }
 
 });


  // JPEG to Pdf

app.post("/singleJPEG", upload4.single('myFileJPEG'), (req, res) => {
  if (req.file){
      console.log(req.file.path);
      const file = fs.readFileSync(req.file.path);
      outputFilePath = 'uploads/' + Date.now() + "output.pdf" 
     
      
      var callback = function(error, data, response) {
         if (error) {
             
              res.send("Error occurred in the conversion process")
 
         } else {
         //   console.log('API called successfully. Returned data: ' + data);
         fs.writeFileSync(outputFilePath, data, "binary", function(err) {
                 if(err){
 
                     console.log(err);
                 } else {
                          console.log("file was saved");
                         
                          
                 }
         });
          
   
         console.log('Successful - done.');
         res.render('downloadPage',
         {
             downloadLink: outputFilePath
         });
         }
       };
       apiInstance.convertDocumentAutodetectToPdf(file, callback);
 
   
  }
 
 });


  // PNG to Pdf

app.post("/singlePNG", upload5.single('myFilePNG'), (req, res) => {
  if (req.file){
      console.log(req.file.path);
      const file = fs.readFileSync(req.file.path);
      outputFilePath = 'uploads/' + Date.now() + "output.pdf" 
 
      
      var callback = function(error, data, response) {
         if (error) {
             
              res.send("Error occurred in the conversion process")
 
         } else {
         //   console.log('API called successfully. Returned data: ' + data);
         fs.writeFileSync(outputFilePath, data, "binary", function(err) {
                 if(err){
 
                     console.log(err);
                 } else {
                          console.log("file was saved");
                         
                          
                 }
         });
          
   
         console.log('Successful - done.');
         res.render('downloadPage',
         {
             downloadLink: outputFilePath
         });
         }
       };
       apiInstance.convertDocumentAutodetectToPdf(file, callback);
 
   
  }
 
 });


// Pdf to Jpeg

app.post("/singlePDFJPEG", upload6.single('myFilePDFJPEG'), (req, res) => {
  if (req.file){
      console.log(req.file.path);
      const file = fs.readFileSync(req.file.path);
      outputFilePath = 'uploads/' + Date.now() + "output.zip" 
 
      
        var opts = { 
          'quality': 56 // Number | Optional; Set the JPEG quality level; lowest quality is 1 (highest compression), highest quality (lowest compression) is 100; recommended value is 75. Default value is 75.
        };
      
      var callback = function(error, data, response) {
         if (error) {
             
              res.send("Error occurred in the conversion process")
 
         } else {
         //   console.log('API called successfully. Returned data: ' + data);
         fs.writeFileSync(outputFilePath, data, "binary", function(err) {
                 if(err){
 
                     console.log(err);
                 } else {
                          console.log("file was saved");
                         
                          
                 }
         });
          
   
         console.log('Successful - done.');
         res.render('downloadPage',
         {
             downloadLink: outputFilePath
         });
         }
       };
       apiInstance.convertDocumentPdfToJpg(file, opts, callback);
 
   
  }
 
 });


//Contact form
app.post("/ajax/email", function(request, response){
 const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "damilolaemma2022@gmail.com",
        pass: "damilola@gmail2022"
      }
 });

    var textBody = `FROM: ${request.body.name}; EMAIL: ${request.body.email}; MESSAGE: ${request.body.message} `;
    var htmlBody = `<h2>New Mail From Contact Form</h2><p>From: ${request.body.name} <a href='mailto:${request.body.email}'>${request.body.email}</a></p><p>${request.body.message}</p>`;
    var mail = {
          from: "damilolaemma2022@gmail.com",
          to: "damilolaemma2022@gmail.com",
          subject: "New Mail From Contact Form",
          text: textBody,
          html: htmlBody
    };

    transporter.sendMail(mail, function (err, info) {
      if (err)
      {
        console.log(err);
        response.json({ message: "an error occured, check the server's console log" });
      }
      else {

        response.json({ message: `Message sent successfully with ID: ${info.messageId} ` });
      
      }
    });

});




// listen on the port
app.listen(PORT, () => {
  console.log(`App is listening on Port ${PORT}`);
});