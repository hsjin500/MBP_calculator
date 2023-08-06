// get-page-view.js

const sql = require('mssql')

exports.handler = async function(event, context) {
  const pageId = event.queryStringParameters.page_id

  const config = {
    user: 'hsj',
    password: 'Ghdtjdwls~',
    server: 'views-count.database.windows.net',
    database: 'master',
    options: {
      encrypt: true
    }
  }

  try {
    let pool = await sql.connect(config)
    
    let result = await pool.request()
      .input('pageId', sql.Int, pageId)
      .query('SELECT view_count FROM page_views WHERE page_id = @pageId')

    return {
      statusCode: 200,
      body: JSON.stringify({viewCount: result.recordset[0].view_count})
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      body: JSON.stringify({error: 'An error occurred'})
    }
  }
}
