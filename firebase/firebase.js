const firebaseConfig = {
  apiKey: "AIzaSyAzOFyUtRyHyHIn-4RuwmEsPwQCWBQCCeo",
  authDomain: "leetcode-tracker-6f022.firebaseapp.com",
  databaseURL:
    "https://leetcode-tracker-6f022-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "leetcode-tracker-6f022",
  storageBucket: "leetcode-tracker-6f022.appspot.com",
  messagingSenderId: "1018319647499",
  appId: "1:1018319647499:web:7fecdef6a5cee20192680e",
  measurementId: "G-EW08MHQ81B",
};

firebase.initializeApp(firebaseConfig);

document
  .getElementById("google-login")
  .addEventListener("click", loginWithGoogle);

function loginWithGoogle() {
  let provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      let user = result.user;
      console.log(user);
    })
    .catch((error) => {
      console.log(error);
    });
}

console.log("working");

firebase.auth().onAuthStateChanged((user) => {
  let loginForm = document.getElementById("login-form");
  let urlDiv = document.getElementById("url-div");

  if (user) {
    loginForm.style.display = "none";
    urlDiv.style.display = "block";
    discriber.innerHTML = "Logged In";
  } else {
    loginForm.style.display = "block";
    urlDiv.style.display = "none";
    discriber.innerHTML = "Please Login First";
  }
});

let logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", logout);

async function logout() {
  try {
    await firebase.auth().signOut();
    console.log("User signed out");
  } catch (error) {
    console.error(error);
  }
}

document.getElementById("submit").addEventListener("click", loginWithEmail);

async function loginWithEmail() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  try {
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    let user = userCredential.user;
    console.log(user);
  } catch (error) {
    let errorCode = error.code;
    let errorMessage = error.message;
    alert("Email login error:", errorCode, errorMessage);
  }
}

document.getElementById("signup").addEventListener("click", signUpWithEmail);

async function signUpWithEmail() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  try {
    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    console.log("user cred", userCredential);
    let user = userCredential.user;
    console.log("User created:", user);
  } catch (error) {
    console.error("Signup error:", errorCode, errorMessage);
  }
}

const urlInput = document.getElementById("url");
const submitUrl = document.getElementById("store-url");

submitUrl.addEventListener("click", async () => {
  console.log(urlInput.value);

  let url = urlInput.value;

  const getQuestionSlug = async () => {
    try {
      const res = await fetch(`https://lcid.cc/info/${url}`);
      const data = await res.json();
      const questionTitle = data.titleSlug;
      getQuestionDetails(questionTitle);
      console.log(`first console ${questionTitle}`);
    } catch (error) {
      console.log(error);
    }
  };

  getQuestionSlug();

  const postQuestionDetails = async (questionDetails) => {
    try {
      console.log("Posting question details to the backend:", questionDetails);
      const res = await fetch("http://localhost:8000/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionDetails),
      });
      const data = await res.json();
      console.log("Response from backend:", data);
    } catch (error) {
      console.error("Error posting question details to the backend:", error);
    }
  };

  const getQuestionDetails = async (questionTitle) => {
    try {
      const res = await fetch(
        `https://alfa-leetcode-api.onrender.com/select?titleSlug=${questionTitle}`
      );
      const data = await res.json();
      const questionDetails = {
        title: data.questionTitle,
        difficulty: data.difficulty,
        link: data.link,
      };
      console.log("Question Details:", questionDetails);
      await postQuestionDetails(questionDetails);
    } catch (error) {
      console.error("Error fetching or processing question details:", error);
    }
  };
});
