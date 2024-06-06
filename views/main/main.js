import { PublicTabBar } from "../public/js/tabBar.js";
import { WarningModal } from "../public/js/modal.js";

// 공용 탭바 렌더링
const tabBarRender = () => {
  const container = document.querySelector("#container");
  return PublicTabBar(container);
};
tabBarRender();

let getIngred = JSON.parse(localStorage.getItem("ingredient")) || [];

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
const modalCloseBtn = document.querySelector(".modal_close");

let startY, currentY, initHeight;

const activeModal = () => {
  addModal.classList.add("on");
  shadow.classList.add("on");
  addModal.style.height = "auto";
  initHeight = addModal.offsetHeight;
};

const closeModal = () => {
  addModal.classList.remove("on");
  shadow.classList.remove("on");
};

const handleTouchStart = (event) => {
  // event에 touches가 존재하지 않으면 드래그 막기
  if (!event.touches) {
    closeModal();
    return;
  }

  startY = event.touches ? event.touches[0].clientY : event.clientY;
  initHeight = addModal.offsetHeight;
  addModal.style.transition = "none";
};

const handleTouchMove = (event) => {
  currentY = event.touches ? event.touches[0].clientY : event.clientY;
  const distance = currentY - startY;

  // 위로 드래그 방지
  if (distance < 0) return;

  const newHeight = initHeight - distance;

  if (newHeight > 50 && newHeight < window.innerHeight) {
    addModal.style.height = `${newHeight}px`;
  }
};

const handleTouchEnd = () => {
  addModal.style.transition = "height 0.3s ease";

  if (addModal.offsetHeight < initHeight / 2) {
    closeModal();
  } else {
    addModal.style.height = "auto";
  }
};

openModalBtn.addEventListener("click", () => activeModal());

modalCloseBtn.addEventListener("touchstart", handleTouchStart);
modalCloseBtn.addEventListener("touchmove", handleTouchMove);
modalCloseBtn.addEventListener("touchend", handleTouchEnd);

// 모바일이 아닐 땐 클릭으로 모달 닫기
modalCloseBtn.addEventListener("click", (event) => {
  if (!event.touches) {
    closeModal();
  }
});

// 만약을 대비해 그림자 배경을 클릭해도 모달이 닫히도록 설정
shadow.addEventListener("click", closeModal);

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
      message = "이미 지난 일자는 선택할 수 없습니다.";
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
    message = "냉장고 재료 및 유통기한을 모두 입력해주세요.";
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
    getIngred = [];
    localStorage.removeItem("ingredient");
    mainSection.innerHTML = emptyHtml();

    allRemoveBtn.classList.remove("on");
    costomizedBtn.classList.remove("on");
  }
});
