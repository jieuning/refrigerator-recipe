import { PublicTabBar } from "../public/js/tabBar.js";

// 공용 탭바 렌더링
const tabBarRender = () => {
  const container = document.querySelector("#container");
  return PublicTabBar(container);
};
tabBarRender();

const detailFetchData = async () => {
  // 현재 페이지의 쿼리 파라미터 값 가져오기
  const pageUrl = new URL(window.location.href.replace(/#/g, ""));
  const pageParams = new URLSearchParams(pageUrl.search).get("id");

  const API_KEY =
    "66c340d78ebbaf115f7216a55a2b2de11e2a215b696439ef449586096f885f49";
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

    console.log(basicData[0], recipeData, ingredData);
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
  } catch (error) {
    console.log(error.message);
  }
};
detailFetchData();

const detailContainer = document.querySelector(".detail_contaienr");
const baseHtmlRender = (basicData, ingredData, recipeData) => {
  detailContainer.innerHTML = `
        <section class="detail_img">
            <nav class="prev_nav">
                <div class="prev_btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2.5rem" height="2.5rem" viewBox="0 0 24 24">
                        <path fill="#1e1e1e"
                            d="M12.727 3.687a1 1 0 1 0-1.454-1.374l-8.5 9a1 1 0 0 0 0 1.374l8.5 9.001a1 1 0 1 0 1.454-1.373L4.875 12z" />
                    </svg>
                </div>
            </nav>
            <img src="../../image/fake_img.png" />
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
                <div class="bookmark">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2.5rem" height="2.5rem" viewBox="0 0 384 512">
                        <path fill="#e1e1e1"
                            d="M0 48v439.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400l153.7 107.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48" />
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
            <h2 class="title_txt">과정</h2>
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

  if (type === "main") {
    wrap = document.querySelector(".main_ingred dl");
  } else if (type === "sub") {
    wrap = document.querySelector(".sub_ingred dl");
  } else {
    wrap = document.querySelector(".source_ingred dl");
  }

  wrap.innerHTML += `<dt>${data.IRDNT_NM} ${data.IRDNT_CPCTY}</dt>`;
};
