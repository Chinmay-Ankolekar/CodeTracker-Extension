import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyAzOFyUtRyHyHIn-4RuwmEsPwQCWBQCCeo",
  authDomain: "leetcode-tracker-6f022.firebaseapp.com",
  databaseURL: "https://leetcode-tracker-6f022-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "leetcode-tracker-6f022",
  storageBucket: "leetcode-tracker-6f022.appspot.com",
  messagingSenderId: "1018319647499",
  appId: "1:1018319647499:web:7fecdef6a5cee20192680e",
  measurementId: "G-EW08MHQ81B"
};

const app = initializeApp(firebaseConfig);

import { getDatabase, ref, push, set, child } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";
const getQuestions = async (problem_name) => {
  try {
    const response = await fetch(
      `https://alfa-leetcode-api.onrender.com/select?titleSlug=${problem_name}`
    );
    if (response.status === 429) {
      throw new Error("Too many requests. Please try again later.");
    }
    const data = await response.json();

    // document.getElementById("questionTitle").innerHTML =
    //   "Title: " + data.questionTitle;
    // document.getElementById("questionDifficulty").innerHTML =
    //   "Difficulty: " + data.difficulty;
    // const topics = data.topicTags.map((topic) => topic.name).join(", ");
    // document.getElementById("questionTopics").innerHTML = "Topics: " + topics;
    // document.getElementById("questionLink").innerHTML = `<a href="${data.link}" target="_blank">Question Link</a>`;
    
    // const database = getDatabase();
    // const questionsRef = ref(database, 'questions');
    // const newQuestionRef = push(questionsRef);
    // const questionKey = newQuestionRef.key;
    // const questionData = {
    //   title: data.questionTitle,
    //   difficulty: data.difficulty,
    //   topics: topics,
    //   link: data.link
    // };
    // await set(child(questionsRef, questionKey), questionData);
    // alert("Question added to the database successfully!");

    document.getElementById("questionTitle").innerHTML =
      "Title: " + data.questionTitle;
    document.getElementById("questionDifficulty").innerHTML =
      "Difficulty: " + data.difficulty;
    const topics = data.topicTags.map((topic) => topic.name).join(", ");
    document.getElementById("questionTopics").innerHTML = "Topics: " + topics;
    document.getElementById("questionLink").innerHTML = `<a href="${data.link}" target="_blank">Question Link</a>`;
    
    // Write data to Firebase using REST API
    const url = `https://${firebaseConfig.projectId}.firebaseio.com/questions.json`;
    const postData = {
      title: data.questionTitle,
      difficulty: data.difficulty,
      topics: topics,
      link: data.link
    };
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(postData)
    });

    alert("Question added to the database successfully!");
  } catch (error) {
    console.log(error);
  }
};


// const getQuestions = async (problem_name) => {
//   try {
//     const response = await fetch(
//       `https://alfa-leetcode-api.onrender.com/select?titleSlug=${problem_name}`
//     );

//     if (response.status === 429) {
//       throw new Error("Too many requests. Please try again later.");
//     }

//     const data = await response.json();
//     console.log(data.questionTitle);
//     console.log(data);
//     document.getElementById("questionTitle").innerHTML =
//       "Title: " + data.questionTitle;
//     document.getElementById("questionDifficulty").innerHTML =
//       "Difficulty: " + data.difficulty;
//     const topics = data.topicTags.map((topic) => topic.name).join(", ");
//     console.log(topics);
//     document.getElementById("questionTopics").innerHTML = "Topics: " + topics;

//     document.getElementById(
//       "questionLink"
//     ).innerHTML = `<a href="${data.link}" target="_blank">Question Link</a>`;
//   } catch (error) {
//     console.log(error);
//   }
// };

const onclick = () => {
  let url = document.getElementById("url").value;
  if (!url) {
    alert("Please enter a URL.");
    return;
  }
  let parts = url.split("/");
  let problem_name = parts[4];
  console.log(problem_name);
  getQuestions(problem_name);
};

const button = document.getElementById("button");
const clearButton = document.getElementById("clear-btn");
button.addEventListener("click", onclick);

clearButton.addEventListener("click", () => {
  document.getElementById("questionTitle").innerHTML = "";
  document.getElementById("questionDifficulty").innerHTML = "";
  document.getElementById("questionTopics").innerHTML = "";
  document.getElementById("questionLink").innerHTML = "";
  document.getElementById("url").value = "";
});
