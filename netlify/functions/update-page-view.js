const sql = require('mssql')  // Azure SQL 서버와 통신하기 위한 npm 패키지

exports.handler = async function(event, context) {
  // 요청에서 페이지 ID와 사용자 닉네임을 얻는다.
  const pageId = event.queryStringParameters.page_id
  const userNickname = event.queryStringParameters.user_nickname

  // Azure SQL DB와 연결 설정
  const config = {
    user: 'hsj',
    password: 'Ghdtjdwls~',
    server: 'views-count.database.windows.net', // Azure SQL 서버 주소
    database: 'views',
    options: {
      encrypt: true
    }
  }

  try {
    // Azure SQL DB 연결
    let pool = await sql.connect(config)
    
    /* 페이지 조회수*/
    let checkRecord = await pool.request()
      .input('pageId', sql.Int, pageId)
      .query('SELECT * FROM page_views WHERE page_id = @pageId')

    if (checkRecord.recordset.length > 0) {
      // 레코드가 있으면 update
      let increasePageViews = await pool.request()
        .input('pageId', sql.Int, pageId)
        .query('UPDATE page_views SET view_count = view_count + 1 WHERE page_id = @pageId')
    } else {
      // 레코드가 없으면 insert
      let insertPageView = await pool.request()
        .input('pageId', sql.Int, pageId)
        .input('viewCount', sql.Int, 1)
        .query('INSERT INTO page_views (page_id, view_count) VALUES (@pageId, @viewCount)')
    }
    
    /* 유저별-페이지별 조회수 */
    let checkUserRecord = await pool.request()
      .input('userNickname', sql.NVarChar, userNickname)
      .input('pageId', sql.Int, pageId)
      .query('SELECT * FROM user_page_views WHERE user_nickname = @userNickname AND page_id = @pageId')

    if (checkUserRecord.recordset.length > 0) {
      // 레코드가 있으면 update
      let increaseUserPageViews = await pool.request()
        .input('userNickname', sql.NVarChar, userNickname)
        .input('pageId', sql.Int, pageId)
        .query('UPDATE user_page_views SET view_count = view_count + 1 WHERE user_nickname = @userNickname AND page_id = @pageId')
    } else {
      // 레코드가 없으면 insert
      let insertUserPageView = await pool.request()
        .input('userNickname', sql.NVarChar, userNickname)
        .input('pageId', sql.Int, pageId)
        .input('viewCount', sql.Int, 1)
        .query('INSERT INTO user_page_views (user_nickname, page_id, view_count) VALUES (@userNickname, @pageId, @viewCount)')
    }

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': 'https://jwo.netlify.app',  // 모든 도메인으로부터의 요청을 허용
          'Access-Control-Allow-Headers': 'Content-Type'  // Content-Type 헤더를 허용
        },
        body: JSON.stringify({message: 'Page view updated successfully'})
      }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://jwo.netlify.app', // 모든 출처로부터의 요청을 허용
        'Access-Control-Allow-Headers': 'Content-Type', // Content-Type 헤더를 허용
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE' // 허용되는 메서드를 지정
      },
      body: JSON.stringify({error: 'An error occurred'})
    }
  } 
}
