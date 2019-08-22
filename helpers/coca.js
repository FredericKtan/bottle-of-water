// Trello helpers
const dotenv = require('dotenv');
dotenv.config();

const TRELLO_API = "https://api.trello.com/1/";
const QUERY_PARAMS = `?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`;

const getBoardWithId = (boardId) => {
  return `${TRELLO_API}boards/${boardId}${QUERY_PARAMS}`;
};

const getListsWithBoardId = (boardId) => {
  return `${TRELLO_API}boards/${boardId}/lists${QUERY_PARAMS}`;
}

const getCardsWithListId = (listId) => {
  return `${TRELLO_API}lists/${listId}/cards${QUERY_PARAMS}`;
};

module.exports =  {
  getBoardWithId,
  getListsWithBoardId,
  getCardsWithListId,
};
