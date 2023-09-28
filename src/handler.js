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
  const successBooks = books
  const response = h.response({
    status: 'success',
    data: {
      bookId: successBooks.bookId,
      name: successBooks.name,
      author: successBooks.author
    },
  });
  response.code(200);
  return response;
};



const getBookByIdHandler = (request, h) => {
    const { id } = request.params; // Gunakan request.params untuk mengambil parameter 'id'
    const selectedBook = books.find((book) => book.id === id); // Gunakan .find() untuk mencari buku berdasarkan ID
  
    if (selectedBook !== undefined) {
      return {
        status: 'success',
        data: {
          book: selectedBook,
        },
      };
    }
  
    const response = h.response({
      status: 'fail',
      message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response;
  };
  

const editBookByIdHandler = (request, h) => {
    try {
      const { id } = request.params;
  
      const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;    
      const updatedAt = new Date().toISOString();
  
      const index = books.findIndex((book) => book.id === id);
  
      if (index !== -1) {
        books[index] = {
          ...books[index],
          name,
          year,
          summary,
          publisher,
          pageCount,
          readPage,
          reading,
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
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
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
      const { id } = request.params;
  
      const index = books.findIndex((book) => book.id === id);
  
      if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        });
        response.code(204); // Menggunakan 204 No Content untuk penghapusan yang berhasil
        return response;
      }
  
      const response = h.response({
        status: 'fail',
        message: 'Gagal menghapus buku. Id tidak ditemukan',
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