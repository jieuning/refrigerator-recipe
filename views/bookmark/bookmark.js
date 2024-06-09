import { PublicTabBar } from "../public/js/tabBar.js";
import { ItemCardHtml } from "../public/js/publicHtml.js";

// 공용 탭바 렌더링
const tabBarRender = () => {
  const container = document.querySelector("#container");
  return PublicTabBar(container);
};
tabBarRender();

let activeData = [];
const storageKeys = Object.keys(localStorage);
const bookmarkLists = document.querySelector(".item_lists");

const emptyHtml = () => {
  return `
    <div class="empty_wrap">
      <img class="empty_icon" src="../../image/egg_icon.png" />
      <span class="empty_title">마음에 드는 레시피를<br/>지금 바로 추가해보세요.</span>
    </div>
  `;
};

const bookmarkData = () => {
  // 로컬스토리지에서 ingredient, pageId 제외
  const ingredientRemove = storageKeys.filter(
    (string) => string !== "ingredient" && string !== "pageId"
  );

  ingredientRemove.forEach((key) => {
    const localData = JSON.parse(localStorage.getItem(`${key}`));
    activeData.push(localData[0]);
  });

  const allRemoveBtn = document.querySelector(".all_remove_btn");

  if (activeData.length !== 0) {
    allRemoveBtn.classList.add("on");
  } else {
    allRemoveBtn.classList.remove("on");
  }

  markedItemRender(activeData);

  // 모든 재료 일괄 삭제
  allRemoveBtn.addEventListener("click", () =>
    allRemoveBookmark(ingredientRemove, activeData, allRemoveBtn)
  );
};

const markedItemRender = (activeData) => {
  // 재렌더링시 초기화
  bookmarkLists.innerHTML = "";

  if (activeData.length !== 0) {
    activeData.forEach((data) => {
      bookmarkLists.innerHTML += ItemCardHtml(data);
    });
  } else {
    bookmarkLists.innerHTML = emptyHtml();
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

const allRemoveBookmark = (ingredientRemove, activeData, allRemoveBtn) => {
  if (activeData.length !== 0) {
    activeData = [];
    ingredientRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
    bookmarkLists.innerHTML = emptyHtml();
    allRemoveBtn.classList.remove("on");
  }
};

const clickBookmarkBtn = (bookmarkId) => {
  // 토글이 false면 해당 항목 제거
  localStorage.removeItem(`bookmark-${bookmarkId}`);

  activeData = [];

  // 삭제된 아이템을 뺀 나머지 재 렌더링
  const storageKeys = Object.keys(localStorage);

  // 로컬스토리지에서 ingredient 제외
  const ingredientRemove = storageKeys.filter(
    (string) => string !== "ingredient" && string !== "pageId"
  );

  ingredientRemove.forEach((key) => {
    const localData = JSON.parse(localStorage.getItem(`${key}`));
    activeData.push(localData[0]);
  });

  markedItemRender(activeData);
};

bookmarkData();
