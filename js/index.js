
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
        var timeString = (currentTime.getMonth() + 1) + "월 " + currentTime.getDate() + "일 (" + getDayOfWeek(currentTime) + ") " + currentTime.getHours() + ":" + currentTime.getMinutes();
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
        historyData.push({time: timeString, mbp: resultMessage});
        localStorage.setItem('historyData', JSON.stringify(historyData));
    }

    function clearHistory() {
        // localStorage의 기록을 삭제
        localStorage.removeItem('historyData');

        // 테이블의 기록을 삭제
        var historyBody = document.getElementById('historyBody');
        historyBody.innerHTML = '';
    }

    // 타겟 범위를 반환하는 함수
    function getTargetRange() {
        var lowTarget = document.getElementById('lowTarget').value;
        var highTarget = document.getElementById('highTarget').value;
        return {low: lowTarget, high: highTarget};
    }

    // 페이지 로드 시 기록 불러오기
    window.onload = function() {
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
    };