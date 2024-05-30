export const WarningModal = (message) => {
  const createDivElement = document.createElement("div");
  createDivElement.className = "warning_modal";
  createDivElement.innerHTML = `
        <h1 class="message">${message}</h1>
        <button class="ok_btn">확인</button>
    `;
  document.body.prepend(createDivElement);

  const okBtn = document.querySelector(".ok_btn");
  okBtn.addEventListener("click", () => clickBtn(createDivElement));
};

const clickBtn = (createDivElement) => {
  createDivElement.remove();
};

export const SelectModal = () => {
  return `
        <div class="select_modal">
            <h1 class="message"></h1>
            <div class="btn_wrap">
                <button class="cancle_btn"></button>
                <button class="ok_btn"></button>
            </div>
        </div>
    `;
};
