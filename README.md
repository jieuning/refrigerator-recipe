# refrigerator recipe

## 목차
2. 개요
3. 기능
4. 기술스택
5. 사용법

## 개요

### 목표
냉장고에 있는 재료를 활용할 수 있도록 해당 레시피를 추천하고 스크랩할 수 있는 서비스를 제공하는 것을 목표로 합니다.

### 주요 장점
최대 10개의 재료를 입력할 수 있으며 입력한 재료가 포함된 레시피를 추천하여 냉장고에 남아 있는 재료에 대한 고민을 해결해 줍니다.

## 기능

### 맞품 레시피 추천
- 최대 10개까지 재료를 추가할 수 있습니다.
- 추가한 재료에 대한 디데이를 확인할 수 있습니다.
- 로딩시 데이터를 불러오는 동안 스켈레톤 로딩 화면을 보여줍니다.

![맞춤](https://github.com/jieuning/refrigerator-recipe/assets/108172664/aab48f68-43b5-48ba-aeac-310765f74f2d)

<br/>

### 레시피 무한스크롤
- Intersection Observer API를 이용한 무한스크롤을 구현하여 별도의 클릭 없이 스크롤만으로 데이터를 불러올 수 있도록 하였습니다.

![무한스크롤2](https://github.com/jieuning/refrigerator-recipe/assets/108172664/daed8642-e56f-43d2-a5dc-6e71ab3f7a31)

<br/>

### 레시피 필터
- 난이도, 조리 시간 기준으로 레시피 필터를 적용하여 사용자가 보다 빠르게 원하는 조건의 레시피를 찾을 수 있도록 하였습니다.

![필터](https://github.com/jieuning/refrigerator-recipe/assets/108172664/938a6a49-6058-4afc-85bd-72bd0816026d)

<br/>

### 북마크
- LocalStorage를 이용하여 원하는 레시피를 북마크 할 수 있도록 하였습니다.
- 레시피 페이지 뿐만 아니라 디테일 페이지에서도 북마크를 추가 제거 할 수 있도록 하였습니다.
- 저장된 북마크는 북마크 페이지에서 모아서 확인할 수 있습니다.

![북마크2](https://github.com/jieuning/refrigerator-recipe/assets/108172664/6c745d3b-6d34-4ff9-b1fb-f147f754fa2a)

## 기술 스택

- Javascript
- HTML
- CSS

## 사용법
#### 사이트 주소
```
http://refrirecipe.dothome.co.kr/index.html#?pageId=0
```
