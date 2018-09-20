firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";
    document.getElementById("list").style.display = "block";


    var user = firebase.auth().currentUser;

    if(user != null){

      var email_id = user.email;
      document.getElementById("user_para").innerHTML = "Admin : " + email_id + "  <a id='logout' onclick='logout();'>Logout</a>";
      loadDB();
    }

  } else {
    // No user is signed in.
    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";
    document.getElementById("list").style.display = "none";

  }
});

function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    swal("Login Failed",errorMessage,"error");
    // ...
  });

}

function logout(){
  firebase.auth().signOut();
}

function loadDB() {
  var database = firebase.database().ref('quiz');
  database.on("value", function(snapshot) {
    var i = 0;
    document.getElementById("data").innerHTML = "";
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      i++;
      document.getElementById("data").appendChild(createRow(childData,i));
    });
  });
}

function createRow(childData , i) {
    var trTag = document.createElement("tr");
    var thTag = document.createElement("th");
    thTag.scope = "row";
    thTag.innerHTML = i;
    var id = document.createElement("td");
    id.innerHTML = childData.id;
    var name = document.createElement("td");
    name.innerHTML = childData.name;
    var grade = document.createElement("td");
    grade.innerHTML = childData.grade;
    var time = document.createElement("td");
    time.innerHTML = childData.time;
    trTag.appendChild(thTag);
    trTag.appendChild(id);
    trTag.appendChild(name);
    trTag.appendChild(grade);
    trTag.appendChild(time);
    return trTag;
}

