export const SkeletonCardHtml = () => {
  return `
    <li class="item_list">
        <div class="skeleton_img_wrap">

        </div>                
        <article class="skeleton_item_contents">
            <div class="skeleton_title_wrap">
                <div class="skeleton_item_title"></div>
                <div class="skeleton_item_Summary"></div>
            </div>
            <div class="skeleton_item_tags">
                <div></div>
                <div></div>
            </div>
        </article>
    </li>
    `;
};

export const ItemCardHtml = (data) => {
  return `
              <li class="item_list">
                  <div class="img_wrap">
                      <a href=${`http://refrirecipe.dothome.co.kr/../../views/detail/index.html#?id=${data.RECIPE_ID}`}>
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
                        <span class="bookmark" data-id=${data.RECIPE_ID}></span>
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
                      </div>
                  </article>
              </li>
          `;
};
