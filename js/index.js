
// 요일을 반환하는 함수
function getDayOfWeek(date) {
    var dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    return dayOfWeek[date.getDay()];
}

function calculateMBP() {
    var sbp = document.getElementById('sbp').value;
    var dbp = document.getElementById('dbp').value;

    var lowTarget = document.getElementById('lowTarget').value;
    var highTarget = document.getElementById('highTarget').value;

    var mbp = (parseInt(sbp) + 2 * parseInt(dbp)) / 3;

    // 결과를 "MBP = 결과값" 형태로 보여줌
    var resultMessage = "MBP = " + mbp.toFixed(2);

    // history에 저장
    var currentTime = new Date();
    var timeString = (currentTime.getMonth() + 1) + "월 " + currentTime.getDate() + "일 (" + getDayOfWeek(currentTime) + ") " 
                   + String(currentTime.getHours()).padStart(2, '0') + "시:" + String(currentTime.getMinutes()).padStart(2, '0') + "분";
    var historyBody = document.getElementById('historyBody');


    // 테이블에 결과 추가
    var newRecord = document.createElement('tr');
    newRecord.className = 'latest-result';  // 새 결과에 클래스 추가

    // 이전 결과의 강조를 제거
    var latestResult = document.querySelector('.latest-result');
    if (latestResult) {
        latestResult.className = '';
    }

    var timeCell = document.createElement('td');
    timeCell.textContent = timeString;
    newRecord.appendChild(timeCell);

    var resultCell = document.createElement('td');
    resultCell.textContent = resultMessage;

    // MBP 결과에 따라 배경색 변경
    if (mbp >= lowTarget && mbp <= highTarget) {
        resultCell.className = 'in-target';
    } else {
        resultCell.className = 'out-target';
    }
    newRecord.appendChild(resultCell);

    historyBody.appendChild(newRecord);

    // 기록을 localStorage에 저장
    var historyData = JSON.parse(localStorage.getItem('historyData')) || [];
    historyData.push({ time: timeString, mbp: resultMessage });
    localStorage.setItem('historyData', JSON.stringify(historyData));
}

function clearHistory() {
    // localStorage의 기록을 삭제
    localStorage.removeItem('historyData');

    // 테이블의 기록을 삭제
    var historyBody = document.getElementById('historyBody');
    historyBody.innerHTML = '';
}

// 수액 계산 기록 초기화 함수
function clearHistoryFluid() {
    // localStorage의 수액 계산 기록 삭제
    localStorage.removeItem('historyDataFluid');

    // 테이블의 수액 계산 기록 삭제
    var historyBodyFluid = document.getElementById('historyBody2');
    while (historyBodyFluid.firstChild) {
        historyBodyFluid.removeChild(historyBodyFluid.firstChild);
    }
}



// 타겟 범위를 반환하는 함수
function getTargetRange() {
    var lowTarget = document.getElementById('lowTarget').value;
    var highTarget = document.getElementById('highTarget').value;
    return { low: lowTarget, high: highTarget };
}

function openTab(evt, tabName) {
    // 모든 탭 컨텐츠를 숨깁니다
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // 모든 탭 링크를 비활성화합니다
    var tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // 선택한 탭을 보이게 하고 링크를 활성화합니다
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// 수액 계산 함수
function calculateFluid() {
    // 입력값 가져오기
    var volume = document.getElementById('volume').value;  // 수액 용량 입력값 가져오기
    var duration = document.getElementById('duration').value;  // 주입 시간 입력값 가져오기

    // 계산
    var ccPerHour = volume / duration;  // 시간당 cc 계산
    var gttPerMin = (volume / duration) / 60;  // 분당 물방울 수 계산
    var dropsPerSec = gttPerMin / 60;  // 초당 물방울 수 계산

    // 결과 저장 및 표시
    var historyBodyFluid = document.getElementById('historyBody2');
    var newRecord = document.createElement('tr');

    // 현재 시간 표시
    var currentTime = new Date();
    var timeString = (currentTime.getMonth() + 1) + "월 " + currentTime.getDate() + "일 (" + getDayOfWeek(currentTime) + ") \n" 
                   + String(currentTime.getHours()).padStart(2, '0') + "시:" + String(currentTime.getMinutes()).padStart(2, '0') + "분";

    var timeCell = document.createElement('td');
    timeCell.textContent = timeString;
    newRecord.appendChild(timeCell);

    var ccPerHourCell = document.createElement('td');
    ccPerHourCell.textContent = ccPerHour.toFixed(2) + " cc/hr";
    newRecord.appendChild(ccPerHourCell);

    var gttPerMinCell = document.createElement('td');
    gttPerMinCell.textContent = gttPerMin.toFixed(2) + " gtt/min";
    newRecord.appendChild(gttPerMinCell);

    var dropsPerSecCell = document.createElement('td');
    dropsPerSecCell.textContent = dropsPerSec.toFixed(2) + " drops/sec";
    newRecord.appendChild(dropsPerSecCell);

    historyBodyFluid.appendChild(newRecord);

    // 기록을 localStorage에 저장
    var historyDataFluid = JSON.parse(localStorage.getItem('historyDataFluid')) || [];
    historyDataFluid.push({ time: timeString, ccPerHour: ccPerHour, gttPerMin: gttPerMin, dropsPerSec: dropsPerSec });
    localStorage.setItem('historyDataFluid', JSON.stringify(historyDataFluid));
}



document.addEventListener("DOMContentLoaded", function () {
    openTab(null, 'fluid');
});


// 페이지 로드 시 기록 불러오기
window.onload = function () {
    // 타겟 범위 기본값 설정
    var lowTargetInput = document.getElementById('lowTarget');
    var highTargetInput = document.getElementById('highTarget');
    if (!lowTargetInput.value) lowTargetInput.value = 70;
    if (!highTargetInput.value) highTargetInput.value = 80;

    var historyData = JSON.parse(localStorage.getItem('historyData')) || [];
    var historyBody = document.getElementById('historyBody');
    var targetRange = getTargetRange();  // 타겟 범위 불러오기

    for (var i = 0; i < historyData.length; i++) {
        var newRecord = document.createElement('tr');

        var timeCell = document.createElement('td');
        timeCell.textContent = historyData[i].time;
        newRecord.appendChild(timeCell);

        var resultCell = document.createElement('td');
        resultCell.textContent = historyData[i].mbp;

        // MBP 결과에 따라 배경색 변경
        var mbp = parseFloat(historyData[i].mbp.split(' = ')[1]);  // "MBP = 결과값" 형태의 문자열에서 결과값만 추출하여 숫자로 변환
        if (mbp >= targetRange.low && mbp <= targetRange.high) {
            resultCell.className = 'in-target';
        } else {
            resultCell.className = 'out-target';
        }

        newRecord.appendChild(resultCell);

        historyBody.appendChild(newRecord);
    }
    
    // 수액 계산 기록 불러오기
    var historyDataFluid = JSON.parse(localStorage.getItem('historyDataFluid')) || [];
    var historyBodyFluid = document.getElementById('historyBody2');

    for (var i = 0; i < historyDataFluid.length; i++) {
        var newRecordFluid = document.createElement('tr');

        var timeCellFluid = document.createElement('td');
        timeCellFluid.textContent = historyDataFluid[i].time; // 시간 데이터
        newRecordFluid.appendChild(timeCellFluid);

        var ccPerHourCell = document.createElement('td');
        ccPerHourCell.textContent = historyDataFluid[i].ccPerHour.toFixed(2) + " cc/hr";
        newRecordFluid.appendChild(ccPerHourCell);

        var gttPerMinCell = document.createElement('td');
        gttPerMinCell.textContent = historyDataFluid[i].gttPerMin.toFixed(2) + " gtt/min";
        newRecordFluid.appendChild(gttPerMinCell);

        var dropsPerSecCell = document.createElement('td');
        dropsPerSecCell.textContent = historyDataFluid[i].dropsPerSec.toFixed(2) + " drops/sec";
        newRecordFluid.appendChild(dropsPerSecCell);

        historyBodyFluid.appendChild(newRecordFluid);
    }
};

