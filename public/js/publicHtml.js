export const SkeletonCard = () => {
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

export const ItemCardHtml = (data) => {
  return `
              <li class="item_list">
                  <div class="img_wrap">
                      <a href=${`http://127.0.0.1:5500/../../views/detail/index.html#?id=${data.RECIPE_ID}`}>
                        <span class="background_img" 
                            style="background-image: url('../../image/recipe_${
                              data.RECIPE_ID <= 100 ? data.RECIPE_ID : "no"
                            }.jpeg'); 
                            background-size: contain; 
                            background-position: center;
                            background-repeat: no-repeat;
                            transform: scale(1.5);
                            "
                        ></span>
                      </a>
                  </div>
                  <article class="item_contents">
                      <div class="title_wrap">
                          <h2 class="item_title">${data.RECIPE_NM_KO}</h2>
                          <p class="item_Summary">${data.SUMRY}</p>
                      </div>
                      <div class="item_tags">
                          <span class="level">${data.LEVEL_NM}</span>
                          <span class="cooking_time">약 ${
                            data.COOKING_TIME
                          }</span>
                          <span class="bookmark" data-id=${
                            data.RECIPE_ID
                          }></span>
                      </div>
                  </article>
              </li>
          `;
};
