window.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#container-card"),
    partOfURL = new URLSearchParams(window.location.search);

  async function getData() {
    const response = await fetch(
        `https://gorest.co.in/public-api/posts?page=${partOfURL.get("page")}`
      ),
      data = await response.json();
    return JSON.parse(JSON.stringify(data));
  }

  //создание блока карточки для публикации постов
  function createElement(header, text, id, partOfURL) {
    const mainContainer = document.createElement("div"),
      link = document.createElement("a"),
      cardContainer = document.createElement("div"),
      cardBody = document.createElement("div"),
      title = document.createElement("h2"),
      textArticle = document.createElement("p");

    //добавляем классы для HTML- тэгов из библиотеки Bootstrap
    mainContainer.classList.add("col-xl-6", "mb-4");
    cardContainer.classList.add("card", "h-100", "text-dark", "shadow");
    cardBody.classList.add("card-body");
    title.classList.add("card-title");
    textArticle.classList.add("card-text", "mt-4");
    link.classList.add("text-decoration-none", "text-reset");

    /*говорим, что в элементы title и textArticle попадут элементы
(название статьи и сама статья) после перебора массива в функции createApp*/
    title.textContent = header;
    textArticle.textContent = text;

    // публикуем на странице созданные элементы
    mainContainer.append(link);
    link.append(cardContainer);
    cardContainer.append(cardBody);
    cardBody.append(title, textArticle);

    /* задаем условие для того, чтобы иметь возможность переходить на 2 страницу, связываем ее
с выбранным блогом */
    partOfURL.get("page")
      ? link.setAttribute(
          "href",
          `./comments.html?id=${id}&page=${partOfURL.get("page")}`
        )
      : link.setAttribute("href", `./comments.html?id=${id}&page=1`);

    return mainContainer;
  }

  //формируем блок с пагинацией, связываем элементы с текущими страницами
  function displayPagintaion(page) {
    const list = document.querySelector(".pagination"),
      item = document.createElement("li"),
      link = document.createElement("a");

    link.href = `index.html?page=${page}`;

    item.classList.add("page-item");
    link.classList.add("page-link");

    link.textContent = `${page}`;

    list.append(item);
    item.append(link);

    return list;
  }

  //формируем блок с кнопками перехода по страницам
  function createPaginationBtn(onePage, pages) {
    let groupBtn = document.querySelector(".group-button"),
      pagLinkPrev = document.createElement("a"),
      pagLinkNext = document.createElement("a");

    pagLinkPrev.textContent = "Previous page";
    pagLinkNext.textContent = "Next page";
    const btnStyle = ["btn", "btn-primary", "btn-nav"];

    pagLinkPrev.classList.add(...btnStyle, "btn-previous");
    pagLinkNext.classList.add(...btnStyle, "btn-next");
    groupBtn.append(pagLinkPrev);
    groupBtn.append(pagLinkNext);

    pagLinkPrev.id = "btn-previous";
    pagLinkNext.id = "btn-next";

    //объявляем переменные с условием перехода по текущим страницам
    const pagePrevNum = onePage - 1 < 1 ? 1 : onePage - 1;
    const pageNextNum = onePage + 1 > pages ? pages : onePage + 1;
    const btnPageNav = document.querySelectorAll(".btn-nav");

    btnPageNav.forEach((event) => {
      event.addEventListener("click", (el) => {
        if (el.target.classList.contains("btn-next")) {
          const linkBtnNext = `?page=${pageNextNum}`;
          const btnNextHtml = el.path[0];

          btnNextHtml.setAttribute("href", `index.html${linkBtnNext}`);
        } else {
          const linkBtnPrev = pagePrevNum === 1 ? "" : `?page=${pagePrevNum}`;
          const btnPrevHtml = el.path[0];

          btnPrevHtml.setAttribute("href", `index.html${linkBtnPrev}`);
        }
      });
    });
    //формируем условие - если задать страницу, которой нет на сервере, выпадет ошибка
    if (onePage > pages || onePage < 0) {
      const title = document.createElement("h2");
      title.classList.add("title", "text-danger", "text-center");
      title.innerText = "Такой страницы нет!";
      container.append(title);
    }

    return {
      groupBtn,
      btnPageNav,
    };
  }

  //запускаем приложение
  async function createApp() {
    //получаем данные с сервера
    const dataResponse = await getData();
    //спомощью метода форич отрисовываем страницу с блоками информации
    dataResponse.data.forEach((e) => {
      container.append(createElement(e.title, e.body, e.id, partOfURL));
    });
    //объявляем переменные с общим количеством страниц, с лимитом вывода информации на страницу
    let pages = dataResponse.meta.pagination.pages;
    let onePage = dataResponse.meta.pagination.page;
    let limit = dataResponse.meta.pagination.limit;

    //запускаем цикл, с помощью которого выводим кнопки пагинации на страницу

    let c = document.createElement("li")
    c.classList.add('d-flex')
    c.innerHTML = `
    <a href="index.html?page=11" class="page-link">...</a>
    <a href="index.html?page=${pages - 2}" class="page-link">${pages - 2}</a>
    <a href="index.html?page=${pages - 1}" class="page-link">${pages - 1}</a>
    <a href="index.html?page=${pages}" class="page-link">${pages}</a>`;

    for (let i = 1; i < pages; i++) {
      if (i <= 5) {
        displayPagintaion(i);
      } else if (i > 6 && i <= 9) {
        displayPagintaion(i);
      } else if (i == 10) {
        let a = displayPagintaion(i);
        a.append(c);
      }
    }

    createPaginationBtn(onePage, pages);
  }
  createApp();
});
