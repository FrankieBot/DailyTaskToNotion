function addDailyTasks() {
  const config = getConfig();
  const NOTION_API_KEY = config.NOTION_API_KEY;
  const database_id = config.NOTION_DATABASE_ID;

  const url = 'https://api.notion.com/v1/pages';
  const url2 = 'https://api.notion.com/v1/databases/' + database_id + '/query';

  let headers = {
    'content-type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer ' + NOTION_API_KEY,
    'Notion-Version': '2022-06-28',
  };

  // Customize your daily tasks and genres here
  let todo = [
    [
      'Daily Task 1',
      'Daily Task 2',
      'Daily Task 3'
    ], [
      'Genre of Task 1',
      'Genre of Task 2',
      'Genre of Task 3'
    ]
  ];

  let i = 0;
  let array = ReciveData(url2, headers);

  for (let item of todo[0]) {
    if (!array.includes(item)) {
      SendData(url, database_id, headers, item, todo[1][i]);
    }
    i++;
  }
}

function getConfig() {
  const props = PropertiesService.getScriptProperties();
  const NOTION_API_KEY = props.getProperty('NOTION_API_KEY') || '';
  const NOTION_DATABASE_ID = props.getProperty('NOTION_DATABASE_ID') || '';
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    throw new Error('Missing Notion configuration. Run setNotionConfig(apiKey, databaseId) or set script properties NOTION_API_KEY and NOTION_DATABASE_ID.');
  }
  return { NOTION_API_KEY, NOTION_DATABASE_ID };
}

/**
 * Helper: set Notion config in Script Properties.
 * Run once from the Apps Script editor: setNotionConfig('secret_api_key', 'database_id');
 */
function setNotionConfig(apiKey, databaseId) {
  if (!apiKey || !databaseId) {
    throw new Error('Both apiKey and databaseId are required');
  }
  PropertiesService.getScriptProperties().setProperties({
    NOTION_API_KEY: apiKey,
    NOTION_DATABASE_ID: databaseId
  });
}

function clearNotionConfig() {
  PropertiesService.getScriptProperties().deleteProperty('NOTION_API_KEY');
  PropertiesService.getScriptProperties().deleteProperty('NOTION_DATABASE_ID');
}

/**
 * Temporary helper for Apps Script editor: replace the two strings below
 * with your Notion token and database id, run this function once, then
 * remove or comment it out for safety.
 */
function setNotionConfigInteractive() {
  // Replace these with your real values before running
  const TOKEN = 'PASTE_YOUR_NOTION_INTEGRATION_TOKEN_HERE';
  const DATABASE_ID = 'PASTE_YOUR_DATABASE_ID_HERE';
  setNotionConfig(TOKEN, DATABASE_ID);
}

/**
 * Small verifier: run this to log current script properties (for debugging).
 */
function showNotionConfig() {
  const props = PropertiesService.getScriptProperties();
  console.log('NOTION_API_KEY:', props.getProperty('NOTION_API_KEY') ? 'SET' : 'MISSING');
  console.log('NOTION_DATABASE_ID:', props.getProperty('NOTION_DATABASE_ID') ? props.getProperty('NOTION_DATABASE_ID') : 'MISSING');
}

function ReciveData(url, headers) {

  let payload = {
    'start_cursor': undefined,
    'filter': {
        'and' : [
          {
            'property': 'Date',  // Change the 'Date' to your name of property
            'date': {
              'is_empty' : true
            }
          },
          {
            "property": "Status", // Change the 'Status' to your name of property
            "status": {
              "equals": "Todo"
            }
          }] 
      }
  }
  
  const opts = {
    'method': 'POST',
    'headers': headers,
    'payload': JSON.stringify(payload),
  };

  let notion_data = UrlFetchApp.fetch(url, opts);
  let tables = JSON.parse(notion_data.getContentText());

  let array =[];
  for(let item of tables.results){
    const prop = item.properties && item.properties['Name'];
    const titleArr = prop && prop.title ? prop.title : [];
    const name = titleArr.length ? titleArr[0].plain_text : '';
    if (name) array.push(name);
  }

  return array;
}

function SendData(url, database_id, headers, todo, genre) {
  const payload = {
    'parent': { 'database_id': database_id },
    'properties': {
      'Name': {  // Change the 'Name' to your name of property
        'title': [
          {
            'text': {
              'content': todo
            }
          }
        ]
      },
      "Genre": {  // Change the 'Genre' to your name of property
        "type": "select",
        "select": {
              "name": genre
        }
      },
      "Status": {  // Change the 'Status' to your name of property
            "type": "status",
            "status": {
                "name": "Todo"
            }
        }
    }
  };

  const opts = {
    'method': 'POST',
    'headers': headers,
    'payload': JSON.stringify(payload),
  };

  UrlFetchApp.fetch(url, opts);
}
