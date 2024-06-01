import { PublicTabBar } from "../public/js/tabBar.js";

// 공용 탭바 렌더링
const tabBarRender = () => {
  const container = document.querySelector("#container");
  return PublicTabBar(container);
};
tabBarRender();

let activeData = [];

const bookmarkData = () => {
  const storageKeys = Object.keys(localStorage);

  // 로컬스토리지에서 ingredient 제외
  const ingredientRemove = storageKeys.filter(
    (string) => string !== "ingredient"
  );

  ingredientRemove.forEach((key) => {
    const localData = JSON.parse(localStorage.getItem(`${key}`));
    activeData.push(localData[0]);
  });

  markedItemRender(activeData);
};

const bookmarkLists = document.querySelector(".item_lists");

const markedItemRender = (activeData) => {
  // 재렌더링시 초기화
  bookmarkLists.innerHTML = "";

  if (activeData.length !== 0) {
    activeData.forEach((data) => {
      bookmarkLists.innerHTML += bookmarkCardHtml(data);
    });
  } else {
    bookmarkLists.innerHTML = `
        <div class="empty_wrap">
            <img class="empty_icon" src="../../image/egg_icon.png" />
            <span class="empty_title">마음에 드는 레시피를<br/>지금 바로 추가해보세요.</span>
        </div>
    `;
  }

  // 북마커가 삭제된 후에 새로운 activeData가 재렌더링되더라도
  // 북마커의 상태가 유지되도록
  const bookmarks = document.querySelectorAll(".bookmark");

  bookmarks.forEach((bookmark) => {
    bookmark.classList.add("on");
    bookmark.addEventListener("click", () => {
      let bookmarkId = bookmark.getAttribute("data-id");
      clickBookmarkBtn(bookmarkId);
    });
  });
};

const clickBookmarkBtn = (bookmarkId) => {
  // 토글이 false면 해당 항목 제거
  localStorage.removeItem(`bookmark-${bookmarkId}`);

  activeData = [];

  // 삭제된 아이템을 뺀 나머지 재 렌더링
  const storageKeys = Object.keys(localStorage);

  // 로컬스토리지에서 ingredient 제외
  const ingredientRemove = storageKeys.filter(
    (string) => string !== "ingredient"
  );

  ingredientRemove.forEach((key) => {
    const localData = JSON.parse(localStorage.getItem(`${key}`));
    activeData.push(localData[0]);
  });

  markedItemRender(activeData);
};

const bookmarkCardHtml = (data) => {
  return `
            <li class="item_list">
                <div class="img_wrap">
                    <a href=${`http://127.0.0.1:5500/views/detail/index.html#?id=${data.RECIPE_ID}`}>
                        <img src="/image/fake_img.png"/>
                    </a>
                </div>
                <article class="item_contents">
                    <div class="title_wrap">
                        <h2 class="item_title">${data.RECIPE_NM_KO}</h2>
                        <p class="item_Summary">${data.SUMRY}</p>
                    </div>
                    <div class="item_tags">
                        <span class="level">${data.LEVEL_NM}</span>
                        <span class="cooking_time">${data.COOKING_TIME}</span>
                        <span class="bookmark" data-id=${data.RECIPE_ID}></span>
                    </div>
                </article>
            </li>
        `;
};

bookmarkData();
