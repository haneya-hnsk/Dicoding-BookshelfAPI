const {nanoid} = require('nanoid');
const books = require('./books')


const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);

    return response;
  }

  const finished = readPage === pageCount ? true : false;

  const id = nanoid(16);

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
};



const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;


  if (name !== undefined) {
    const filteredByName = books.filter(
      (book) => book.name.toLowerCase().includes(name.toLowerCase())
    );

    console.log(filteredByName);

   
    const response = h.response({
      status: "success",
      data: {
        books: filteredByName.map(({ id, name, publisher }) => ({
          id,
          name,
          publisher,
        })),
      },
    });
    return response;
  }

  if (finished !== undefined) {

    const filteredByFinished = books.filter((book) => book.finished == finished);
    console.log(filteredByFinished)

    const response = h.response({
      status: "success",
      data: {
        books: filteredByFinished.map(({ id, name, publisher }) => ({
          id,
          name,
          publisher,
        })),
      },
    });
    return response;
  }

  if (reading !== undefined) {
   const filteredByReading = books.filter((book) => book.reading == reading);

    const response = h.response({
      status: "success",
      data: {
        books: filteredByReading.map(({ id, name, publisher }) => ({
          id,
          name,
          publisher,
        })),
      },
    });
    return response;
  }

  const response = h.response({
    status: "success",
    data: {
      books: books.map(({ id, name, publisher }) => ({ id, name, publisher })),
    },
  });
  return response;
  // status: "success",
  // data: {
  //   books: books.map(({ id, name, publisher }) => ({ id, name, publisher })),
  // },
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    console.log(book);
    return {
      status: "success",
      data: {
        book: book,
      },
    };
  }
  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);

  if (index == -1) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const finished = readPage == pageCount ? true : false;

  // console.log(books[index])

  // console.log(name)
  if (index !== -1) {
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
      updatedAt,
    };
    // console.log(books[index])

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
      data: {
        bookId: id,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
