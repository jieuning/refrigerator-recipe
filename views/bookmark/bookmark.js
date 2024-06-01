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

  const bookmarks = document.querySelectorAll(".bookmark");

  for (let i = 0; i < bookmarks.length; i++) {
    bookmarks[i].classList.add("on");
    bookmarks[i].addEventListener("click", () => {
      let bookmarkId = bookmarks[i].getAttribute("data-id");
      clickBookmarkBtn(i, bookmarks, activeData, bookmarkId); // 필터링된 데이터 전달
    });
  }
};

const bookmarkLists = document.querySelector(".item_lists");

const markedItemRender = (activeData) => {
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
};

const clickBookmarkBtn = (i, bookmarks, data, bookmarkId) => {
  const target = bookmarks[i];

  // 클릭된 api 데이터의 레시피 id 값과 클릭한 리스트의 레시피 아이디 값이 같은 데이터
  // const filteredItem = data.filter((item) => item.RECIPE_ID == bookmarkId);

  // 사용할 데이터만 추출
  // const usingData = [
  //   {
  //     CALORIE: filteredItem[0].CALORIE,
  //     COOKING_TIME: filteredItem[0].COOKING_TIME,
  //     LEVEL_NM: filteredItem[0].LEVEL_NM,
  //     QNT: filteredItem[0].QNT,
  //     RECIPE_ID: filteredItem[0].RECIPE_ID,
  //     RECIPE_NM_KO: filteredItem[0].RECIPE_NM_KO,
  //     SUMRY: filteredItem[0].SUMRY,
  //   },
  // ];

  // 필터로인해 인덱스가 일정하지 않음
  // 새로고침시 클릭된 북마커의 순서를 유지하기 위해 key 값에 레시피 id부여
  // localStorage.getItem(`bookmark-${bookmarkId}`);

  // if (target.classList.contains("on")) {
  //   // 업데이트
  //   localStorage.setItem(`bookmark-${bookmarkId}`, JSON.stringify(usingData));
  // } else {
  // 토글이 false면 해당 항목 제거
  localStorage.removeItem(`bookmark-${bookmarkId}`);

  activeData = [];
  // bookmarkLists.innerHTML = "";

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

  // activeData.forEach((data) => {
  //   bookmarkLists.innerHTML += bookmarkCardHtml(data);
  // });

  // if (activeData.length === 0) {
  //   bookmarkLists.innerHTML = `
  //     <div class="empty_wrap">
  //         <img class="empty_icon" src="../../image/egg_icon.png" />
  //         <span class="empty_title">마음에 드는 레시피를<br/>지금 바로 추가해보세요.</span>
  //     </div>
  // `;
  // }
  markedItemRender(activeData);
  // }
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
