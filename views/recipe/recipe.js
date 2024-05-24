import { PublicTabBar } from "../public/js/tabBar.js";

// 공용 탭바 렌더링
const tabBarRender = () => {
    return PublicTabBar();
};
tabBarRender();

const levelArr = ['초보환영', '보통', '어려움'];
const itemFilters = document.querySelectorAll(".recipe_filter span");
let currentTarget = itemFilters[0];

const fetchData = async () => {
    const API_KEY = '66c340d78ebbaf115f7216a55a2b2de11e2a215b696439ef449586096f885f49';
    const url = new URL(`http://211.237.50.150:7080/openapi/${API_KEY}/json/Grid_20150827000000000226_1/1/10`);

    try{
        const res = await fetch(url);
        if(!res.ok) {
            throw new Error(`에러 발생: ${res.status}`);
        }

        const result = await res.json();
        const data = result.Grid_20150827000000000226_1.row;
        console.log(data);

        // 낮은 난이도 순으로 정렬 초기값
        currentTarget.classList.add("on");
        const lowLevel = data.sort((a, b) => {
            return levelArr.indexOf(a.LEVEL_NM) - levelArr.indexOf(b.LEVEL_NM);
        });
        
        itemFilters.forEach(filterBtn => {
            filterBtn.addEventListener("click", (e) => handleClickFilter(e, data));
        })

        recipeListRender(lowLevel);
    }catch(error) {
        console.log(error.message);
    }
};
fetchData();

const recipeCardHtml = (data) => {
    return `
        <li class="item_list">
            <div class="img_wrap">
                <a href=${`http://127.0.0.1:5500/views/detail/index.html#?id=${data.RECIPE_ID}`}>
                    <img src="/image/fake_img.png"/>
                </a>
            </div>                
            <article class="item_contents">
                <div class="title_wrap">
                    <h2 class="item_title">${data.RECIPE_NM_KO}</h2>
                    <p class="item_Summary">${data.SUMRY}</p>
                </div>
                <div class="item_tags">
                    <span class="level">${data.LEVEL_NM}</span>
                    <span class="cooking_time">${data.COOKING_TIME}</span>
                    <span class="bookmark"></span>
                </div>
            </article>
        </li>
    `
};

const recipeLists = document.querySelector(".recipe_lists");

const recipeListRender = (sortedData, target = currentTarget) => {
    recipeLists.innerHTML = '';

    currentTarget.classList.remove("on");
    target.classList.add("on");
    currentTarget = target;

    sortedData.forEach(data => {
        recipeLists.innerHTML += recipeCardHtml(data);
    });
};

const handleClickFilter = (event, data) => {
    let target = event.target;
    let sortedData = returnSortedData(data, target);

    // 필터링된 데이터로 재렌더링
    recipeListRender(sortedData, target);
};

const returnSortedData = (data, target) => {
    const targetValue = target.innerText;

    if(targetValue === "낮은 난이도") {
        const lowLevel = data.sort((a, b) => {
            return levelArr.indexOf(a.LEVEL_NM) - levelArr.indexOf(b.LEVEL_NM);
        });
        return lowLevel;
    } else if(targetValue === "높은 난이도") {
        const highLevel = data.sort((a, b) => {
            return levelArr.indexOf(b.LEVEL_NM) - levelArr.indexOf(a.LEVEL_NM);
        });
        return highLevel;
    } else if(targetValue === "짧은 조리시간") {
        const lowTime = data.sort((a, b) => {
            return Number(a.COOKING_TIME.slice(0, -1)) - Number(b.COOKING_TIME.slice(0, -1));
        });
        return lowTime;
    } else {
        const highTime = data.sort((a, b) => {
            return Number(b.COOKING_TIME.slice(0, -1)) - Number(a.COOKING_TIME.slice(0, -1));
        });
        return highTime;
    }
};



