import { PublicTabBar } from "../public/js/tabBar.js";

// 공용 탭바 렌더링
const tabBarRender = () => {
  const container = document.querySelector("#container");
  return PublicTabBar(container);
};
tabBarRender();

// 추가한 재료가 포함된 레피시를 Id를 통해 불러온다.
// 그럼 id는 어떻게 얻지? -> 레시피 재료 정보에서 해당 재료가 있으면 Id를 불러온다. -> id를 가지고 레시피 기본 정보를 불러온다.
// fetch를 총 두 번? 1. 레시피 재료 정보 fetch -> 2. 레시피 기본 정보 fetch
const fetchData = async (ingredients) => {
  const API_KEY =
    "66c340d78ebbaf115f7216a55a2b2de11e2a215b696439ef449586096f885f49";
  const ingredRes = await fetch(
    `http://211.237.50.150:7080/openapi/${API_KEY}/json/Grid_20150827000000000227_1?IRDNT_NM=${ingredients}`
  );
  if (!ingredRes.ok) {
    throw new Error(response.statusText);
  }
  const result = ingredRes.json();
  return result;

  //   const basicUrl = new URL(
  //     `http://211.237.50.150:7080/openapi/${API_KEY}/json/Grid_20150827000000000226_1?RECIPE_ID=${pageParams}`
  //   );
  // const result = await ingredRes.json();
  // const basicRes = await fetch(basicUrl)

  // 병렬처리, json 파싱
  // const allRes = await Promise.all([basicRes, ingredRes]);
  // const [basicResult, recipeResult, ingredResult] = await Promise.all(
  //   allRes.map((res) => res.json())
  // );

  // 사용할 데이터
  // const basicData = basicResult.Grid_20150827000000000226_1.row;
  // const recipeData = recipeResult.Grid_20150827000000000228_1.row;
  // const ingredData = ingredResult.Grid_20150827000000000227_1.row;
  // console.log(basicData);
};

const fetchAllData = async (ingredients) => {
  const promises = ingredients.map((ingredient) => fetchData(ingredient));
  return Promise.all(promises);
};

const getIngredData = async () => {
  try {
    let ingredients = [];
    const getIngred = JSON.parse(localStorage.getItem("ingredient"));

    getIngred.forEach((ingred) => {
      ingredients.push(ingred.ingredient);
    });

    const result = await fetchAllData(ingredients);

    if (result !== undefined) {
      let recipeId = new Set();

      result.forEach((data) => {
        const rows = data.Grid_20150827000000000227_1.row;
        if (rows.length !== 0) {
          rows.forEach((id) => {
            // 중복되는 id가 있다면 제거하고 저장
            recipeId.add(id.RECIPE_ID);
          });
        }
      });
      recipeId = Array.from(recipeId);

      console.log(recipeId);
    }
  } catch (error) {
    console.log(error.message);
  }
};
getIngredData();
