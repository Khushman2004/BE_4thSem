const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} request for ${req.url}`);
    next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public'))); 

const getPosts = () => {
    if (!fs.existsSync('posts.json')) return [];
    const data = fs.readFileSync('posts.json', 'utf8');
    return JSON.parse(data);
};

const savePosts = (posts) => {
    fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2), 'utf8');
};

app.get('/posts', (req, res) => {
    const posts = getPosts();
    res.render('home', { posts });
});

app.get('/post', (req, res) => {
    const posts = getPosts();
    const post = posts.find(p => p.id === parseInt(req.query.id));
    if (post) {
        res.render('post', { post });
    } else {
        res.status(404).send('Post not found');
    }
});

app.get('/add-post', (req, res) => {
    res.render('addpost');
});

app.post('/add-post', (req, res) => {
    const posts = getPosts();
    const newPost = {
        id: posts.length ? posts[posts.length - 1].id + 1 : 1,
        title: req.body.title,
        content: req.body.content
    };
    posts.push(newPost);
    savePosts(posts);
    res.redirect('/posts');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
