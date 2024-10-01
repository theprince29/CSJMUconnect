//  Your JavaScript file
//==============================
document.addEventListener('DOMContentLoaded', function () {
    // Set an initial page counter
    let currentPage = 1;

    // Fetch posts from the API and update the post container
    fetchPosts();

    // Event listener for the "Load More" button
    document.getElementById('loadMoreBtn').addEventListener('click', loadMorePosts);

    function fetchPosts() {
        // Fetch 5 posts based on the current page
        fetch(`https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=5`)
            .then(response => response.json())
            .then(posts => {
                // Update the post container with the fetched posts
                updatePostContainer(posts);
            })
            .catch(error => console.error('Error fetching posts:', error));
    }

    function updatePostContainer(posts) {
        const postContainer = document.getElementById('postContainer');

        // Loop through each post and create a card for display
        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'card mb-3';
            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.body}</p>
                    <button class="btn btn-outline-primary">Like <i class="bi bi-heart"></i></button>
                    <button class="btn btn-outline-secondary">Comment <i class="bi bi-chat"></i></button>
                </div>
            `;
            postContainer.appendChild(card);
        });
    }

    function loadMorePosts() {
        // Increment the page counter
        currentPage++;

        // Fetch the next 5 posts based on the updated page
        fetch(`https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=5`)
            .then(response => response.json())
            .then(posts => {
                // Update the post container with the fetched posts
                updatePostContainer(posts);
            })
            .catch(error => console.error('Error fetching more posts:', error));
    }

    function handlePostSubmit() {
        const postContent = document.getElementById('postContent').value;

        // Assume your API endpoint supports creating a new post
        fetch('https://your-api-endpoint/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: postContent }),
        })
            .then(response => response.json())
            .then(newPost => {
                // Fetch updated posts after creating a new post
                fetchPosts();
            })
            .catch(error => console.error('Error creating post:', error));
    }
});
