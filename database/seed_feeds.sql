-- Developer & Engineering Blogs
INSERT INTO feeds (name, url, description) VALUES
  ('The Pragmatic Engineer', 'https://blog.pragmaticengineer.com/rss/', 'Observations on software engineering by Gergely Orosz'),
  ('Dev.to', 'https://dev.to/feed', 'Where programmers share ideas and help each other grow'),
  ('Smashing Magazine', 'https://www.smashingmagazine.com/feed/', 'For Web Designers And Developers'),
  ('CSS-Tricks', 'https://css-tricks.com/feed/', 'Daily articles about CSS, HTML, JavaScript, and all things related to web design and development'),
  ('GitHub Blog', 'https://github.blog/feed/', 'Updates, ideas, and inspiration from GitHub'),
  ('Martin Fowler', 'https://martinfowler.com/feed.atom', 'Discussions on software architecture, design, and agile methodologies');

-- LLM & AI Engineering News
INSERT INTO feeds (name, url, description) VALUES
  ('OpenAI Blog', 'https://openai.com/news/rss.xml', 'Official OpenAI announcements and research'),
  ('Hugging Face Blog', 'https://huggingface.co/blog/feed.xml', 'The machine learning community'),
  ('Google DeepMind', 'https://deepmind.google/discover/blog/feed/', 'Latest news and research from Google DeepMind'),
  ('BAIR (Berkeley AI Research)', 'https://bair.berkeley.edu/blog/feed.xml', 'Berkeley Artificial Intelligence Research Blog'),
  ('Simon Willison’s Weblog', 'https://simonwillison.net/atom/everything/', 'Web development, AI, and LLM experiments'),
  ('Last Week in AI', 'https://lastweekin.ai/feed', 'A summary of the latest AI news and research');

-- Cloud & MLOps
INSERT INTO feeds (name, url, description) VALUES
  ('AWS Machine Learning Blog', 'https://aws.amazon.com/blogs/machine-learning/feed/', 'Practical machine learning tutorials and updates from AWS'),
  ('NVIDIA Developer Blog', 'https://developer.nvidia.com/blog/feed/', 'News and updates for developers from NVIDIA'),
  ('Neptune.ai', 'https://neptune.ai/blog/category/mlops/feed/', 'Practical content on designing, coding, and deploying ML models');
