# <img src="https://user-images.githubusercontent.com/68576681/177258571-64e4855d-bdca-4335-b221-e23d54708cbe.jpg" width="30" height="30"> 나의 작은 갈라파고스
> 2분반 4주차(2022.07.20~07.28) By 김태연, 남하욱, 최동원
# Table Of Contents
* [Project Summary](#project-summary)
* [Developer Information](#developer-information)
* [Development Environment](#development-environment)
* [Application Information](#application-information)
  * [0. 초기화면](#0-초기화면)
  * [1. 생명체 생성](#1-생명체-생성)
  * [2. 자연기후 변경](#2-자연기후-변경)
  * [3. 자연재해](#3-자연재해)
  * [4. 통계 보기](#4-통계-보기)
  * [5. 언젠가](#5-언젠가)
***

# <img src="https://user-images.githubusercontent.com/68576681/181484979-05f94863-46be-41c4-9ea0-baa42621c429.jpg" width="480" height="360">

# Project Summary
* 나만의 작은 생태계를 구성하는 시뮬레이션 시스템입니다.
* 원하는 생명체를 원하는 위치에 추가할 수 있습니다.
* 환경을 직접 설정할 수 있습니다.
* 자연 재해를 통해 환경을 컨트롤 할 수 있습니다.
* 그래프를 통해 현재 생태계의 여러 통계 자료를 한 눈에 확인할 수 있습니다.
***

# Developer Information
* [최동원](https://github.com/chlehdwon) (KAIST 전기및전자공학부) 
* [김태연](https://github.com/tykim5931) (DGIST 기초학부)
* [남하욱](https://github.com/NAMHAUK) (한양대 컴퓨터소프트웨어학부)
***

# Development Environment
* OS: Window
* Framework: Vanilla JS, CSS, HTML
* Design Tool: Blender
* Target Device: All device
***

# Service Information
## 0. 초기화면

<img src="https://user-images.githubusercontent.com/68576681/181484982-ecfe1377-ea88-4c47-8d4e-fa5543ebf921.jpg" width="480" height="360"> <img src="https://user-images.githubusercontent.com/68576681/181484976-7c76166c-eb6a-430b-a1ca-f8bc0a66dfab.png" width="480" height="360">
### Major Features
* 초기 섬의 상태를 rendering하여 멀리서 보여줍니다.
* 1차 생산자의 먹이인 풀이 자동으로 생성됩니다.
* 행성 생성 후 지난 날을 년과 함께 출력합니다.
* 상태바를 통해 실행/재생 및 속도 조절을 할 수 있습니다.

### Technology Used
* Three.js를 통해 섬의 모습을 rendering 해줍니다.
* 모든 object들은 blender을 통해 직접 만들어졌습니다.
* requestAnimationFrame(animate) 함수를 통해 animation을 구현하였습니다. 

## 1. 생명체 생성

<img src="https://user-images.githubusercontent.com/68576681/181484978-4ab1ca93-c978-4e0b-98a1-1371b2acc7e1.jpg" width="480" height="360">  

### Major Features
* 원하는 속성을 가진 생명체를 생성 할 수 있습니다.
* 미니맵에 원하는 생명체를 클릭하여 생성할 수 있습니다.
  
### Technology Used
* 클릭한 창의 좌표를 Grid로 변환하여 인식합니다.

## 2. 자연기후 변경

<img src="https://user-images.githubusercontent.com/68576681/181484975-d1bd7a36-15b7-4fad-a0a9-57d2601a637c.jpg" width="480" height="360">

### Major Features
* 미니맵에 원하는 속성을 가진 환경 타일을 설정할 수 있습니다.
* 환경 타일은 각각의 속성을 갖고 있어, 생명체와 상호작용 하게 됩니다.

### Technology Used
* 사진 Drag & Drop을 지원합니다.

## 3. 자연재해

<img src="https://user-images.githubusercontent.com/68576681/181488723-e0989f9e-aa17-4413-aee1-ea6971a4455b.jpg" width="480" height="360">  

### Major Features
* 번개, 유성, 빙하기, 온난화와 같은 자연재해를 일으킬 수 있습니다.
* 각 자연재해에는 효과가 있어 생명체가 영향을 받습니다.

### Technology Used
* Three.js camera와 light, 그리고 새로운 object를 사용하여 자연재해의 느낌을 구현하였습니다.

## 4. 통계 보기

<img src="https://user-images.githubusercontent.com/68576681/181484973-b024744d-55ae-4df0-860b-9fbc57c75d34.jpg" width="480" height="360"> <img src="https://user-images.githubusercontent.com/68576681/181484966-30b5b9c9-7abf-4a4f-ac71-7bb723bd8531.jpg" width="480" height="360"> <img src="https://user-images.githubusercontent.com/68576681/181484984-ffd2c241-caf8-40cc-8421-75eaabdfb736.jpg" width="480" height="360"> 

### Major Features
* 생명체의 비율, 숫자, 그리고 각 환경에서의 평균 능력치를 통계로 확인할 수 있습니다. 
* 그래프는 매 턴마다 업데이트 되어 누적됩니다.
* 일부 원하는 항목만 따로 볼 수 있습니다. 

### Technology Used
* Chart.js를 활용하여 그래프를 그렸습니다.


## 5. 언젠가
* 세부 parameter를 조정하여 더 안정적인 생태계를 만들 예정입니다. 
* 렌더링 시 생기는 몇몇 문제점들을 해결 할 예정입니다. 
* 서버와 연동하여 다른 사람의 world를 구경할 수 있도록 할 예정입니다. 
