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
const API_KEY =
  "66c340d78ebbaf115f7216a55a2b2de11e2a215b696439ef449586096f885f49";
const fetchIngredData = async (ingredients) => {
  const ingredRes = await fetch(
    `http://211.237.50.150:7080/openapi/${API_KEY}/json/Grid_20150827000000000227_1?IRDNT_NM=${ingredients}`
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

const fetchBaseData = async (id) => {
  const baseRes = await fetch(
    `http://211.237.50.150:7080/openapi/${API_KEY}/json/Grid_20150827000000000226_1?RECIPE_ID=${id}`
  );
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
    let ingredients = [];
    const getIngred = JSON.parse(localStorage.getItem("ingredient"));

    getIngred.forEach((ingred) => {
      ingredients.push(ingred.ingredient);
    });

    const result = await fetchIngredAllData(ingredients);

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

      const baseData = await fetchBaseAllData(recipeId);
      console.log(baseData);
    }
  } catch (error) {
    console.log(error.message);
  }
};
getRecipeData();
