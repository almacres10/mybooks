const { nanoid } = require('nanoid');
const books = require('./books')


const addBooksHandler = (request, h) => {
    const { name, year, author, summary, publisher, 
        pageCount, readpage, reading } = request.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();

    const finished = pageCount === readPage;
    const updatedAt = insertedAt;

    const newBooks = {
        name, year, author, summary, publisher, 
        pageCount, readpage, reading, id, insertedAt, finished, updatedAt
    };

    books.push(newBooks)


    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    
    if(readpage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        
        });
        response.code(400);
        return response;
    }
    
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            id: newBooks.id,
        },
    });
    response.code(201);
    return response;
    
};


const getAllBooksHandler = () => {
    const { name } = request.param;

    if(!name) {
        const response = h.response({
        status: 'success',
        data: [],
    });
    response.code(200);
    return response;
}

    const response = h.response({
        status: 'success',
        data: books,
    });
    response.code(200);
    return response;
}

const getBookByIdHandler = () => {
    const { id } = request.param;
    const books = books.filter((n) => n.id === id)[0];

    if(books !== undefined) {
        return {
            status: 'success',
            data: {
                books,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
      });
      response.code(404);
      return response;

}

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const { name, year, author, summary, publisher, pageCount, readpage, reading } = request.payload;    
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
          readpage,
          reading
        };
        const response = h.response({
          status: 'success',
          message: 'Catatan berhasil diperbarui',
        });
        response.code(200);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan',
      });
      response.code(404);
      return response;
    
};

const deleteBooksByHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if(index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
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
 
module.exports = { addBooksHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBooksByHandler  };