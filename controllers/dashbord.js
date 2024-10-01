// Assuming you have your required dependencies and configurations
const {loggedIn} = require("./auth")
const {pool} = require("../routes/db-config");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Directory where uploads will be saved
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now(); // Get current timestamp
        const subjectCode = req.body.subjectCode; // Assuming subjectCode is sent in the request body

        // Generate the filename using subject code and timestamp
        const filename = `${subjectCode}_${timestamp}.pdf`;
        cb(null, filename);
    },
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage }).single('pdfUpload'); // Use the same field name as in the form (name="pdfUpload")

// Controller to handle file upload
exports.postupload =[ loggedIn, (req, res) => {
  const userId = req.user ? req.user.id : null; // Extract user_id from the request
  if (!userId) {
    // If userId is not available, redirect to the login page
    return res.redirect('/login');
  }
    console.log(userId)
    upload(req, res, (err) => {
        if (err) {
            // Handle Multer errors (e.g., file size exceeds limit)
            return res.status(400).json({ error: err.message });
        }

  
      const { dept, branch, subjectCode, semester } = req.body;
      const pdfPath = req.file.path;
      console.log(req.body)
      const formDataQuery = "INSERT INTO posts (user_id, dept, branch, subject_code, semester, pdf_path) VALUES (?, ?, ?, ?, ?, ?)";
  
      pool.query(
        formDataQuery,
        [userId, dept, branch, subjectCode, semester, pdfPath],
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Error inserting data into posts" });
          }

          // Assuming the file upload was successful
        //   const successMessage = "File uploaded successfully!";
          const username = req.user.username;
          // Redirect to the upload route with the success message
          res.render('upload',{username:username,successMessage:"File uploaded successfully!"});
        }
      );
    });
  }
];