// get-page-view.js

const sql = require('mssql')

exports.handler = async function(event, context) {
  const pageId = event.queryStringParameters.page_id

  const config = {
    user: 'hsj',
    password: 'Ghdtjdwls~',
    server: 'views-count.database.windows.net',
    database: 'views',
    options: {
      encrypt: true
    }
  }

  try {
    let pool = await sql.connect(config)

    /* 제일 테이블 만들었을때만 처음에만 필요 */
    // let result0 = await pool.request()
    //     .input('pageId', sql.Int, pageId)
    //     .query('SELECT view_count FROM page_views WHERE page_id = @pageId')

    // // 해당 페이지에 대한 레코드가 없다면 새 레코드를 추가
    // if (!result0.recordset[0]) {
    //     await pool.request()
    //         .input('pageId', sql.Int, pageId)
    //         .query('INSERT INTO page_views (page_id, view_count) VALUES (@pageId, 0)')
    // }

    
    let result = await pool.request()
      .input('pageId', sql.Int, pageId)
      .query('SELECT view_count FROM page_views WHERE page_id = @pageId')

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://jwo.netlify.app', // 모든 출처로부터의 요청을 허용
        'Access-Control-Allow-Headers': 'Content-Type', // Content-Type 헤더를 허용
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE' // 허용되는 메서드를 지정
      },
      body: JSON.stringify({viewCount: result.recordset[0].view_count})
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
