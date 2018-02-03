//Configuration used to connect to train-schedule-b0417 firebase database
var config = {
    apiKey: "AIzaSyA4-EyESvDwtWKrPwvba1ndwarZrKgYy9M",
    authDomain: "train-schedule-b0417.firebaseapp.com",
    databaseURL: "https://train-schedule-b0417.firebaseio.com",
    projectId: "train-schedule-b0417",
    storageBucket: "",
    messagingSenderId: "261651118064"
  };
  //Initializes Firebase
  firebase.initializeApp(config);

  //Shorthand for firebase path
  var database = firebase.database();

  	//When the submit button is clicked, push user input data to firebase
	$("#add-train-btn").on("click", function(event) {
		//Prevents the DOM from automatically refresh after the submit button click event
		event.preventDefault();

		//Stores the name of the train
		var trainName = $("#name-input").val().trim();
		
		//Stores the destination entry
		var trainDestination = $("#destination-input").val().trim();
		
		//Converts the first train time to unix in seconds and stores the value
		var trainTime = moment($("#train-time-input").val().trim(), "HH:mm").format("X");
		
		//Stores the frequency of the train the user entered
		var trainFrequency = $("#frequency-input").val().trim();
		
		//Creates local "temporary" object for holding train data
		var newTrain = {
		name: trainName,
		destination: trainDestination,
		time: trainTime,
		frequency: trainFrequency
	};

	// Uploads train data to the database
	database.ref().push(newTrain);
	alert("Train successfully added");

	// Clears all of the text-boxes
	$("#name-input").val("");
	$("#destination-input").val("");
	$("#train-time-input").val("");
	$("#frequency-input").val("");
	});

	//On a firebase event, a new train schedule row is added to the tbody
	database.ref().on("child_added", function(childSnapshot, prevChildKey) {
	
	//First, we store the snapshot values for each key into a variable
	var trainName = childSnapshot.val().name;
	var trainDestination = childSnapshot.val().destination;
	var trainTime = childSnapshot.val().time;
	var trainFrequency = childSnapshot.val().frequency;

	//Convert the first train time from hex to hh:mm format
	var firstTrain = moment.unix(trainTime).format("hh:mm");
	
	//Store this moment's time
    var currentTime = moment();
    
    //Assign the difference between this moment and the time from the first train to the variable diffTime
    var diffTime = moment().diff(moment.unix(trainTime, "X"), "minutes");
    
    //Whatever remains from dividing the total time of service of the day(diffTime) by the train frequency(trainFrequency)
    var tRemainder = diffTime % trainFrequency;
    
    //The difference determines how many minutes remain before the next train arrives
    var tMinutesTillTrain = trainFrequency - tRemainder;
    
    //Adds the minutes remaining until the next train arrives to the current time
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    
    //The next train time is formatted in hh:mm
    var arrivalTime = moment(nextTrain).format("hh:mm");
    
    //Appends new train schedule entry from firebase to the DOM
    $(".body").append($("<tr><td>" + trainName + "</td>" + "<td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + firstTrain + "</td><td>" + arrivalTime + "</td><td>" + tMinutesTillTrain + "</td></tr>"));
});
