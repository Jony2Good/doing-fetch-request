window.addEventListener("DOMContentLoaded", () => {
  // получаем элементы со страницы
  const post = document.querySelector("#post"),
    comments = document.querySelector("#comments"),
    btn = document.querySelector(".btn");

  // сщздаем блок с информацией на странице
  function createElements(header, body) {
    const post = document.createElement("div"),
      title = document.createElement("h1"),
      text = document.createElement("p");

    title.textContent = header;
    text.textContent = body;
    post.append(title);
    post.append(text);

    return post;
  }

  // формируем блок с комментариями
  function createComments(author, commentText) {
    const comment = document.createElement("div"),
      title = document.createElement("h3"),
      text = document.createElement("p");

    title.textContent = author;
    text.textContent = commentText;
    comment.append(title);
    comment.append(text);

    return comment;
  }

  //создаем страницу с получением ответов от сервера
  async function createPageComments() {
    // получаем часть адреса URL после символа ?
    const partOfURL = new URLSearchParams(window.location.search);

    // формируем запрос на получение поста и комментариев id - номер поста и комментария
    const responsePost = await fetch(
        `https://gorest.co.in/public-api/posts/${partOfURL.get("id")}`
      ),
      responseComment = await fetch(
        `https://gorest.co.in/public-api/comments?post_id=${partOfURL.get(
          "id"
        )}`
      ),
      //получаем ответы от сервера
      dataPost = await responsePost.json(),
      dataComment = await responseComment.json();

    // формируем логику для кнопки назад, сщздаем у нее атрибут href для возрата к странице
    if (partOfURL.get("page") == 1) {
      btn.setAttribute("href", "./index.html");
    } else {
      btn.setAttribute("href", `./index.html?page=${partOfURL.get("page")}`);
    }

    // создаем на странице элементы и комментарии
    post.append(createElements(dataPost.data.title, dataPost.data.body));

    dataComment.data.forEach((i) => {
      comments.append(createComments(i.name, i.body));
    });
  }

  createPageComments();
});
