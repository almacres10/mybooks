const {addBooksHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBooksByHandler} = require('./handler');
const Joi = require('joi');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBooksHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
    options: {
      validate: {
        query: Joi.object({
            name: Joi.string().min(1).optional(),
            reading: Joi.string().valid('0', '1').optional(),
            finished: Joi.string().valid('0', '1').optional(),
          })
      },
    },
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBooksByHandler,
  },

];

module.exports = routes;
