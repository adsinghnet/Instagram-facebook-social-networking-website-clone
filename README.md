# Social media clone => Instagram & Facebook
The architecture of both the applications are same.
Choose one of them as required


## How to run:
- Add your MongoDB Local/Atlas URI in .env file in server folder.
***For Example:***
![Database Example](database.png)

```
# Database (For testing purpose only)
ATLAS_URI = mongodb+srv://ad1234:ad1234@cluster1.bqwhs.mongodb.net/instagram?retryWrites=true&w=majority
```

```
# Install dependencies and run backend
cd server
npm install
npm start
```

```
# Install dependencies and run frontend
cd client
npm install
npm start
```



## Features:

- Each Post have Name , Username ,Profile picture, Date , and Picture to be 
uploaded along with some text.
- RESTful Architecture.
- A homepage like instagram.com ,that should display all the Posts added 
by different users so far.
- User can create new Post, edit or update, delete and show particular Post
i.e implementation of full CRUD. functionality for each Post.
- User authentication (local strategy).
- Comment functionality.
- User can see all the Post added by him/her seperately.
- Complete profile page for particular user displaying username, no.of 
posts, followers and following.
- Like /dislike feature for each Post.
- Real Time Chatting functionality using sockets.
- Follow/unfollow functionality for each user.

## Instagram clone Demo:
![Demo](instaclone.gif)

## Facebook clone Demo:
![Demo](fbclone.gif)


## Live web application (instagram):
***[https://instagram-frontend-ad.vercel.app/](https://instagram-frontend-ad.vercel.app/)***
## Demo Username (password is same as username):
- sumankalla
- sumitlata
- kirancherian
- minalidyal
- haimikakar
- nikhilverma
- kanvarpratapsingh
- arshdeepsingh
- nilimasahni
- harishchopra

## Personal Website:
***[http://projects.adsingh.net/](http://projects.adsingh.net/)***
***[https://vfxguy.net/](https://vfxguy.net/)***