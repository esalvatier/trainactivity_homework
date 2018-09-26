$(document).ready(function(){
  var config = {
    apiKey: "AIzaSyDjpEo9Vh5iPh4GE-sPh7Hker_p7sT5hUE",
    authDomain: "train-homework-2cee2.firebaseapp.com",
    databaseURL: "https://train-homework-2cee2.firebaseio.com",
    projectId: "train-homework-2cee2",
    storageBucket: "train-homework-2cee2.appspot.com",
    messagingSenderId: "39342639214"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  function format(trainObj) {
    var trainName = trainObj.name;
      var trainDest = trainObj.destination;
      var trainStart = trainObj.firstTrain;
      var trainFrequency = parseInt(trainObj.frequency);
      var firstTimeConverted = moment(trainStart, "HH:mm").subtract(1, "years");
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      var tRemainder = diffTime % trainFrequency;
      var tMinutesTillTrain = trainFrequency - tRemainder;
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainFrequency),
        $("<td>").text(moment(nextTrain).format("hh:mm")),
        $("<td>").text(tMinutesTillTrain)
      );
      $("#train-table").append(newRow);
  }

  database.ref().once("value", function(snapshot){
    snapshot.forEach(function(current) {
      format(current.val());
    });
  });

  $(document.body).on("click", "#add-train-btn", function(event) {
    event.preventDefault();
    var name = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#start-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    database.ref().push({
      name: name,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    });
    $("#train-form")[0].reset();
    database.ref().limitToLast(1).once("child_added", function(childSnapshot) {
      format(childSnapshot.val());
    });
  });
});