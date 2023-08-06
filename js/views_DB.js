
// localStorage에서 'nickname' 키를 확인하고, 없다면 새 닉네임 생성
if (!localStorage.getItem('nickname')) {
  // 이 예시에서는 랜덤한 단어에 랜덤 숫자를 추가하여 닉네임을 생성합니다
  let randomNickname = "User" + Math.floor(Math.random() * 10000);

  // 'nickname' 키와 함께 랜덤 닉네임을 localStorage에 저장
  localStorage.setItem('nickname', randomNickname);
}

// 'nickname' 키에서 랜덤 닉네임 가져오기
let userNickname = localStorage.getItem('nickname');

// 'pageId' 메타 태그를 가져옴
let pageIdMetaTag = document.querySelector('meta[name="pageId"]');

// 'pageId' 메타 태그의 'content' 속성을 가져온 후 정수로 변환
let pageId = pageIdMetaTag ? parseInt(pageIdMetaTag.getAttribute('content'), 10) : 0;

// 페이지 ID 확인
console.log(pageId);

// 넷틀리파이 함수 URL
var functionUrl = 'https://your-netlify-site.netlify.app/.netlify/functions/track-page-view';

//====================================================================================
/* 쿼리 스트링으로 랜덤 닉네임과 페이지 ID 전달 */
var urlWithParameters = `${functionUrl}?user_nickname=${userNickname}&page_id=${pageId}`;

// 요청 보내기
fetch(urlWithParameters, { method: 'POST' })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch((error) => {
    console.error('Error:', error);
  });


//====================================================================================

functionUrl = 'https://your-netlify-site.netlify.app/.netlify/functions/get-page-view';

// 쿼리 스트링으로 페이지 ID 전달
urlWithParameters = `${functionUrl}?page_id=${pageId}`;

// 요청을 보내고 응답을 처리함
fetch(urlWithParameters, { method: 'GET' })
  .then(response => response.json())
  .then(data => {
    // 조회수를 화면에 표시
    let viewCountElement = document.querySelector('#viewCount');
    viewCountElement.textContent = `${data.viewCount}`;
  })
  .catch((error) => {
    console.error('Error:', error);
  });





