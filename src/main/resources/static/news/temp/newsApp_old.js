'use strict';

var posts = [
    {
        postId: '58947654678957468',
        postOwner: 'owner 1',
        postTitle: 'Topic 1',
        postDate: '22.02.2018 13:23',
        postText: 'Go all to drinking party! part 1',
        postComment: [
            '2457258472457',
            '9058469548668',
            '2394782374244',
            '3458235943533',
            '3455345543545'
        ],
        postLike: [
            '42554-345345-54345',
            '56757-664566-34534'
        ],
        postFavorite: 'true',
    },
    {
        postId: '22947654678957468',
        postOwner: 'owner 2',
        postTitle: 'Topic 2',
        postDate: '23.02.2018 13:23',
        postText: 'Go all to drinking party! part 2',
        postComment: [
            '3457258472457',
            '3058469548668',
            '3458235943533',
            '3455345543545'
        ],
        postLike: [
            '32554-345345-54345',
            '36757-664566-34534'
        ],
        postFavorite: 'false',
    },
    {
        postId: '33347654678957468',
        postOwner: 'owner 3',
        postTitle: 'Topic 3',
        postDate: '24.02.2018 13:23',
        postText: 'Go all to drinking party! part 3',
        postComment: [
            '4457258472457',
            '4058469548668',
            '4394782374244'
        ],
        postLike: [
            '46757-664566-34534'
        ],
        postFavorite: 'true',
    },
];

function toHidePost() {
    var post;
    post = document.getElementById('postTemplate');

    if (post.hasAttribute('hidden')) {
        console.log('was hidden');
        post.removeAttribute('hidden');
    }
    else {
        console.log('was not hidden');
        post.setAttribute('hidden', 'hidden');
    }
    console.log('element: ', post);
}

function toAddPost() {
    let defaultPost = document.getElementById('postTemplate');
    console.log('new post: ', defaultPost);

    let newPost = defaultPost.cloneNode(true);
    newPost.setAttribute('id', 'post_01');
    console.log('new post: ', newPost);
    let parent = defaultPost.parentNode;
    parent.appendChild(newPost);
    //newPost.insertBefore(defaultPost);
}

function toViewAllPosts(posts) {
    let postTemplate = document.getElementById('postTemplate');
    let parent = postTemplate.parentNode;

    for (var post of posts) {
        let newPost = postTemplate.cloneNode(true);
        if (newPost.hasAttribute('hidden')) {
            newPost.removeAttribute('hidden');
        }

        newPost.setAttribute('id', post.postId);
        newPost.getElementsByClassName('postOwner')[0].textContent = post.postOwner;
        newPost.getElementsByClassName('postTitle')[0].textContent = post.postTitle;
        newPost.getElementsByClassName('postDate')[0].textContent = post.postDate;
        newPost.getElementsByClassName('postText')[0].textContent = post.postText;
        newPost.getElementsByClassName('postComment')[0].textContent = post.postComment.length;
        newPost.getElementsByClassName('postLike')[0].textContent = post.postLike.length;
        console.log('favorite: ', post.postFavorite);
        if (post.postFavorite === 'true') {
            newPost.getElementsByClassName('postFavorite')[0].className = 'postFavorite fa fa-star';
        } else {
            newPost.getElementsByClassName('postFavorite')[0].className = 'postFavorite fa fa-star-o';
        }

        parent.appendChild(newPost);
    }

}

toViewAllPosts(posts);
