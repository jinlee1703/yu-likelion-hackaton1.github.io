function loadLastRecord() {
  let healthHistory = JSON.parse(localStorage.getItem("healthHistory")) || [];
  if (healthHistory.length > 0) {
    let lastRecord = healthHistory[healthHistory.length - 1];
    document.getElementById("lastRecordInfo").innerHTML = `
            날짜: ${new Date(lastRecord.date).toLocaleString()}<br>
            체중: ${lastRecord.weight} kg<br>
            키: ${lastRecord.height} cm<br>
            혈압: ${lastRecord.bloodPressure}<br>
            심박수: ${lastRecord.heartRate} bpm<br>
            수면 시간: ${lastRecord.sleepHours} 시간<br>
            기분: ${lastRecord.mood}
        `;
  } else {
    document.getElementById("lastRecordInfo").textContent =
      "저장된 정보가 없습니다.";
  }
}

function calculateBMI() {
  let healthHistory = JSON.parse(localStorage.getItem("healthHistory")) || [];
  if (healthHistory.length > 0) {
    let lastRecord = healthHistory[healthHistory.length - 1];
    const weight = lastRecord.weight;
    const height = lastRecord.height;
    const bmi = weight / (height / 100) ** 2;
    let category;
    if (bmi < 18.5) category = "저체중";
    else if (bmi < 25) category = "정상";
    else if (bmi < 30) category = "과체중";
    else category = "비만";

    document.getElementById(
      "bmiResult"
    ).textContent = `당신의 BMI: ${bmi.toFixed(2)} (${category})`;
  } else {
    document.getElementById("bmiResult").textContent =
      "BMI를 계산할 데이터가 없습니다.";
  }
}

function updateHistoryTable() {
  let healthHistory = JSON.parse(localStorage.getItem("healthHistory")) || [];
  let tableBody = document.querySelector("#historyTable tbody");
  tableBody.innerHTML = "";
  healthHistory
    .slice(-5)
    .reverse()
    .forEach((record) => {
      let row = tableBody.insertRow();
      row.innerHTML = `
            <td>${new Date(record.date).toLocaleDateString()}</td>
            <td>${record.weight}</td>
            <td>${record.height}</td>
            <td>${record.bloodPressure}</td>
            <td>${record.heartRate}</td>
            <td>${record.sleepHours}</td>
            <td>${record.mood}</td>
        `;
    });
}

if (document.getElementById("healthForm")) {
  document
    .getElementById("healthForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const healthData = {
        weight: document.getElementById("weight").value,
        height: document.getElementById("height").value,
        bloodPressure: document.getElementById("bloodPressure").value,
        heartRate: document.getElementById("heartRate").value,
        sleepHours: document.getElementById("sleepHours").value,
        mood: document.getElementById("mood").value,
        date: new Date().toISOString(),
      };

      let healthHistory =
        JSON.parse(localStorage.getItem("healthHistory")) || [];
      healthHistory.push(healthData);
      localStorage.setItem("healthHistory", JSON.stringify(healthHistory));

      alert("건강 정보가 저장되었습니다!");
      window.location.href = "index.html"; // 저장 후 메인 페이지로 이동
    });
}

function setGoal(event) {
  event.preventDefault();
  const goalType = document.getElementById("goal-type").value;
  const goalValue = document.getElementById("goal-value").value;
  const goalDate = document.getElementById("goal-date").value;

  const goal = { type: goalType, value: goalValue, date: goalDate };
  let goals = JSON.parse(localStorage.getItem("goals")) || [];
  goals.push(goal);
  localStorage.setItem("goals", JSON.stringify(goals));

  displayGoals();
}

function displayGoals() {
  const goalsList = document.getElementById("goals-list");
  const goals = JSON.parse(localStorage.getItem("goals")) || [];

  goalsList.innerHTML = "";
  goals.forEach((goal, index) => {
    const li = document.createElement("li");
    li.textContent = `${goal.type}: ${goal.value}, 달성일: ${goal.date}`;
    goalsList.appendChild(li);
  });
}

// 통계 차트 그리기 기능
function drawWeeklyChart() {
  const ctx = document.getElementById("weekly-chart").getContext("2d");
  const records = JSON.parse(localStorage.getItem("exerciseRecords")) || [];

  // 데이터 처리 로직 (실제 구현 시 더 복잡할 수 있음)
  const data = [0, 0, 0, 0, 0, 0, 0]; // 일주일치 데이터

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["월", "화", "수", "목", "금", "토", "일"],
      datasets: [
        {
          label: "주간 운동량",
          data: data,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// 페이지 로드 시 실행
window.onload = function () {
  if (document.getElementById("goal-form")) {
    document.getElementById("goal-form").addEventListener("submit", setGoal);
    displayGoals();
  }

  if (document.getElementById("weekly-chart")) {
    drawWeeklyChart();
  }
};

// 타이머 관련 변수
let timerInterval;
let currentTime = 0;
let isWorkout = true;
let currentRound = 1;

// 타이머 기능
function startTimer() {
  const workoutTime = parseInt(document.getElementById("workout-time").value);
  const restTime = parseInt(document.getElementById("rest-time").value);
  const rounds = parseInt(document.getElementById("rounds").value);

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (currentTime > 0) {
      currentTime--;
      updateTimerDisplay();
    } else {
      if (isWorkout) {
        if (currentRound < rounds) {
          currentTime = restTime;
          isWorkout = false;
          document.getElementById("timer-display").style.backgroundColor =
            "lightblue";
        } else {
          clearInterval(timerInterval);
          alert("운동 완료!");
          return;
        }
      } else {
        currentTime = workoutTime;
        isWorkout = true;
        currentRound++;
        document.getElementById("timer-display").style.backgroundColor =
          "lightgreen";
      }
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  clearInterval(timerInterval);
  currentTime = 0;
  isWorkout = true;
  currentRound = 1;
  updateTimerDisplay();
  document.getElementById("timer-display").style.backgroundColor = "";
}

function updateTimerDisplay() {
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  document.getElementById("timer-display").textContent = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// 운동 추천 기능
const exercises = [
  "스쿼트 3세트 x 15회",
  "푸시업 3세트 x 10회",
  "플랭크 3세트 x 30초",
  "런지 3세트 x 12회 (양쪽)",
  "버피 3세트 x 10회",
  "산 클라이머 3세트 x 20초",
  "덤벨 로우 3세트 x 12회",
  "점프 스쿼트 3세트 x 10회",
];

function getRecommendation() {
  const recommendationDisplay = document.getElementById(
    "recommendation-display"
  );
  const randomExercises = exercises.sort(() => 0.5 - Math.random()).slice(0, 3);
  recommendationDisplay.innerHTML =
    "<ul>" +
    randomExercises.map((exercise) => `<li>${exercise}</li>`).join("") +
    "</ul>";
}

// 페이지 로드 시 실행
window.onload = function () {
  // 기존 코드 유지

  if (document.getElementById("start-timer")) {
    document
      .getElementById("start-timer")
      .addEventListener("click", startTimer);
    document
      .getElementById("pause-timer")
      .addEventListener("click", pauseTimer);
    document
      .getElementById("reset-timer")
      .addEventListener("click", resetTimer);
  }

  if (document.getElementById("get-recommendation")) {
    document
      .getElementById("get-recommendation")
      .addEventListener("click", getRecommendation);
    getRecommendation(); // 초기 추천 표시
  }
};
