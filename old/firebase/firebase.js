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
  
    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      console.log("user cred", userCredential);
      let user = userCredential.user;
      console.log("User created:", user);
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
      userEmail.innerHTML = "User Email: "+ user.email;
      // discriber.innerHTML = `Hi ${user.email}`;
    } else {
      loginForm.style.display = "block";
      urlDiv.style.display = "none";
      // discriber.innerHTML = "";
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

  function getCurrentTabUrl(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'getTabUrl' }, function (response) {
            console.log(response)
            if (response !== undefined && response.url !== undefined) 
                callback(response.url);
        });
    });
}

getCurrentTabUrl(function (url) {
  console.log('Current tab URL:', url);
  if (url && url.includes('leetcode.com/problems/')) {
      var urlSegments = url.split('/');
     console.log(urlSegments);
     let problemName = urlSegments[4];
     console.log(problemName);

     const getQuestionDetails = async (problemName) => {
      try {
        let headersList = {
          "Accept": "*/*",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
          "Content-Type": "application/json"
         }
         
         let gqlBody = {
           query: `query questionHints($titleSlug: String!) {
           question(titleSlug: $titleSlug) {
             questionFrontendId
             title
             difficulty
             topicTags {
               name
             }
           }
         }`,
           variables: {"titleSlug":`${problemName}`}
         }
         
         let bodyContent =  JSON.stringify(gqlBody);
         
         let response = await fetch("https://leetcode.com/graphql", { 
           method: "POST",
           body: bodyContent,
           headers: headersList
         }); 
  
         const data = await response.json();
         const questionDetails = {
          title: data.data.question.title,
          difficulty: data.data.question.difficulty,
          topics: data.data.question.topicTags.map(topic => topic.name),
          link: url,
          time: new Date().toISOString()
        };

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
      // document.getElementById("link").value ="Link: " +questionDetails.link;
      document.getElementById("topics").value ="Topics: " +questionDetails.topics.join(", ");
        console.log("Question Details:", questionDetails);
        const currtUser = firebase.auth();
        console.log(currtUser);
        
        const submitBtn = document.getElementById("submit-btn");
        submitBtn.addEventListener("click", () => {
          postQuestionDetails(questionDetails);
          const status = document.getElementById("status");
          status.innerText = "Question details posted successfully!";
        });
      } catch (error) {
        console.error("Error fetching or processing question details:", error);
      }
    };
    getQuestionDetails(problemName);

    const postQuestionDetails = async (questionDetails) => {
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
    };
    
  }
});

