
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

// Initial Values
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;
var currentTime = moment();
var index = 0;
var trainIDs = [];

// Show current time
var datetime = null,
date = null;

var update = function () {
  date = moment(new Date())
  datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
};

$(document).ready(function(){
  datetime = $('#current-status')
  update();
  setInterval(update, 1000);
});

$("#add-train").on("click", function() {

  trainName = $("#train-name").val().trim();
  destination = $("#destination").val().trim();
  firstTrainTime = $("#train-time").val().trim();
  frequency = $("#frequency").val().trim();

  var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  var tRemainder = diffTime % frequency;
  var minutesAway = frequency - tRemainder;
  var nextTrain = moment().add(minutesAway, "minutes");
  var nextArrival = moment(nextTrain).format("hh:mm a");

  var nextArrivalUpdate = function() {
    date = moment(new Date())
    datetime.html(date.format('hh:mm a'));
  }

  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    minutesAway: minutesAway,
    nextArrival: nextArrival,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

  $("#train-name").val("");
  $("#destination").val("");
  $("#train-time").val("");
  $("#frequency").val("");

  return false; 
});

  database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {

  // Change the HTML to reflect
  $("#new-train").append("<tr><td>" + snapshot.val().trainName + "</td>" +
    "<td>" + snapshot.val().destination + "</td>" +
    "<td>" + "Every " + snapshot.val().frequency + " mins" + "</td>" +
    "<td>" + snapshot.val().nextArrival + "</td>" +
    "<td>" + snapshot.val().minutesAway + " mins until arrival" + "</td>" +
    "</td></tr>");

  });
