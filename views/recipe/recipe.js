import { PublicTabBar } from "../public/js/tabBar.js";

// 공용 탭바 렌더링
const tabBarRender = () => {
  const container = document.querySelector("#container");
  return PublicTabBar(container);
};
tabBarRender();

const levelArr = ["초보환영", "보통", "어려움"];
const itemFilters = document.querySelectorAll(".recipe_filter span");
let currentTarget = itemFilters[0];
let page = 1;

const fetchData = async () => {
  const API_KEY =
    "66c340d78ebbaf115f7216a55a2b2de11e2a215b696439ef449586096f885f49";
  const url = new URL(
    `http://211.237.50.150:7080/openapi/${API_KEY}/json/Grid_20150827000000000226_1/1/10`
  );

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`에러 발생: ${res.status}`);
    }

    const result = await res.json();
    const data = result.Grid_20150827000000000226_1.row;
    console.log(data);

    // 낮은 난이도 순으로 정렬 초기값
    currentTarget.classList.add("on");
    const lowLevel = data.sort((a, b) => {
      return levelArr.indexOf(a.LEVEL_NM) - levelArr.indexOf(b.LEVEL_NM);
    });

    itemFilters.forEach((filterBtn) => {
      filterBtn.addEventListener("click", (e) => handleClickFilter(e, data));
    });

    // 조건 데이터 별로 재정렬
    recipeListRender(lowLevel);

    const itemLink = document.querySelectorAll(".item_list .img_wrap a");

    // 초기값에 적용될 북마크
    bookmarkState(itemLink);
  } catch (error) {
    console.log(error.message);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

const recipeCardHtml = (data) => {
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

const recipeLists = document.querySelector(".item_lists");

const recipeListRender = (sortedData, target = currentTarget) => {
  recipeLists.innerHTML = "";

  currentTarget.classList.remove("on");
  target.classList.add("on");
  currentTarget = target;

  sortedData.forEach((data) => {
    recipeLists.innerHTML += recipeCardHtml(data);
  });

  addBookmarkListeners(sortedData); // 필터링된 데이터 전달
};

const handleClickFilter = (event, data) => {
  let target = event.target;
  let sortedData = returnSortedData(data, target);

  // 필터링된 데이터로 재렌더링
  recipeListRender(sortedData, target);
};

const returnSortedData = (data, target) => {
  const targetValue = target.innerText;

  if (targetValue === "낮은 난이도") {
    const lowLevel = data.sort((a, b) => {
      return levelArr.indexOf(a.LEVEL_NM) - levelArr.indexOf(b.LEVEL_NM);
    });
    return lowLevel;
  } else if (targetValue === "높은 난이도") {
    const highLevel = data.sort((a, b) => {
      return levelArr.indexOf(b.LEVEL_NM) - levelArr.indexOf(a.LEVEL_NM);
    });
    return highLevel;
  } else if (targetValue === "짧은 조리시간") {
    const lowTime = data.sort((a, b) => {
      return (
        Number(a.COOKING_TIME.slice(0, -1)) -
        Number(b.COOKING_TIME.slice(0, -1))
      );
    });
    return lowTime;
  } else {
    const highTime = data.sort((a, b) => {
      return (
        Number(b.COOKING_TIME.slice(0, -1)) -
        Number(a.COOKING_TIME.slice(0, -1))
      );
    });
    return highTime;
  }
};

const clickBookmarkBtn = (i, bookmarks, data, bookmarkId) => {
  const target = bookmarks[i];

  // 클릭된 api 데이터의 레시피 id 값과 클릭한 리스트의 레시피 아이디 값이 같은 데이터 필터
  const filteredItem = data.filter((item) => item.RECIPE_ID == bookmarkId);

  // 사용할 데이터만 추출
  const usingData = [
    {
      CALORIE: filteredItem[0].CALORIE,
      COOKING_TIME: filteredItem[0].COOKING_TIME,
      LEVEL_NM: filteredItem[0].LEVEL_NM,
      QNT: filteredItem[0].QNT,
      RECIPE_ID: filteredItem[0].RECIPE_ID,
      RECIPE_NM_KO: filteredItem[0].RECIPE_NM_KO,
      SUMRY: filteredItem[0].SUMRY,
    },
  ];

  // 필터로인해 인덱스가 일정하지 않음
  // 새로고침시 클릭된 북마커의 순서를 유지하기 위해 key 값에 레시피 id부여
  localStorage.getItem(`bookmark-${bookmarkId}`);

  const activeBookmark = target.classList.toggle("on");
  if (activeBookmark) {
    // 업데이트
    localStorage.setItem(`bookmark-${bookmarkId}`, JSON.stringify(usingData));
  } else {
    // 토글이 false면 해당 항목 제거
    localStorage.removeItem(`bookmark-${bookmarkId}`);
  }
};

const bookmarkState = (itemLink) => {
  const storageKeys = Object.keys(localStorage);

  if (storageKeys.length > 0) {
    storageKeys.forEach((key) => {
      const keyId = key.slice(9).trim();

      // itemLink 중 해당 ID와 일치하는 항목 필터링
      const clickedItems = Array.from(itemLink).filter((link) => {
        const linkHref = link.getAttribute("href");
        const url = new URL(linkHref.replace(/#/g, ""));
        const queryParams = new URLSearchParams(url.search).get("id");

        return queryParams === keyId;
      });

      if (clickedItems.length > 0) {
        clickedItems.forEach((item) => {
          // on 클래스를 추가하여 상태를 유지
          const bookmark = item
            .closest(".item_list")
            .querySelector(".bookmark");
          bookmark.classList.add("on");
        });
      }
    });
  }
};

const addBookmarkListeners = (data) => {
  const bookmarks = document.querySelectorAll(".bookmark");
  const itemLink = document.querySelectorAll(".item_list .img_wrap a");

  for (let i = 0; i < bookmarks.length; i++) {
    bookmarks[i].addEventListener("click", () => {
      let bookmarkId = bookmarks[i].getAttribute("data-id");
      // 필터링된 데이터 전달
      clickBookmarkBtn(i, bookmarks, data, bookmarkId);
    });
  }

  // 정렬된 데이터 마다 북마크 적용
  bookmarkState(itemLink);
};
