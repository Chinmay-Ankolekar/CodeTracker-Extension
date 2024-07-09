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

  document.getElementById("login").addEventListener("click", loginWithEmail);
  
  async function loginWithEmail() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
  
    try {
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      let user = userCredential.user;
      console.log(firebase.auth().currentUser);
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
    let username = document.getElementById("username").value; 
    try {
        const userCredential = await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({
            displayName: username
        });
        console.log("User created:", userCredential.user);
    } catch (error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        alert("Signup error:", errorCode, errorMessage);
    }
}

  firebase.auth().onAuthStateChanged((user) => {
    let loginForm = document.getElementById("login-form");
    let urlDiv = document.getElementById("url-div");
    let userEmail = document.getElementById("user");
  
    if (user) {
      loginForm.style.display = "none";
      urlDiv.style.display = "block";
      userEmail.innerHTML = "Username: "+ user.displayName;
    } else {
      loginForm.style.display = "block";
      urlDiv.style.display = "none";
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

function getCurrentTabUrl() {
  chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
      const response = await chrome.tabs.sendMessage(tabs[0].id, { type: 'getTabUrl' });
      if (response && response.url && response.url.includes('leetcode.com/problems/')) {
        console.log(response.url);
            var urlSegments = response.url.split('/');
             console.log(urlSegments);
             let problemName = urlSegments[4];
             console.log(problemName);

          try {
              const headersList = {
                  "Accept": "*/*",
                  "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                  "Content-Type": "application/json"
              };
              const gqlBody = {
                  query: `query questionHints($titleSlug: String!) {
                      question(titleSlug: $titleSlug) {
                          title
                          difficulty
                          topicTags {
                              name
                          }
                      }
                  }`,
                  variables: {"titleSlug": problemName}
              };
              const bodyContent = JSON.stringify(gqlBody);
              const ApiResponse = await fetch("https://leetcode.com/graphql", { 
                  method: "POST",
                  body: bodyContent,
                  headers: headersList
              }); 
              const data = await ApiResponse.json();
              console.log("Question Details:", data);

              const questionDetails = {
                  title: data.data.question.title,
                  difficulty: data.data.question.difficulty,
                  topics: data.data.question.topicTags.map(topic => topic.name),
                  link: response.url,
                  time: new Date().toISOString()
              };
              console.log(response.url);

              firebase.auth().onAuthStateChanged(user => {
                  if (user) {
                      questionDetails.email = user.email;
                      questionDetails.uid = user.uid;
                      console.log("User Email:", user.email);
                      console.log("User UID:", user.uid);
                  } else {
                      console.log("No user signed in.");
                  }
              });

              document.getElementById("name").value = "Name: " + questionDetails.title;
              document.getElementById("difficulty").value = "Difficulty: " + questionDetails.difficulty;
              document.getElementById("topics").value = "Topics: " + questionDetails.topics.join(", ");
              console.log("Question Details:", questionDetails);

              const submitBtn = document.getElementById("submit-btn");
              submitBtn.addEventListener("click", async () => {
                const status = document.getElementById("status");
               status.innerText = "Question details posted successfully!";
                  try {
                      console.log("Posting question details to the backend:", questionDetails);
                      const res = await fetch("http://localhost:8000/question", {
                          method: "POST",
                          headers: {
                              "Content-Type": "application/json",
                          },
                          body: JSON.stringify(questionDetails),
                      });
                      const data = await res.json();
                      alert("Question details Saved successfully!");
                      console.log("Response from backend:", data);
                  } catch (error) {
                      console.error("Error posting question details to the backend:", error);
                  }
              });
          } catch (error) {
              console.error("Error fetching or processing question details:", error);
          }
      }
  });
}

getCurrentTabUrl();

const signupBtn = document.getElementById("signup-btn");
signupBtn.addEventListener("click", () => {
    let username = document.getElementById("username");
     username.style.display = "block";
     let loginBtn = document.getElementById("login-btn");
     signupBtn.style.display = "none";
      loginBtn.style.display = "Block";
      let login = document.getElementById("login");
      login.style.display = "none";
      let signup = document.getElementById("signup");
      signup.style.display = "block";
});

const loginBtn = document.getElementById("login-btn");
loginBtn.addEventListener("click", () => {
    let username = document.getElementById("username");
     username.style.display = "none";
     let signupBtn = document.getElementById("signup-btn");
     loginBtn.style.display = "none";
      signupBtn.style.display = "Block";
      let login = document.getElementById("login");
      login.style.display = "block";
      let signup = document.getElementById("signup");
      signup.style.display = "none";
});





