const {pool} = require("../routes/db-config");


exports.search = (req, res) => {
    const searchTerm = req.query.q; // Get the 'q' parameter from the query string
    console.log(searchTerm)
    const query = `
    SELECT posts.id AS PostId, users.username AS UserName, posts.branch, posts.subject_code, posts.semester, posts.pdf_path 
    FROM users 
    INNER JOIN posts ON users.id = posts.user_id
    WHERE posts.branch LIKE '%${searchTerm}%' 
    OR posts.subject_code LIKE '%${searchTerm}%'
    OR posts.semester LIKE '%${searchTerm}%'
    LIMIT 12`;

    pool.query(query, [searchTerm], (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: "Error fetching data" });
            return;
        }
        console.log(results);
        
        if (!results || results.length === 0) {
            return res.render('pyqs', { searchTerm, searchnotfound: "not found" });
        }

        const modifiedResults = results.map((result) => {
            const filePath = result.pdf_path.replace(/\\/g, "/"); // Replace backslashes with forward slashes
            const fileName = filePath.split("/").pop(); // Extracting filename from the path
            return {
                PostId: result.PostId,
                UserName: result.UserName,
                Branch: result.branch,
                Subject_code: result.subject_code,
                Semester: result.semester,
                pdfName: fileName,
            };
        });

       
        res.render('pyqs', { searchTerm:searchTerm,searchResults: modifiedResults }); 
    });
};

















// const query =
//         "SELECT posts.id AS PostId, users.name AS UserName, posts.branch, posts.subject_code, posts.semester, posts.pdf_path FROM users INNER JOIN posts ON users.id = posts.user_id";
//     pool.query(query, (err, results) => {
//         if (err) {
//             console.error("Error fetching data:", err);
//             res.status(500).json({ error: "Error fetching data" });
//             return;
//         }

//         const modifiedResults = results.map((result) => {
//             const filePath = result.pdf_path.replace(/\\/g, "/"); // Replace backslashes with forward slashes
//             const fileName = filePath.split("/").pop(); // Extracting filename from the path
//             return {
//                 PostId: result.PostId,
//                 UserName: result.UserName,
//                 Branch: result.branch,
//                 Subject_code: result.subject_code,
//                 Semester: result.semester,
//                 pdfName: fileName,
//             }; // Sending PostId, UserName, and post details
//         });

//     )}



// exports.search = (req, res) => {
//     const searchTerm = req.query.q; // Get the 'q' parameter from the query string
    
//     // Perform search logic using the searchTerm in your database
//     const searchResults = [
//         { PostId: 1, UserName: 'John', Branch: 'CSE', Subject_code: 'CSE101', Semester: 'III', pdfName: 'pdf1.pdf' },
//         { PostId: 2, UserName: 'Alice', Branch: 'IT', Subject_code: 'IT102', Semester: 'II', pdfName: 'pdf2.pdf' },
//         { PostId: 3, UserName: 'Emma', Branch: 'ECE', Subject_code: 'ECE201', Semester: 'IV', pdfName: 'pdf3.pdf' },
//         { PostId: 4, UserName: 'Mark', Branch: 'Mech', Subject_code: 'MECH105', Semester: 'V', pdfName: 'pdf4.pdf' },
//         { PostId: 5, UserName: 'Sophia', Branch: 'CSE', Subject_code: 'CSE203', Semester: 'VI', pdfName: 'pdf5.pdf' },
//         { PostId: 6, UserName: 'Oliver', Branch: 'Civil', Subject_code: 'CIV103', Semester: 'II', pdfName: 'pdf6.pdf' },
//         { PostId: 7, UserName: 'James', Branch: 'Chem', Subject_code: 'CHEM301', Semester: 'VII', pdfName: 'pdf7.pdf' },
//         { PostId: 8, UserName: 'Mia', Branch: 'ECE', Subject_code: 'ECE102', Semester: 'III', pdfName: 'pdf8.pdf' },
//         { PostId: 9, UserName: 'Ethan', Branch: 'IT', Subject_code: 'IT305', Semester: 'VIII', pdfName: 'pdf9.pdf' },
//         { PostId: 10, UserName: 'Ava', Branch: 'Mech', Subject_code: 'MECH204', Semester: 'IV', pdfName: 'pdf10.pdf' }
//     ];
    
//     // Render the Handlebars template and pass the search results
//     res.render('pyqs', { searchResults }); 
// };





// // Assuming your search route is '/search'
// app.get('/search', (req, res) => {
//     const searchTerm = req.query.q;
//     // Perform search logic using searchTerm to get results
//     // Example: const searchResults = performSearch(searchTerm);
    
//     // For demonstration purposes, sending dummy search results
//     const searchResults = [
//         { title: 'Result 1' },
//         { title: 'Result 2' },
//         { title: 'Result 3' },
//     ];

//     res.render('yourPage', { searchTerm, searchResults });
// });
