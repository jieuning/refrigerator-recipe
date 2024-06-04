export const skeletonCard = () => {
  return `
    <li class="item_list">
        <div class="img_wrap"></div>                
        <article class="item_contents">
            <div class="title_wrap">
                <h2 class="item_title"></h2>
                <p class="item_Summary"></p>
            </div>
            <div class="item_tags">
                <span class="level"></span>
                <span class="cooking_time"></span>
                <span class="bookmark"></span>
            </div>
        </article>
    </li>
    `;
};
