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
