# 3.1.2. Community Content Engine (Content Domain)

The Content domain provides the social layer that keeps the community active
beyond pure job transactions.

### Requirements
- **Posts.** Users can create posts with text and media. Posts support
  **likes**, **comments**, and **shares**.
- **Stories.** Users can publish temporary **stories** that expire automatically
  after a set period.
- **Media handling.** Images and documents attached to content are uploaded
  through the standalone Rust file service ("Sheep") rather than stored inline.
- **Feeds.** Content is surfaced in a feed, with engagement counts displayed on
  each item.

### Acceptance criteria
- A story is no longer visible once its expiry time has passed.
- Likes, comments, and shares update their counts in the feed.
- Uploaded media is served from the file service and referenced by URL, not
  embedded in the primary database.
