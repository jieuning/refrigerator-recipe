import { PublicTabBar } from "../../public/js/tabBar.js";
import { ItemCardHtml } from "../../public/js/publicHtml.js";
import { SkeletonCardHtml } from "../../public/js/publicHtml.js";

// 공용 탭바 렌더링
const tabBarRender = () => {
  const container = document.querySelector("#container");
  return PublicTabBar(container);
};
tabBarRender();

const itemLists = document.querySelector(".item_lists");

// 로딩 텍스트를 표시하는 함수
const showLoadingText = () => {
  itemLists.innerHTML = '<div class="loading">레시피를 찾고 있습니다</div>';
};

// 스켈레톤 로딩 카드를 검색된 아이템 수 만큼 표시
const showSkeletonCards = (count) => {
  itemLists.innerHTML = "";
  for (let i = 0; i < count; i++) {
    itemLists.innerHTML += SkeletonCardHtml();
  }
};

const fetchIngredData = async (ingredients) => {
  // 특정 재료 데이터의 id 값을 얻기 위해 불러옴
  const ingredRes = await fetch(
    `http://rational-viole-cc4fd-aed52-77c17265.koyeb.app/api/ingredient/id?ingredient=${ingredients}`
  );
  if (!ingredRes.ok) {
    throw new Error(response.statusText);
  }
  const result = ingredRes.json();
  return result;
};

const fetchIngredAllData = async (ingredients) => {
  const promises = ingredients.map((ingredient) => fetchIngredData(ingredient));
  return Promise.all(promises);
};

const serverUrl = "http://rational-viole-cc4fd-aed52-77c17265.koyeb.app";
const fetchBaseData = async (id) => {
  // 재료 데이터의 id 값을 통해 base데이터를 가져온다.
  const baseRes = await fetch(`${serverUrl}/api/base/detail?id=${id}`);
  if (!baseRes.ok) {
    throw new Error(response.statusText);
  }
  const result = baseRes.json();
  return result;
};

const fetchBaseAllData = async (recipeId) => {
  const promises = recipeId.map((id) => fetchBaseData(id));
  return Promise.all(promises);
};

const getRecipeData = async () => {
  try {
    showLoadingText(); // 로딩 텍스트 표시

    let ingredients = [];
    const getIngred = JSON.parse(localStorage.getItem("ingredient"));

    getIngred.forEach((ingred) => {
      ingredients.push(ingred.ingredient);
    });

    // 재료의 id를 얻기 위한 fetch 데이터
    const ingredResult = await fetchIngredAllData(ingredients);

    // 중복 없애기 위해 set사용
    let recipeId = new Set();

    ingredResult.forEach((data) => {
      const rows = data.Grid_20150827000000000227_1.row;
      if (rows.length !== 0) {
        rows.forEach((id) => {
          // 중복되는 id가 있다면 제거 후 추가
          recipeId.add(id.RECIPE_ID);
        });
      }
    });
    recipeId = Array.from(recipeId);

    // 검색된 아이템 수만큼 스켈레톤 로딩 화면을 표시
    showSkeletonCards(recipeId.length);

    // 재료의 id를 통해 베이스 레시피 데이터 가져오기
    const baseResult = await fetchBaseAllData(recipeId);
    const baseData = baseResult.map(
      (result) => result.Grid_20150827000000000226_1.row[0]
    );

    // 데이터를 모두 가져왔으므로 스켈레톤 로딩 화면을 지움
    itemLists.innerHTML = "";

    if (baseData.length !== 0) {
      baseData.forEach((data) => {
        itemLists.innerHTML += ItemCardHtml(data);
      });

      const bookmarks = document.querySelectorAll(".bookmark");
      const itemLink = document.querySelectorAll(".img_wrap a");

      for (let i = 0; i < bookmarks.length; i++) {
        bookmarks[i].addEventListener("click", () => {
          let bookmarkId = bookmarks[i].getAttribute("data-id");
          // 필터링된 데이터 전달x
          clickBookmarkBtn(i, bookmarks, baseData, bookmarkId);
        });
      }

      bookmarkState(itemLink);
    } else {
      itemLists.innerHTML = emptyHtml();
    }

    const prevBtn = document.querySelector(".prev_btn");
    prevBtn.addEventListener("click", () => {
      history.go(-1);
    });
  } catch (error) {
    console.log(error.message);
  }
};
getRecipeData();

const emptyHtml = () => {
  return `
            <div class="empty_wrap">
              <img
                class="empty_icon"
                src="../../image/no_customized.png"
                alt="포크랑 숫가락 아이콘"
              />
              <span class="empty_title">
                해당 재료에 대한 레시피가
                <br /> 존재하지 않습니다.
              </span>
            </div>`;
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

      // itemLink 중 해당 id와 일치하는 항목 필터링
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
