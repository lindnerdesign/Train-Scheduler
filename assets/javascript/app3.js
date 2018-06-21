$( document ).ready(function() {
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBKNdZo-Gc4LMKTaLrpNi7UBT-zKZYo1XA",
  authDomain: "train-scheduler-c79fa.firebaseapp.com",
  databaseURL: "https://train-scheduler-c79fa.firebaseio.com",
  projectId: "train-scheduler-c79fa",
  storageBucket: "train-scheduler-c79fa.appspot.com",
  messagingSenderId: "1087134294202"
};

firebase.initializeApp(config);

var database = firebase.database();

// button to submit the user given info
$("#submit").on("click", function(event) {
 event.preventDefault();

 var trainName = $("#name").val().trim();
 var destination = $("#dest").val().trim();
 var firstTime = moment($("#firstTime").val().trim(), "hh:mm").subtract(1, "years").format("X");
 var frequency = $("#freq").val().trim();

 //current time
 var currentTime = moment();
 //console.log("CURRENT TIME: " +  moment(currentTime).format("hh:mm"));

 //gathers together all our new train info
 var newTrain = {
   train: trainName,
   trainGoing: destination,
   trainComing: firstTime,
   everyXMin: frequency
 };


 //uploads newTrain to firebase
 database.ref().push(newTrain);

 //clears elements before adding new text
 $("#name").val("");
 $("#dest").val("");
 $("#firstTime").val("");
 $("#freq").val("");

 return false;

});


database.ref().on("child_added", function(childSnapshot, prevChildKey) {

   console.log(childSnapshot.val());
   //store in variables
   var trainName = childSnapshot.val().train;
   var destination =childSnapshot.val().trainGoing;
   var firstTime = childSnapshot.val().trainComing;
   var frequency = childSnapshot.val().everyXMin;

   //makes first train time neater
   var trainTime = moment.unix(firstTime).format("hh:mm");
   //calculate difference between times
   var difference =  moment().diff(moment(trainTime),"minutes");

   //time apart(remainder)
   var trainRemain = difference % frequency;

   //minutes until arrival
   var minUntil = frequency - trainRemain;

   //next arrival time
   var nextArrival = moment().add(minUntil, "minutes").format('hh:mm');

   //adding info to DOM table
   $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minUntil + "</td></tr>");

});
});
