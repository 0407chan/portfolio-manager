# 공통 Sub Project
- 외부 API 연동을 통한 기능 추가

# 개발자
- 지상현 (Project Master, JISSSH)
- 이찬호 (CHRIS)
- 이형원 (ZETTANK)
- 이종연 (STUPID)

# Git feature branches 명령어 순서
- git flow feature start new_feature_name
  - "new_feature_name" 의 이름을 가진 feature branches 를 생성
- 작업
- git add .
- git commit -m commit_message
  - "commit_message" 의 메시지를 가진 commit
- git push origin feature/new_feature_name
- git flow feature finish new_feature_name
  - new_feature_name branche 작업 종료 => develop branche로 돌아감
- git pull
- git push origin develop

# vue.js 라이브러리

## npm 기본 설정
```
npm install
npm install -g yarn
npm install -g @vue/cli
npm install vue
npm install -g firebase-tools
npm run serve
```

## Req. 2-1 사진 첨부 기능 구현, Carousel
- install
```
npm install @chenfengyuan/vue-carousel vue vue-template-compiler
```
- use
```
import VueCarousel from '@chenfengyuan/vue-carousel';
Vue.use(VueCarousel);
```

## Req. 2-1 사진 첨부 기능 구현, Hooper
- install
```
npm install hooper
```

## Req. 2-4 회원가입 기능 구현, vue-js-modal
- install
```
npm install vue-js-modal
```
- use
```
import VModal from 'vue-js-modal';
Vue.use(VModal);
```

## Req. 2-9 웹 UI/UX 변경, Vue.js 에서 scss 사용하기
- install
```
npm install sass-loader node-sass --save-dev
```

- settings
    - webpack.base.conf.js 파일의 설정 변경 module rules에 sass케이스 추가
```
{
    test: /.s[a|c]ss$/,
    loader: 'style!css!sass'
}
```

- use
    - style에 lang="scss"를 추가
```
<style lang="scss" scoped>
</style>
```

## Req. 2-9 웹 UI/UX 변경, 마크다운 뷰어, vue-markdown
```
npm install --save vue-markdown
```

## Req. 2-9 웹 UI/UX ㅂ녀경,  alert창 디자인용, sweetalert
```
npm install --save sweetalert
```