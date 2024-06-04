export const PublicTabBar = (container) => {
  const createNavElement = document.createElement("nav");
  createNavElement.className = "tab_bar";

  createNavElement.innerHTML = `
        <div class="tab_bar_wrap">
            <div class="tab">
                <a href="http://127.0.0.1:5500/views/main/index.html#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.6rem" height="1.6rem" viewBox="0 0 24 24">
                        <path fill="#e1e1e1" stroke-linecap="round" stroke-linejoin="round"
                            d="M20 19v-8.5a1 1 0 0 0-.4-.8l-7-5.25a1 1 0 0 0-1.2 0l-7 5.25a1 1 0 0 0-.4.8V19a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1" />
                    </svg>
                    <h1 class="tab_title">홈</h1>
                </a>
            </div>
            <div class="tab">
                <a href="http://127.0.0.1:5500/views/recipe/index.html#">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 512 512">
                    <path fill="#e1e1e1" d="M256 38.013c-22.458 0-66.472 110.3-84.64 123.502c-18.17 13.2-136.674 20.975-143.614 42.334c-6.94 21.358 84.362 97.303 91.302 118.662s-22.286 136.465-4.116 149.665S233.542 422.012 256 422.012s122.9 63.365 141.068 50.164c18.17-13.2-11.056-128.306-4.116-149.665c6.94-21.36 98.242-97.304 91.302-118.663c-6.94-21.36-125.444-29.134-143.613-42.335c-18.168-13.2-62.182-123.502-84.64-123.502z"/>
                </svg>
                    <h1 class="tab_title">레시피</h1>
                </a>
            </div>
            <div class="tab">
                <a href="http://127.0.0.1:5500/views/bookmark/index.html#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24">
                        <path fill="#e1e1e1" stroke-linecap="round" stroke-linejoin="round" d="M17 3H7a2 2 0 0 0-2 2v16l7-3l7 3V5a2 2 0 0 0-2-2" />
                    </svg>
                    <h1 class="tab_title">북마크</h1>
                </a>
            </div>
        </div>
    `;

  container.append(createNavElement);

  // 탭 활성화
  const hex = "#e1e1e1";
  const activeHex = "#58b93f";
  const tabs = document.querySelectorAll(".tab a");
  let tabPath = tabs[0].children[0].children[0];
  tabPath.setAttribute("fill", activeHex);

  tabs.forEach((tab) => {
    console.log(tab);
    tab.addEventListener("click", (e) => handleTabClick(e, tab));
  });

  const handleTabClick = (event, tab) => {
    event.preventDefault();
    const target = tab;

    console.log(tabPath);
    tabPath.setAttribute("fill", hex);

    tabPath = target.children[0].children[0];
    tabPath.setAttribute("fill", activeHex);

    const url = target.getAttribute("href");
    // location.href = `${url}`;

    setTimeout(() => {
      location.href = `${url}`;
    }, 100); // 짧은 지연 시간 추가
  };
};
