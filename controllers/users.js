function create(req, res) {
    const db = req.app.get('db');
  
    const { email, password } = req.body;
  
    db.users
    .insert(
      {
        email,
        password,
        user_profiles: [
          // this is what is specifying the object
          // to insert into the related 'user_profiles' table
          {
            userId: undefined,
            about: null,
            thumbnail: null,
          },
        ],
      },
      {
        deepInsert: true, // this option here tells massive to create the related object
      }
    )
    .then(user => res.status(201).json(user))
    .catch(err => {
      console.error(err);
    });
  }
  
  function list(req, res) {
    const db = req.app.get('db');
  
    db.users
      .find()
      .then(users => res.status(200).json(users))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  }

  function getById(req, res) {
    const db = req.app.get('db');
  
    db.users
      .findOne(req.params.id)
      .then(user => res.status(200).json(user))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  }

  function getProfile(req, res) {
    const db = req.app.get('db');
  
    db.user_profiles
      .findOne({
        userId: req.params.id,
      })
      .then(profile => res.status(200).json(profile))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  }
  

  function createPost(req, res){
    const db = req.app.get('db');
    const {userId, content} =  req.body;

    db.posts
    .insert({
        userId,
        content,
      })
    .then(posts => res.status(201).json(posts))
    .catch(err => {
      console.error(err);
    });
  }

  function getPost(req, res){
      const db = req.app.get('db');
      const commentArr = [];
        if(req.query.comments === ''){
            db.posts
            .find(req.params.id)
            .then(post => {
                commentArr.push(post)
                db.comments.find({
                    postId: req.params.id
                })
                .then(com => {
                    commentArr.push(com)
                    res.status(200).json(commentArr)
                })
            })
            .catch(err => {
              console.error(err);
              res.status(500).end();
            });
          }
        
        else{
            db.posts
            .findOne(req.params.id)
            .then(post => res.status(200).json(post))
            .catch(err => {
              console.error(err);
              res.status(500).end();
            });
        }

     
  }

  function getAllPost(req, res){
      const db = req.app.get('db');
      
      db.posts
      .find({
          userId: req.params.id
      })
      .then(post => res.status(200).json(post))
      .catch(err =>{
          console.err(err);
          res.status(500).end()
      })
    }

    function createComment(req, res){
        const db = req.app.get('db');
        const {userId, postId, comment} = req.body

        db.comments
        .insert({
            userId,
            postId,
            comment
          })
        .then(comment => res.status(201).json(comment))
        .catch(err => {
          console.error(err);
        });
    }
    
    function editPost(req, res){
        const db = req.app.get('db')

        const {content} = req.body

        db.posts
        .update({
            id: req.params.id
        },
        {
            content: content
        })
        .then(post => res.status(201).json(post))
        .catch(err => {
            console.error(err);
          });
    }

    function editComment(req, res){
        const db = req.app.get('db')

        const {comment} = req.body

        db.comments 
        .update({
            userId: req.params.userId,
            id: req.params.id
        },
        {
            comment: comment
        })
        .then(comment => res.status(201).json(comment))
        .catch(err => {
            console.error(err);
          });
    }


 
  
  module.exports = {
    create,
    list,
    getById,
    getProfile,
    createPost,
    getPost,
    getAllPost,
    createComment,
    editPost,
    editComment
  };