const {pool} = require("../routes/db-config");


function getTimeAgo(date) {
    const now = new Date();
    const timeDiff = now - date;

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }
}

exports.latestpost = (req, res) => {
    const query = `
    SELECT posts.id AS PostId,posts.dept as dept, users.username AS UserName, posts.branch, posts.subject_code, posts.semester, posts.pdf_path, posts.created_at 
    FROM users 
    INNER JOIN posts ON users.id = posts.user_id
    ORDER BY posts.created_at DESC
    LIMIT 6`;

    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: "Error fetching data" });
            return;
        }

        const modifiedResults = results.map((result) => {
            const filePath = result.pdf_path.replace(/\\/g, "/"); // Replace backslashes with forward slashes
            const fileName = filePath.split("/").pop(); // Extracting filename from the path
            const createdAt = new Date(result.created_at);
            const timeAgo = getTimeAgo(createdAt);
            return {
                PostId: result.PostId,
                dept:result.dept,
                UserName: result.UserName,
                Branch: result.branch,
                Subject_code: result.subject_code,
                Semester: result.semester,
                pdfName: fileName,
                CreatedAt: timeAgo // Include the created_at timestamp
            };
        });

        // Render the Handlebars template and pass the search results
        res.render('pyqs', { latestposts: modifiedResults }); 
    });
};
