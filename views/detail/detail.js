import { PublicTabBar } from "../../public/js/tabBar.js";

// 공용 탭바 렌더링
const tabBarRender = () => {
  const container = document.querySelector("#container");
  return PublicTabBar(container);
};
tabBarRender();

const bookmarkId = () => {
  const storageKeys = Object.keys(localStorage);

  // 로컬스토리지에서 ingredient, pageId 제외
  const ingredientRemove = storageKeys.filter(
    (string) => string !== "ingredient" && string !== "pageId"
  );

  let currentBookmarkId = [];
  ingredientRemove.forEach((bookmark) => {
    // slice한 id가 1의 자리일 때 공백 제거 위해 trim사용
    const bookmarkId = bookmark.slice(9).trim();
    currentBookmarkId.push(bookmarkId);
  });

  return currentBookmarkId;
};

// 현재 페이지의 쿼리 파라미터 값 가져오기
const pageUrl = new URL(window.location.href.replace(/#/g, ""));
const pageParams = new URLSearchParams(pageUrl.search).get("id");

// 로컬스토지지에 저장된 key값 이름에 페이지 params가 포함되는지 조건 정의
// 이로써 디테일 페이지 북마크의 버튼을 두번 클릭해야 하는 문제 해결
let bool;
const localBookmark = bookmarkId();
localBookmark.includes(pageParams) ? (bool = false) : (bool = true);

const API_KEY =
  "66c340d78ebbaf115f7216a55a2b2de11e2a215b696439ef449586096f885f49";
const detailFetchData = async () => {
  const basicUrl = new URL(
    `http://211.237.50.150:7080/openapi/${API_KEY}/json/Grid_20150827000000000226_1?RECIPE_ID=${pageParams}`
  );
  const recipeUrl = new URL(
    `http://211.237.50.150:7080/openapi/${API_KEY}/json/Grid_20150827000000000228_1?RECIPE_ID=${pageParams}`
  );
  const ingredUrl = new URL(
    `http://211.237.50.150:7080/openapi/${API_KEY}/json/Grid_20150827000000000227_1?RECIPE_ID=${pageParams}`
  );

  try {
    const basicRes = fetch(basicUrl);
    const recipeRes = fetch(recipeUrl);
    const ingredRes = fetch(ingredUrl);

    // 병렬처리, json 파싱
    const allRes = await Promise.all([basicRes, recipeRes, ingredRes]);
    const [basicResult, recipeResult, ingredResult] = await Promise.all(
      allRes.map((res) => res.json())
    );

    // 사용할 데이터
    const basicData = basicResult.Grid_20150827000000000226_1.row;
    const recipeData = recipeResult.Grid_20150827000000000228_1.row;
    const ingredData = ingredResult.Grid_20150827000000000227_1.row;

    baseHtmlRender(basicData, ingredData, recipeData);
    ingredData.forEach((data) => {
      if (data.IRDNT_TY_NM === "주재료") {
        ingredHtmlRender(data, "main");
      } else if (data.IRDNT_TY_NM === "부재료") {
        ingredHtmlRender(data, "sub");
      } else {
        ingredHtmlRender(data, "source");
      }
    });

    const bookmarkSvg = document.querySelector(".detail_bookmark svg");
    const currentBookmarkId = bookmarkId();

    currentBookmarkId.forEach((bookmarkId) => {
      if (bookmarkId === pageParams) {
        bookmarkSvg.children[0].setAttribute("fill", "#58B93F");
      }
    });

    bookmarkSvg.addEventListener("click", () =>
      handleClickBookmark(pageParams, basicData, bookmarkSvg)
    );

    const prevBtn = document.querySelector(".prev_btn");
    prevBtn.addEventListener("click", () => {
      history.go(-1);
    });
  } catch (error) {
    console.log(error.message);
  }
};
detailFetchData();

const detailWrap = document.querySelector(".detail_wrap");
const baseHtmlRender = (basicData, ingredData, recipeData) => {
  detailWrap.innerHTML = `
        <section class="detail_img">
            <nav class="prev_nav">
                <div class="prev_btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2.5rem" height="2.5rem" viewBox="0 0 24 24">
                        <path fill="#1e1e1e"
                            d="M12.727 3.687a1 1 0 1 0-1.454-1.374l-8.5 9a1 1 0 0 0 0 1.374l8.5 9.001a1 1 0 1 0 1.454-1.373L4.875 12z" />
                    </svg>
                </div>
            </nav>
            <img src="../../image/recipe_${
              basicData[0].RECIPE_ID <= 100 ? basicData[0].RECIPE_ID : "no"
            }.jpeg" />
        </section>
        <section class="detail_top detail_section">
            <div class="detail_tag">
                <span>${basicData[0].LEVEL_NM}</span>
                <span>약 ${basicData[0].COOKING_TIME} 소요</span>
                <span>${basicData[0].QNT} 기준</span>
                <span>${basicData[0].CALORIE}</span>
            </div>
            <div class="detail_title">
                <div class="title_wrap">
                    <h1 class="title">${basicData[0].RECIPE_NM_KO}</h1>
                    <p class="summery_txt">${basicData[0].SUMRY}</p>
                </div>
                <div class="detail_bookmark">
                 <svg xmlns="http://www.w3.org/2000/svg" width="2.5rem" height="2.5rem" viewBox="0 0 10 15">
                  <path fill="#e1e1e1"
                    d="M3.5 2a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .765.424L7.5 11.59l3.735 2.334A.5.5 0 0 0 12 13.5v-11a.5.5 0 0 0-.5-.5z"/>
                 </svg>
                </div>
            </div>
        </section>
        <section class="ingredient detail_section">
            <div class="main_ingred ingredient_wrap">
                ${
                  ingredData.some((data) => data.IRDNT_TY_NM === "주재료")
                    ? '<h2 class="title_txt">주재료</h2>'
                    : ""
                }
                <dl></dl>
            </div>
            <div class="sub_ingred ingredient_wrap">
                ${
                  ingredData.some((data) => data.IRDNT_TY_NM === "부재료")
                    ? '<h2 class="title_txt">부재료</h2>'
                    : ""
                }
                <dl></dl>
            </div>
            <div class="source_ingred ingredient_wrap">
                ${
                  ingredData.some((data) => data.IRDNT_TY_NM === "양념")
                    ? '<h2 class="title_txt">양념</h2>'
                    : ""
                }
                <dl></dl>
            </div>
        </section>
        <section class="process detail_section">
            <h2 class="title_txt">조리 과정</h2>
            <ul class="process_lists">
                ${recipeData
                  .map(
                    (process) => `
                    <li>
                        <span>${process.COOKING_NO}.</span> 
                        <span>${process.COOKING_DC}</span>
                    </li>
                `
                  )
                  .join("")}
            </ul>
        </section>
    `;
};

const ingredHtmlRender = (data, type) => {
  let wrap;

  // 주재료, 부재료, 양념 데이터가 존재할 때 dl 안에 dt 추가
  if (type === "main") {
    wrap = document.querySelector(".main_ingred dl");
  } else if (type === "sub") {
    wrap = document.querySelector(".sub_ingred dl");
  } else {
    wrap = document.querySelector(".source_ingred dl");
  }

  wrap.innerHTML += `<dt>${data.IRDNT_NM} ${data.IRDNT_CPCTY}</dt>`;
};

const handleClickBookmark = (id, data, bookmarkSvg) => {
  // 클릭된 api 데이터의 레시피 id 값과 클릭한 리스트의 레시피 아이디 값이 같은 데이터 필터
  const filteredItem = data.filter((item) => item.RECIPE_ID == id);

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

  if (!bool) {
    clickRemoveBookmark(id, bookmarkSvg);
  } else {
    clickAddBookmark(id, usingData, bookmarkSvg);
  }

  // 논리값 반전 -> 토글 목적
  bool = !bool;
};

const clickRemoveBookmark = (id, bookmarkSvg) => {
  // 북마크 아이콘 클릭시 북마크 리스트에서 제거
  localStorage.removeItem(`bookmark-${id}`);
  bookmarkSvg.children[0].setAttribute("fill", "#e1e1e1");
};

const clickAddBookmark = (id, usingData, bookmarkSvg) => {
  bookmarkSvg.children[0].setAttribute("fill", "#58B93F");
  // 추가
  localStorage.getItem(`bookmark-${id}`);
  // 업데이트
  localStorage.setItem(`bookmark-${id}`, JSON.stringify(usingData));
};
