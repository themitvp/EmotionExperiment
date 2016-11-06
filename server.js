// set up ======================================================================
var express = require('express');
var app = express(); 
var mongoose = require('mongoose'); 				
var port = 3000;
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/db';

// configuration ===============================================================


// Use connect method to connect to the Server
mongoose.connect(url);

app.use(express.static('./public')); 
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request



// routes ======================================================================
var Participant = mongoose.model('Participant', {
	name: Number,
	appearance: {
		age: String,
		gender: String,
		glasses: String,
		ethnicity: String
	},
	images: [ 
	{
		imageName: String,
		trueValence: Number,
		trueArousal: Number,
		samValence: Number,
		samArousal: Number,
		inputs: [
		{
			timestamp: Number,
			emotions: {
				joy: Number,
				anger: Number,
				contempt: Number,
				disgust: Number,
				engagement: Number,
				fear: Number,
				joy: Number,
				sadness: Number,
				surprise: Number,
				valence: Number,
			}
		}
		]
	}
	]
});

function getAll(res) {
    Participant.find(function (err, all) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(all); // return all todos in JSON format
    });
};

app.post('/api/newUser', function (req, res) {
	Participant.create({
            name: req.body.participantId,
            appearance: req.body.appearance,
            images: []
        }, function (err, participant) {
            if (err)
                res.send(err);

            getAll(res);
        });

    })

// POST method route
app.post('/api/saveNewImage', function (req, res) {
	Participant.findOne({ name: req.body.participantId }, function(err, doc) {
		if (err)
			res.send(err);

		doc.images.push({
	    	imageName: req.body.imageName,
	    	trueValence: req.body.trueValence,
	    	trueArousal: req.body.trueArousal,
	    	samValence: req.body.samValence,
	    	samArousal: req.body.samArousal,
			inputs: req.body.inputs
	    });

	    doc.save();

	    getAll(res);
	});
})

app.get('*', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);