

document.getElementById('google-login').addEventListener('click', loginWithGoogle);

function loginWithGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
      .then((result) => {
          var user = result.user;
          console.log(user);
      })
      .catch((error) => {
          console.log(error);
      });
}

console.log("working");

firebase.auth().onAuthStateChanged((user) => {
    var loginForm = document.getElementById('login-form');
    var urlDiv = document.getElementById('url-div');

    if (user) {
        // User is signed in.
        loginForm.style.display = 'none';
        urlDiv.style.display = 'block';
        discriber.innerHTML = "Logged In";
    } else {
        // User is signed out.
        loginForm.style.display = 'block';
        urlDiv.style.display = 'none';
        discriber.innerHTML = "Please Login First";
    }
});

var logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', logout);

function logout() {
    firebase.auth().signOut()
        .then(() => {
            // Sign-out successful.
            console.log("User signed out");
        })
        .catch((error) => {
            // An error happened.
            console.log(error);
        });
}


document.getElementById('submit').addEventListener('click', loginWithEmail);

function loginWithEmail() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  
  firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
          // Signed in
          var user = userCredential.user;
          console.log(user);
          
          // showDashboard(); 
      })
      .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.error("Email login error:", errorCode, errorMessage);
      });
}

// Sign up with Email
document.getElementById('signup').addEventListener('click', signUpWithEmail);

function signUpWithEmail() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed up
            var user = userCredential.user;
            console.log("User created:", user);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error("Signup error:", errorCode, errorMessage);
        });
}


let store = document.getElementById('store-url');

store.addEventListener('click', ()=> {
    let url = document.getElementById('url').value;
    console.log(url);
    url = url.trim();
});







