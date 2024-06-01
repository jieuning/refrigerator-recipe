import { PublicTabBar } from "../public/js/tabBar.js";
import { WarningModal } from "../public/js/modal.js";

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
const allRemoveBtn = document.querySelector(".all_remove_btn");
const costomizedBtn = document.querySelector(".costomized_btn");

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
let message;

const clickSubmitBtn = () => {
  const ingredValue = ingredInput.value;
  const expirValue = expirInput.value;

  if (ingredValue.trim("") !== "" && expirValue.trim("") !== "") {
    // 버튼 클릭시 초기화
    mainSection.innerHTML = "";

    // 중복된 재료가 있는지 확인
    const ingredInclude = getIngred.some(
      (ingred) => ingred.ingredient == ingredValue
    );

    // 디데이
    let expirDate = new Date(expirInput.value);
    const dDay = expirDday(expirDate);
    console.log(dDay);

    // 데이터 로컬에 저장
    getIngred.push({
      ingredient: ingredInput.value,
      dday: dDay,
    });

    // 전체삭제 활성화
    if (getIngred.length !== 0) {
      allRemoveBtn.classList.add("on");
      costomizedBtn.classList.add("on");
    }

    if (dDay > -1) {
      message = "이미 지난 일자와 오늘 일자는 선택할 수 없습니다.";
      WarningModal(message);

      // 조건에 걸리는 마지막 데이터 제외하고 렌더링
      initRender();
      return;
    }

    if (ingredInclude) {
      message = "이미 추가된 재료입니다.";
      WarningModal(message);

      initRender();
      return;
    }

    if (!ingredInclude || dDay < 0) {
      // 재료 추가시 렌더링
      renderHtml();

      // 로컬 업데이트
      localStorage.setItem("ingredient", JSON.stringify(getIngred));
    }
  } else {
    message = "냉장고 재료 및 날짜를 모두 입력해주세요.";
    WarningModal(message);
  }
};
submitBtn.addEventListener("click", () => clickSubmitBtn());

const ingredHtml = (ingred) => {
  return `
      <div class="ingredient">
          <div class="ingred_wrap">
              <span class="d_day">D${ingred.dday}</span>
              <span class="name">${ingred.ingredient}</span>
              <span class="delete_btn"></span>
          </div>
      </div>`;
};

const expirDday = (expirDate) => {
  // 디데이 계산
  let diff = today.getTime() - expirDate.getTime();
  diff = Math.ceil(diff / 1000 / 60 / 60 / 24) - 1;

  console.log(diff);

  return diff;
};

const removeEvent = () => {
  const deleteBtn = document.querySelectorAll(".delete_btn");

  deleteBtn.forEach((_, i) => {
    const ingredWrap = deleteBtn[i].closest(".ingred_wrap");
    const nameTxt = ingredWrap.children[1].innerText;
    deleteBtn[i].addEventListener("click", () => clickDeleteIngred(nameTxt));
  });
};

const clickDeleteIngred = (name) => {
  // 로컬 데이터의 인덱스와 다른 것만 가져와서 삭제 하면됨
  getIngred = getIngred.filter((ingred) => ingred.ingredient !== name);
  localStorage.setItem("ingredient", JSON.stringify(getIngred));

  // 전체삭제 비활성화
  if (getIngred.length === 0) {
    allRemoveBtn.classList.remove("on");
    costomizedBtn.classList.remove("on");
  }

  // 이전 렌더링 초기화 후 삭제된 데이터로 다시 렌더링
  mainSection.innerHTML = "";
  renderHtml();
};

const renderHtml = () => {
  if (getIngred.length !== 0) {
    getIngred.forEach((ingredData) => {
      mainSection.innerHTML += ingredHtml(ingredData);
    });
    ingredInput.value = "";

    if (getIngred.length > 10) {
      message = "총 10개까지만 추가가 가능합니다.";
      WarningModal(message);
    }
  } else {
    mainSection.innerHTML = emptyHtml();
  }

  // 삭제 버튼 클릭시 이벤트
  removeEvent();
};

const initRender = () => {
  // 마지막에 추가된 데이터 삭제
  getIngred.splice(-1, 1);
  localStorage.setItem("ingredient", JSON.stringify(getIngred));

  // 데이터 반영
  mainSection.innerHTML = "";
  getIngred.forEach((ingredData) => {
    mainSection.innerHTML += ingredHtml(ingredData);
  });
};

// 초기값 렌더링
renderHtml();

if (getIngred.length !== 0) {
  allRemoveBtn.classList.add("on");
  costomizedBtn.classList.add("on");
} else {
  allRemoveBtn.classList.remove("on");
  costomizedBtn.classList.remove("on");
}

// 모든 재료 일괄 삭제
allRemoveBtn.addEventListener("click", () => {
  if (getIngred.length !== 0) {
    localStorage.removeItem("ingredient");
    mainSection.innerHTML = emptyHtml();
  }
});

const closeModal = () => {
  addModal.classList.remove("on");
};
