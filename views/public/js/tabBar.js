export const PublicTabBar = (container) => {
  const createNavElement = document.createElement("nav");
  createNavElement.className = "tab_bar";

  createNavElement.innerHTML = `
        <div class="tab_bar_wrap">
            <div class="tab">
                <a href="http://127.0.0.1:5500/views/main/index.html#?pageId=0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.6rem" height="1.6rem" viewBox="0 0 24 24">
                        <path fill="#e1e1e1" stroke-linecap="round" stroke-linejoin="round"
                            d="M20 19v-8.5a1 1 0 0 0-.4-.8l-7-5.25a1 1 0 0 0-1.2 0l-7 5.25a1 1 0 0 0-.4.8V19a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1" />
                    </svg>
                    <h1 class="tab_title">홈</h1>
                </a>
            </div>
            <div class="tab">
                <a href="http://127.0.0.1:5500/views/recipe/index.html#?pageId=1">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 512 512">
                    <path fill="#e1e1e1" d="M256 38.013c-22.458 0-66.472 110.3-84.64 123.502c-18.17 13.2-136.674 20.975-143.614 42.334c-6.94 21.358 84.362 97.303 91.302 118.662s-22.286 136.465-4.116 149.665S233.542 422.012 256 422.012s122.9 63.365 141.068 50.164c18.17-13.2-11.056-128.306-4.116-149.665c6.94-21.36 98.242-97.304 91.302-118.663c-6.94-21.36-125.444-29.134-143.613-42.335c-18.168-13.2-62.182-123.502-84.64-123.502z"/>
                </svg>
                    <h1 class="tab_title">레시피</h1>
                </a>
            </div>
            <div class="tab">
                <a href="http://127.0.0.1:5500/views/bookmark/index.html#?pageId=2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24">
                        <path fill="#e1e1e1" stroke-linecap="round" stroke-linejoin="round" d="M17 3H7a2 2 0 0 0-2 2v16l7-3l7 3V5a2 2 0 0 0-2-2" />
                    </svg>
                    <h1 class="tab_title">북마크</h1>
                </a>
            </div>
        </div>
    `;

  container.append(createNavElement);

  const tabs = document.querySelectorAll(".tab a");
  const activeHex = "#58b93f";
  // 페이지마다 Id값을 준다.
  // 페이지에 해당하는 탭을 클릭했을 때 로컬 스토리지에 id 값을 저장한다.
  // 클릭할 때마다 해당 id 값으로 바뀌도록 한다.
  // 과연 유지가 될까?
  const handleTabClick = (tab) => {
    const tabAttr = new URL(tab.getAttribute("href").replace(/#/g, ""));
    const params = new URLSearchParams(tabAttr.search).get("pageId");
    localStorage.setItem("pageId", params);
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => handleTabClick(tab));
  });

  const getPageId = localStorage.getItem("pageId");
  const target = tabs[getPageId].children[0].children[0];
  target.setAttribute("fill", activeHex);
};
