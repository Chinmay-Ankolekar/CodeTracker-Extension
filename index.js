const getQuestions = async (problem_name) => {
  try {
    const response = await fetch(
      `https://alfa-leetcode-api.onrender.com/select?titleSlug=${problem_name}`
    );

    if (response.status === 429) {
      throw new Error("Too many requests. Please try again later.");
    }

    const data = await response.json();
    console.log(data.questionTitle);
    console.log(data);
    document.getElementById("questionTitle").innerHTML ="Title: " + data.questionTitle;
    document.getElementById("questionDifficulty").innerHTML ="Difficulty: " + data.difficulty;
    const topics = data.topicTags.map((topic) => topic.name).join(", ");
    console.log(topics);
    document.getElementById("questionTopics").innerHTML = "Topics: " + topics;
    // document.getElementById("questionLink").innerHTML ="Question Link: " + data.link;
    document.getElementById("questionLink").innerHTML = `<a href="${data.link}" target="_blank">Question Link</a>`;

  } catch (error) {
    console.log(error);
  }
};

// getQuestions();

const onclick = () => {
  let url = document.getElementById("url").value;
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
