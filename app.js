
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//mongoose.connect("mongodb://localhost:27017/wikiDB", {useUnifiedTopology: true, useNewUrlParser: true});
const mongoString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lzeq8.mongodb.net/wikiDB`

mongoose.connect(mongoString, {useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("error", function(error) {
  console.log(error)
});

mongoose.connection.on("open", function() {
  console.log("Connected to MongoDB database.")
});


const articleSchema={
  title: String,
  content: String
}


const Article = mongoose.model("Article", articleSchema )


/****************Chain route handlers using express*/
///////////////////////////Request targeting all articles//////////////////////////////
app.route("/articles")
.get(function(req, res){
 //Quering our databse to find all the articleSchema
 Article.find({}, function(err, foundArticles){

   if(!err){
     res.send(foundArticles);
   }else{
     res.send(err)
   }

 })

})
.post(function(req, res){

  //Create a new document in our database
  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });

  newArticle.save(function(err){

    if(!err){
      res.send("Articles successfully saved")
    }else{
      res.send(err)
    }
  })
})
.delete(function(req, res){

  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all articles.")
    }else{
      res.send(err);
    }
  });
});


//////////////////////////Request targeting specific articles///////////////////////////

app.route("/articles/:articleTitle")
.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle)
    }else{
      res.send("No articles matching that title was found")
    }
  });
})

/////////////////////////////**********PUT****************////////////////////////////////
/*PUT method is used to update resource available on the server. Typically, it replaces whatever exists at the target URL with something else.
 You can use it to make a new resource or overwrite an existing one. PUT requests that the enclosed entity must be stored under the supplied requested URI (Uniform Resource Identifier).*/
.put(function(req, res){

  Article.update(
    {title: req.params.articleTitle},//this saves the parameter the user types in his browser
    {title:req.body.title, content: req.body.content},//
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      }
    }

  );
})

//////////////////////////////**************PATCH************************///////////////////////
/*When a client needs to replace an existing Resource entirely, they can use PUT. When they're doing a partial update, they can use HTTP PATCH.*/
.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("successfully updated article.");
      }else{
        res.send(err);
      }
    }


  );
})

////////////////////////******************Delete************************/////////////////////////
.delete(function(req, res){

  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Deleted successfully")
      }else{
        res.send(err)
      }
    }
  );
})






app.listen(3000, function() {
  console.log("my server has already started @ port 3000");
});
