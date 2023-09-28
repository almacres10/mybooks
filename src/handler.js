const { nanoid } = require('nanoid');
const books = require('./books')


const addBooksHandler = (request, h) => {
    const { name, year, author, summary, publisher, 
        pageCount, readPage, reading } = request.payload;
    const bookId = nanoid(16);
    const insertedAt = new Date().toISOString();
    const finished = pageCount === readPage;
    const updatedAt = insertedAt;

    if (readPage > pageCount) {
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
    }

    else if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    else {
    const newBooks = {
        name, year, author, summary, publisher, 
        pageCount, readPage, reading, bookId, insertedAt, finished, updatedAt
    };

    books.push(newBooks)
    
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: newBooks.bookId,
        },
    });
    
    
    response.code(201);
    return response;
  }
    
};


const getAllBooksHandler = (request, h) => {
  const successBooks = books;
  const booksData = successBooks.map((book) => ({
    id: book.bookId,
    name: book.name,
    publisher: book.publisher,
  }));
  const response = h.response({
    status: 'success',
    data: {
      books: booksData,
    },
  });
  response.code(200);
  return response;
};



const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params; 
    const selectedBook = books.find((book) => book.bookId === bookId);

    // const booksData = selectedBook.map((book) => ({
    //   id: book.bookId,
    //   name: book.name,
    //   year: book.year,
    //   author: book.author,
    //   summary: book.summary,
    //   publisher: book.publisher,
    //   pageCount : book.pageCount,
    //   readPage : book.readPage,
    //   finished : book.finished,
    //   reading : book.reading,
    //   insertedAt : book.insertedAt,
    //   updatedAt : book.updatedAt
    // }));
  
    if (selectedBook !== undefined) {
      return {
        status: 'success',
        data: {
          book: {
            id: selectedBook.bookId,
            name: selectedBook.name,
            year: selectedBook.year,
            author: selectedBook.author,
            summary: selectedBook.summary,
            publisher: selectedBook.publisher,
            pageCount: selectedBook.pageCount,
            readPage: selectedBook.readPage,
            finished: selectedBook.finished,
            reading: selectedBook.reading,
            insertedAt: selectedBook.insertedAt,
            updatedAt: selectedBook.updatedAt
          }
        },
      };
    }
  
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  };
  

const editBookByIdHandler = (request, h) => {
    try {
      const { bookId } = request.params;
  
      const { name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt } = request.payload;    
      const updatedAt = new Date().toISOString();
  
      const index = books.findIndex((book) => book.bookId === bookId);
  
      if (index !== -1) {

        if (!name) {
          const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
          });
          response.code(400);
          return response;
        }

        if (readPage > pageCount) {
          const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
          });
          response.code(400);
          return response;
        }

        books[index] = {
          ...books[index],
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          finished,
          reading,
          insertedAt,
          updatedAt,
        };
        
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
      }
  
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak ditemukan',
      });
      response.code(404);
      return response;
    } catch (error) {
      const response = h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      });
      response.code(500);
      return response;
    }
  };
  
  const deleteBooksByHandler = (request, h) => {
    try {
      const { bookId } = request.params;
  
      const index = books.findIndex((book) => book.bookId === bookId);
  
      if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil dihapus',
          data: {
            books:{
              id: book.bookId,
              name: book.name,
              publisher: book.publisher,
            }
          }
        });
        response.code(200);
        return response;
      }
  
      const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      });
      response.code(404);
      return response;
    } catch (error) {
      const response = h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      });
      response.code(500);
      return response;
    }
  };
 
module.exports = { addBooksHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBooksByHandler  };