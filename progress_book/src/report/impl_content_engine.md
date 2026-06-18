# 5.1. The Content Engine (UGC)

The content engine powers the social layer: posts, stories, and engagement.

### Posts
Posts are created through the API and rendered in a feed. Each post supports
**likes**, **comments**, and **shares**, with counts maintained alongside the post
and displayed on the feed cards. On the frontend, post state is managed through a
dedicated Pinia store so that engagement actions update the UI optimistically.

### Stories
Stories are temporary content that **expire automatically**. Each story carries an
expiry timestamp; expired stories are filtered out when the feed is queried, so no
manual cleanup is required for the viewer experience. The stories feature is
backed by its own service and store on the frontend.

### Media uploads
Rather than embedding binary data in the API or database, media attached to posts
and stories is uploaded to the standalone **Rust file service** ("Sheep"). The
service stores the file and returns a URL, which the content entity references.
This keeps the primary database lean and lets media serving scale independently.

### Implementation notes
- The stories and posts stores centralize fetching, creating, and deleting
  content.
- Engagement endpoints (like/comment/share) update counts and emit events that
  can drive notifications.
