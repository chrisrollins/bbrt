var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();

app.use(express.static(path.join(__dirname, "./static"))); 
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/mongoose");

var UserSchema = new mongoose.Schema(
	{
		name: {type: String},
		score: {type: String},
		percentage: {type: String}
	}, {timestamps: true});
mongoose.model("User", UserSchema);
var User = mongoose.model("User");

var QuestionSchema = new mongoose.Schema(
	{
		question: {type: String, required: true},
		realAnswer: {type: String, required: true},
		fakeAnswer1: {type: String, required: true},
		fakeAnswer2: {type: String, required: true}
	}, {timestamps: true});
mongoose.model("Question", QuestionSchema);
var Question = mongoose.model("Question");


//////Generate base test questions
Question.find({}, function(err, questions)
{
	for(var i = questions.length; i < 5; i++)
	{
		var questionInstance = new Question();
		questionInstance.question = `test question ${i}`;
		questionInstance.realAnswer = `real answer`;
		questionInstance.fakeAnswer1 = `fake 1`;
		questionInstance.fakeAnswer2 = `fake 2`;
		questionInstance.save(function(err){
			//
		});
	}
});
/////


app.get("/clear_data", function(req, res){
	Question.remove({}, function(err){});
	User.remove({}, function(err){});
	res.redirect("/");
});

app.get("/questions", function(req, res)
{
	Question.find({}, function(err, questions)
	{
		if(err)
		{
			console.log("Error", err);
			res.json(err);
		}
		else
		{
			console.log(questions);
			res.json(questions);
		}
	});
});

app.get("/users", function(req, res)
{
	User.find({}, function(err, users)
	{
		if(err)
		{
			console.log("Error", err);
			res.json(err);
		}
		else
		{
			console.log(users);
			res.json(users);
		}
	});
});

app.post("/new_user", function(req, res){
	var userInstance = new User();
	userInstance.name = req.body.name;
	userInstance.score = req.body.score;
	userInstance.percentage = req.body.percentage;
	userInstance.save(function(err){
		if(err)
		{
			res.sendStatus(500);
		}
		else
		{
			res.json(userInstance);
		}
	});
});

app.post("/new_question", function(req, res)
{
	console.log("incoming data:",req.body);

	var questionInstance = new Question();
	questionInstance.question = req.body.question;
	questionInstance.realAnswer = req.body.realAnswer;
	questionInstance.fakeAnswer1 = req.body.fakeAnswer1;
	questionInstance.fakeAnswer2 = req.body.fakeAnswer2;

	if(!req.body.question || !req.body.realAnswer || !req.body.fakeAnswer1 || !req.body.fakeAnswer2)
	{
		res.sendStatus(500);
	}
	else
	{
		questionInstance.save(function(err)
		{
			console.log(questionInstance);
			if(err)
			{
				res.sendStatus(500);
			}
			else
			{
				res.json(questionInstance);
				console.log(questionInstance._id);
			}
		});
	}
});

app.post("/submit_quiz", function(req, res){
	User.update({_id: req.body._id}, {score: req.body.score}, function(err)
	{
		res.sendStatus(200);
	});
});

var port = 8000;
var server = app.listen(port, function()
{
	console.log(`listening on port ${port}`);
});