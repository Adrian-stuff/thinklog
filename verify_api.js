async function verify() {
  const postId = '840333be-7b90-410a-9d9f-682136e09340'; // Replace with a real ID from your DB if needed
  try {
    const response = await fetch(`http://localhost:3000/api/posts/${postId}/details`);
    if (!response.ok) {
        console.error("Fetch failed:", response.status);
        const err = await response.json();
        console.error(err);
        return;
    }
    const data = await response.json();
    console.log("Keys in response:", Object.keys(data));
    console.log("Reaction counts:", data.reaction_counts);
    console.log("Comments count:", data.comments.length);
  } catch (err) {
    console.error("Error:", err);
  }
}

// I need an actual ID. I'll get one first.
async function getAnId() {
    const res = await fetch('http://localhost:3000/api/posts');
    const posts = await res.json();
    return posts.data[0].id;
}

getAnId().then(id => {
    console.log("Testing with ID:", id);
    return fetch(`http://localhost:3000/api/posts/${id}/details`);
}).then(res => res.json())
  .then(data => {
      console.log("Response Keys:", Object.keys(data));
      console.log("Has reaction_counts:", !!data.reaction_counts);
      console.log("Has comments:", Array.isArray(data.comments));
      process.exit(0);
  })
  .catch(err => {
      console.error(err);
      process.exit(1);
  });
