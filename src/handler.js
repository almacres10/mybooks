const {nanoid} = require('nanoid');
const books = require('./books');


const addBooksHandler = (request, h) => {
  const {name, year, author, summary, publisher,
    pageCount, readPage, reading} = request.payload;
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
  } else if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else {
    const newBooks = {
      name, year, author, summary, publisher,
      pageCount, readPage, reading, bookId, insertedAt, finished, updatedAt,
    };

    books.push(newBooks);

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
  const {name, reading, finished} = request.query;

  const isReading = reading === '1';
  const isFinished = finished === '1';

  const filteredBooks = books.filter((book) => {
    const nameMatch = !name || book.name.toLowerCase().includes(name.toLowerCase());
    const readingMatch = !reading || (isReading ? book.reading : !book.reading);
    const finishedMatch = !finished || (isFinished ? book.finished : !book.finished);
    return nameMatch && readingMatch && finishedMatch;
  });

  const booksData = filteredBooks.map((book) => ({
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
  const {bookId} = request.params;
  const selectedBook = books.find((book) => book.bookId === bookId);

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
          updatedAt: selectedBook.updatedAt,
        },
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
  const {bookId} = request.params;

  const {name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt} = request.payload;
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
      data: {
        books: books,
      },
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
};

// const deleteBooksByHandler = (request, h) => {
//   const { bookId } = request.params;

//   const index = books.findIndex((book) => book.bookId === bookId);

//   if (index !== -1) {
//     books.splice(index, 1);
//     const response = h.response({
//       status: 'success',
//       message: 'Buku berhasil dihapus',
//     });
//     response.code(200);
//     return response;
//   }

//   const response = h.response({
//     status: 'fail',
//     message: 'Buku gagal dihapus. Id tidak ditemukan',
//   });
//   response.code(404);
//   return response;
// };

const deleteBooksByHandler = (request, h) => {
  const {bookId} = request.params;

  const index = books.findIndex((book) => book.bookId === bookId);

  if (index !== -1) {
    const deletedBook = books[index];

    books.splice(index, 1);

    const bookData = {
      id: deletedBook.bookId,
      name: deletedBook.name,
      publisher: deletedBook.publisher,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
      data: {
        books: [bookData],
      },
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
};

module.exports = {addBooksHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBooksByHandler};
