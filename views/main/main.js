import { PublicTabBar } from "../public/js/tabBar.js";

// 공용 탭바 렌더링
const tabBarRender = () => {
  const container = document.querySelector("#container");
  return PublicTabBar(container);
};
tabBarRender();

let getIngred = JSON.parse(localStorage.getItem("ingredient")) || [];

// const fetchData = async () => {
//   // 현재 페이지의 쿼리 파라미터 값 가져오기
//   const pageUrl = new URL(window.location.href.replace(/#/g, ""));
//   const pageParams = new URLSearchParams(pageUrl.search).get("id");

//   const API_KEY =
//     "66c340d78ebbaf115f7216a55a2b2de11e2a215b696439ef449586096f885f49";
//   const basicUrl = new URL(
//     `http://211.237.50.150:7080/openapi/${API_KEY}/json/Grid_20150827000000000226_1?RECIPE_ID=${pageParams}`
//   );
//   const recipeUrl = new URL(
//     `http://211.237.50.150:7080/openapi/${API_KEY}/json/Grid_20150827000000000228_1?RECIPE_ID=${pageParams}`
//   );
//   const ingredUrl = new URL(
//     `http://211.237.50.150:7080/openapi/${API_KEY}/json/Grid_20150827000000000227_1?RECIPE_ID=${pageParams}`
//   );

//   try {
//     const basicRes = fetch(basicUrl);
//     const recipeRes = fetch(recipeUrl);
//     const ingredRes = fetch(ingredUrl);

//     // 병렬처리, json 파싱
//     const allRes = await Promise.all([basicRes, recipeRes, ingredRes]);
//     const [basicResult, recipeResult, ingredResult] = await Promise.all(
//       allRes.map((res) => res.json())
//     );

//     // 사용할 데이터
//     const basicData = basicResult.Grid_20150827000000000226_1.row;
//     const recipeData = recipeResult.Grid_20150827000000000228_1.row;
//     const ingredData = ingredResult.Grid_20150827000000000227_1.row;
//     console.log(basicData);
//   } catch (error) {
//     console.log(error.message);
//   }
// };
// fetchData();
const mainSection = document.querySelector(".main");
const emptyHtml = () => {
  return `
          <div class="empty_wrap">
            <img
              class="empty_icon"
              src="../../image/ refrigerator_icon.png"
              alt="냉장고 아이콘"
            />
            <span class="empty_title">
              냉장고에 있는 재료를 추가하시면
              <br /> 맞춤 레시피를 추천해드려요.
            </span>
          </div>`;
};

// 로컬 데이터가 없을 때 보여줄 화면
if (getIngred.length === 0) {
  mainSection.innerHTML = emptyHtml();
}

const openModalBtn = document.querySelector(".open_modal_btn");
const addModal = document.querySelector(".add_modal");
const shadow = document.querySelector(".shadow");

const activeModal = () => {
  addModal.classList.add("on");
  shadow.classList.add("on");
};
openModalBtn.addEventListener("click", () => activeModal());

const submitBtn = document.querySelector(".submit_btn");
const ingredInput = document.querySelector("#ingred_txt");
const expirInput = document.querySelector("#expiration_date");
let today = new Date();

const clickAddIngred = () => {
  // 버튼 클릭시 초기화
  mainSection.innerHTML = "";
  // 디데이
  let expirDate = new Date(expirInput.value);
  const dDay = expirDday(expirDate);
  // 데이터 로컬에 저장
  getIngred.push({
    ingredient: ingredInput.value,
    dday: dDay,
  });

  // 렌더링
  renderHtml();

  // 로컬 업데이트
  localStorage.setItem("ingredient", JSON.stringify(getIngred));
};
submitBtn.addEventListener("click", () => clickAddIngred());

const ingredHtml = (ingred) => {
  return `
      <div class="ingredient">
          <div class="ingred_name">
              <span class="d_day">D${ingred.dday}</span>
              ${ingred.ingredient}
              <span class="delete_btn"></span>
          </div>
      </div>`;
};

const renderHtml = () => {
  console.log(getIngred);
  if (getIngred.length !== 0) {
    getIngred.forEach((ingredData) => {
      mainSection.innerHTML += ingredHtml(ingredData);
    });
    ingredInput.value = "";
  } else {
    mainSection.innerHTML = emptyHtml();
  }
};
renderHtml();

const expirDday = (expirDate) => {
  // 디데이 계산
  let diff = today.getTime() - expirDate.getTime();
  diff = Math.ceil(diff / 1000 / 60 / 60 / 24);
  return diff;
};

const deleteBtn = document.querySelectorAll(".delete_btn");
const clickDeleteIngred = (index) => {
  console.log(index);
  // 로컬 데이터의 인덱스와 같으면 삭제 하면됨
};
deleteBtn.forEach((_, i) => {
  deleteBtn[i].addEventListener("click", () => clickDeleteIngred(i));
});

const closeModal = () => {
  addModal.classList.remove("on");
};
