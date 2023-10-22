let coloredBox = null;  // 현재 선택된 박스를 추적할 변수

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
    if (evt) {
        evt.currentTarget.className += " active";
    }
}

// 수액 계산 함수
function calculateFluid() {
    // 입력값 가져오기
    var volume = document.getElementById('volume').value;  // 수액 용량 입력값 가져오기
    var duration_hr = document.getElementById('duration_hr').value;  // 주입 시간 입력값 가져오기
    var duration_min = document.getElementById('duration_min').value;  // 주입 시간 입력값 가져오기
    
    // 값이 없으면 0을 대입
    if (!duration_min) {
        duration_min = 0;
    }

    // 시간과 분을 합쳐 총 시간을 분으로 환산
    var total_duration_min = (parseInt(duration_hr) * 60) + parseInt(duration_min);

    // 계산
    var ccPerHour = volume / (total_duration_min / 60);  // 시간당 cc 계산
    var gttPerMin = ccPerHour / 3;  // 분당 물방울 수 계산
    var timePerDrop = 60 / gttPerMin;  // 한방울 떨어지는데 걸리는 시간(초) 계산

    // 결과 저장 및 표시
    var historyBodyFluid = document.getElementById('historyBody2');
    var newRecord = document.createElement('tr');

    // 테이블에 결과 추가
    var newRecord = document.createElement('tr');
    newRecord.className = 'latest-result';  // 새 결과에 클래스 추가

    // 이전 결과의 강조를 제거
    var latestResult = document.querySelector('.latest-result');
    if (latestResult) {
        latestResult.className = '';
    }

    // 현재 시간 표시
    var currentTime = new Date();
    var timeString = (currentTime.getMonth() + 1) + "월 " + currentTime.getDate() + "일 (" + getDayOfWeek(currentTime) + ") " 
                + String(currentTime.getHours()).padStart(2, '0') + "시:" + String(currentTime.getMinutes()).padStart(2, '0') + "분";

    var timeCell = document.createElement('td');
    timeCell.innerHTML = timeString; // textContent 대신 innerHTML 사용
    newRecord.appendChild(timeCell);

    var ccPerHourCell = document.createElement('td');
    ccPerHourCell.textContent = ccPerHour.toFixed(2) + " cc/hr";
    newRecord.appendChild(ccPerHourCell);

    var gttPerMinCell = document.createElement('td');
    gttPerMinCell.textContent = gttPerMin.toFixed(2) + " gtt";
    newRecord.appendChild(gttPerMinCell);

    var timePerDropCell = document.createElement('td');
    timePerDropCell.textContent = timePerDrop.toFixed(2) + " 초/방울";
    newRecord.appendChild(timePerDropCell);

    historyBodyFluid.insertBefore(newRecord, historyBodyFluid.firstChild);

    // 기록을 localStorage에 저장
    var historyDataFluid = JSON.parse(localStorage.getItem('historyDataFluid')) || [];
    historyDataFluid.push({ time: timeString, ccPerHour: ccPerHour, gttPerMin: gttPerMin, timePerDrop: timePerDrop });
    localStorage.setItem('historyDataFluid', JSON.stringify(historyDataFluid));
}


// 웹사이트 시작할때 불러오는 함수
document.addEventListener("DOMContentLoaded", function () {
    openTab(null, 'fluid');
    tabButton(null, 'vs');
    loadRoomValues(); // 호실 설정
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

    // 배열을 정방향으로 반복
    for (var i = historyData.length - 1; i >= 0; i--) {
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

        // 새로운 기록을 테이블의 맨 위에 추가
        if (historyBody.firstChild) {
            historyBody.insertBefore(newRecord, historyBody.firstChild);
        } else {
            historyBody.appendChild(newRecord);
        }
    }

    
    // 수액 계산 기록 불러오기
    var historyDataFluid = JSON.parse(localStorage.getItem('historyDataFluid')) || [];
    var historyBodyFluid = document.getElementById('historyBody2');

    for (var i = historyDataFluid.length - 1; i >= 0; i--) {
        var newRecordFluid = document.createElement('tr');
    
        var timeCellFluid = document.createElement('td');
        timeCellFluid.textContent = historyDataFluid[i].time; // 시간 데이터
        newRecordFluid.appendChild(timeCellFluid);
    
        var ccPerHourCell = document.createElement('td');
        var ccPerHour = historyDataFluid[i].ccPerHour;
        ccPerHourCell.textContent = (ccPerHour ? ccPerHour.toFixed(2) : "N/A") ;
        newRecordFluid.appendChild(ccPerHourCell);
    
        var gttPerMinCell = document.createElement('td');
        var gttPerMin = historyDataFluid[i].gttPerMin;
        gttPerMinCell.textContent = (gttPerMin ? gttPerMin.toFixed(2) : "N/A");
        newRecordFluid.appendChild(gttPerMinCell);
    
        var timePerDropCell = document.createElement('td');
        var timePerDrop = historyDataFluid[i].timePerDrop;
        timePerDropCell.textContent = (timePerDrop ? timePerDrop.toFixed(2) : "N/A");
        newRecordFluid.appendChild(timePerDropCell);
    
        historyBodyFluid.appendChild(newRecordFluid);
    }
    
};

// ==========================================
// boxList 초기화
let boxList = JSON.parse(localStorage.getItem('boxList')) || [];

// 초기에 박스 생성
function initializeBoxes() {
    // boxList에 저장된 각각의 박스 아이디를 이용해 박스 생성
    for (const boxId of boxList) {
        const [roomIdPart, boxNumber] = boxId.split('-');
        const room = document.getElementById(`room${roomIdPart}`);
        const addButton = room.querySelector('.add-box-button');  // + 버튼을 찾아야 함, 클래스는 예시입니다.

        // 이전 코드의 로직을 활용하여 박스 생성
        const box = document.createElement('div');
        box.classList.add('box');
        box.id = boxId;

        box.addEventListener('click', () => {
            // 이전에 선택된 박스가 있으면 강조 표시 제거
            if (coloredBox) {
                coloredBox.classList.remove('box-selected');
            }
          
            // 새로운 박스를 강조 표시
            box.classList.add('box-selected');
          
            // 선택된 박스 업데이트
            coloredBox = box;
          
            bringMemo(box.id);
        });

        const boxNumberSpan = document.createElement('span');
        boxNumberSpan.classList.add('box-number');
        boxNumberSpan.textContent = boxNumber;

        box.appendChild(boxNumberSpan);

        // div 박스를 + 버튼 바로 전에 추가
        room.insertBefore(box, addButton);
    }
}

// 페이지가 로드되면 initializeBoxes 함수를 호출
window.addEventListener('load', initializeBoxes);

function addBoxEvent(room, button) {
    
    button.addEventListener('click', () => {
        // room 내에서 가장 높은 box-number 값을 찾기
        const boxNumbers = Array.from(room.querySelectorAll('.box-number')).map(span => parseInt(span.textContent, 10));
        let highestBoxNumber = Math.max(0, ...boxNumbers);
        
        // highestBoxNumber보다 1 큰 값으로 boxCounter 설정
        let boxCounter = highestBoxNumber + 1;

        const box = document.createElement('div');
        box.classList.add('box');
        const newBoxId = `${room.id.split('room')[1]}-${boxCounter}`;
        box.id = newBoxId;

        // boxList에 박스의 아이디를 추가하고 localStorage에 다시 저장
        boxList.push(newBoxId);
        localStorage.setItem('boxList', JSON.stringify(boxList));

        // 박스에 이벤트 리스너 추가
        box.addEventListener('click', () => {
            // 이전에 선택된 박스가 있으면 강조 표시 제거
            if (coloredBox) {
                coloredBox.classList.remove('box-selected');
            }
          
            // 새로운 박스를 강조 표시
            box.classList.add('box-selected');
          
            // 선택된 박스 업데이트
            coloredBox = box;
          
            bringMemo(box.id);
        });

        const boxNumberSpan = document.createElement('span');
        boxNumberSpan.classList.add('box-number');
        boxNumberSpan.textContent = boxCounter;

        box.appendChild(boxNumberSpan);

        // div 박스를 + 버튼 바로 전에 추가
        room.insertBefore(box, button);
        
        // 다음에 추가될 box의 번호를 준비
        boxCounter++;
    });
}



let roomCounter = 1;

// 1호실의 박스 추가 버튼에 대한 이벤트 리스너 설정
const initialRoom = document.getElementById('room1');
const initialAddBoxButton = initialRoom.querySelector('.add-box-button');
addBoxEvent(initialRoom, initialAddBoxButton);
const initialBox = document.getElementById('1-1');
initialBox.addEventListener('click', () => {
    // 이전에 선택된 박스가 있으면 강조 표시 제거
    if (coloredBox) {
        coloredBox.classList.remove('box-selected');
    }
  
    // 새로운 박스를 강조 표시
    initialBox.classList.add('box-selected');
  
    // 선택된 박스 업데이트
    coloredBox = initialBox;
  
    bringMemo('1-1');
});
    
function updateLocalStorageFromInput(e) {
    const parentID = e.target.parentNode.id; // 부모의 아이디 가져오기
    const value = e.target.value; // 입력된 값 가져오기
    localStorage.setItem(parentID, value); // localStorage에 저장
}

document.getElementById('add-room').addEventListener('click', () => {
    roomCounter++;

    // 새로운 room div를 생성
    const room = document.createElement('div');
    room.classList.add('room');
    room.id = `room${roomCounter}`;

    const input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('min', '0');
    input.setAttribute('max', '99');
    input.classList.add('room-input');
    input.value = roomCounter;

    input.addEventListener('input', updateLocalStorageFromInput);

    const span = document.createElement('span');
    span.id = `number_span`;
    span.textContent = '호실';

    room.appendChild(input);
    room.appendChild(span);

    const addBoxButton = document.createElement('button');
    addBoxButton.textContent = '+';
    addBoxButton.classList.add('add-box-button');

    const initialBox = document.createElement('div');
    initialBox.classList.add('box');
    initialBox.id = `${roomCounter}-1`;

    const initialBoxNumberSpan = document.createElement('span');
    initialBoxNumberSpan.classList.add('box-number');
    initialBoxNumberSpan.textContent = '1';

    initialBox.appendChild(initialBoxNumberSpan);

    // room.appendChild(initialBox);
    room.appendChild(addBoxButton);

    // 방을 rooms 바로 전에 추가
    document.getElementById('rooms').insertBefore(room, document.getElementById('add-room'));

    addBoxEvent(room, addBoxButton);  // 새로운 호실의 박스 추가 버튼에 대한 이벤트 리스너 설정
    // 강제로 input 이벤트 리스너 로직 실행
    updateLocalStorageFromInput({ target: input });
});


function tabButton(evt, tabName) {
    // 모든 탭 컨텐츠를 숨깁니다
    var tabcontent = document.getElementsByClassName("tab-content");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // 모든 탭 링크를 비활성화합니다
    var tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // 선택한 탭을 보이게 하고 링크를 활성화합니다
    document.getElementById(tabName).style.display = "block";
    if (evt) {
        evt.currentTarget.className += " active";
    }
}

document.querySelectorAll('.room-input').forEach(function(input) {
    input.addEventListener('input', function(e) {
      const parentID = e.target.parentNode.id; // 부모의 아이디 가져오기
      const value = e.target.value; // 입력된 값 가져오기
      localStorage.setItem(parentID, value); // localStorage에 저장
    });
});

function loadRoomValues() {
    // #add-room 버튼 찾기
    const addRoomButton = document.getElementById('add-room');

    // room의 수와 값들을 한 번의 반복문에서 처리
    for (let i = 1; ; i++) {
        const roomID = `room${i}`;
        const value = localStorage.getItem(roomID);
        console.log(`호실 ${i} : `, value)
        // roomX 키가 없으면 loop 종료
        if (value === null && roomID != 'room1') {
            break;
        }

        // 이전에 저장된 방의 수에 맞게 버튼 클릭
        if (i > 1) {
            addRoomButton.click(); // 버튼 클릭
        }

        // 값을 input에 적용
        const input = document.querySelector(`#${roomID} input`);
        if (input) {
            input.value = value;
        }
    }
}


var selectedBox = "1-1";

function bringMemo(id) {
    selectedBox = id;
    console.log('해당 box의 id : ', id);
    // localStorage에서 키를 사용해 데이터를 가져온다.
    const key1 = id + "'s vsmemo";
    const memo1 = localStorage.getItem(key1);

    const key2 = id + "'s textmemo";
    const memo2 = localStorage.getItem(key2);

    // id가 vstext인 textarea에 memo1을 설정
    const vstextArea = document.getElementById('vsText');
    if (memo1 !== null) {
        vstextArea.value = memo1;
    } else {
        // 해당 id로 저장된 메모가 없을 경우
        vstextArea.value = ''; // textarea를 빈 문자열로 설정
    }

    // id가 text인 textarea에 memo2를 설정
    const textArea = document.getElementById('text');
    if (memo2 !== null) {
        textArea.value = memo2;
    } else {
        // 해당 id로 저장된 메모가 없을 경우
        textArea.value = ''; // textarea를 빈 문자열로 설정
    }
}


bringMemo('1-1');

// id가 save-note인 버튼에 이벤트 리스너를 추가
document.getElementById('save-note').addEventListener('click', function() {
    // id가 vsText인 textarea의 값을 가져옴
    const textAreaContent1 = document.getElementById('vsText').value;
    const textAreaContent2 = document.getElementById('text').value;
    
    // localStorage에 저장
    const key1 = selectedBox + "'s vsmemo";
    localStorage.setItem(key1, textAreaContent1);
    const key2 = selectedBox + "'s textmemo";
    localStorage.setItem(key2, textAreaContent2);
});


// delete-all 아이디를 가진 버튼에 이벤트 리스너 추가
document.getElementById('delete-all').addEventListener('click', () => {
    // localStorage의 모든 키를 가져온다.
    const keys = Object.keys(localStorage);
  
    // 각 키에 대해 확인하고 roomX로 시작하거나 memo가 포함된 키면 삭제한다.
    for (const key of keys) {
        if (key.startsWith('room')) {
            // X 부분이 숫자인지 확인한다.
            const roomNumber = key.split('room')[1].split("'s memo")[0];  // room과 's memo' 사이의 문자열을 가져옴
            if (!isNaN(roomNumber)) {  // 숫자이면
                localStorage.removeItem(key);
            }
        }

        // memo가 포함된 키라면 삭제한다.
        if (key.includes('memo')) {
            localStorage.removeItem(key);
        }
    }

    localStorage.removeItem('boxList');
});

document.getElementById('delete-note').addEventListener('click', () => {
    if (coloredBox) {
        const targetId = coloredBox.id;  // 예를 들어, "1-1"

        // localStorage에서 coloredBox의 id를 포함하는 모든 키를 찾아 삭제
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            // key가 targetId를 포함하면 해당 항목을 삭제
            if (key && key.includes(targetId)) {
                localStorage.removeItem(key);
            }
        }
        // DOM에서 해당 박스 삭제
        // coloredBox.remove();
        // coloredBox = null;  // coloredBox 초기화
    } else {
        alert('삭제할 박스를 선택해 주세요.');
    }
});

