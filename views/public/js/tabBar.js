export const PublicTabBar = (container) => {
  const createNavElement = document.createElement("nav");
  createNavElement.className = "tab_bar";

  createNavElement.innerHTML = `
        <div class="tab_bar_wrap">
            <div class="tab">
                <a href="http://127.0.0.1:5500/views/main/index.html#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24">
                        <path fill="#e1e1e1" stroke="#e1e1e1" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2"
                            d="M20 19v-8.5a1 1 0 0 0-.4-.8l-7-5.25a1 1 0 0 0-1.2 0l-7 5.25a1 1 0 0 0-.4.8V19a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1" />
                    </svg>
                    <h1 class="tab_title">홈</h1>
                </a>
            </div>
            <div class="tab">
                <a href="http://127.0.0.1:5500/views/recipe/index.html#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24">
                        <g fill="none">
                            <path
                                d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                            <path fill="#e1e1e1"
                                d="M10.92 2.868a1.25 1.25 0 0 1 2.16 0l2.795 4.798l5.428 1.176a1.25 1.25 0 0 1 .667 2.054l-3.7 4.141l.56 5.525a1.25 1.25 0 0 1-1.748 1.27L12 19.592l-5.082 2.24a1.25 1.25 0 0 1-1.748-1.27l.56-5.525l-3.7-4.14a1.25 1.25 0 0 1 .667-2.055l5.428-1.176z" />
                        </g>
                    </svg>
                    <h1 class="tab_title">레시피</h1>
                </a>
            </div>
            <div class="tab">
                <a href="http://127.0.0.1:5500/views/bookmark/index.html#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24">
                        <path fill="#e1e1e1" d="M17 3H7a2 2 0 0 0-2 2v16l7-3l7 3V5a2 2 0 0 0-2-2" />
                    </svg>
                    <h1 class="tab_title">북마크</h1>
                </a>
            </div>
        </div>
    `;

  container.append(createNavElement);
};
