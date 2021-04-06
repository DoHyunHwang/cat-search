import { throttling } from './throttle.js';

const throttler = throttling();

function scrollFetch(fetchData) {
  // 윈도우 전역에 스크롤 이벤트 발생시 콜백함수 실행
  window.addEventListener('scroll', () => {
    throttler.throttle(() => {
      console.log('Activate Scroll Event');
      if (getScrollTop() < getDocumentHeight() - window.innerHeight) return;
      fetchData();
    }, 700);
  });
}

// 현재 스크롤한 높이를 구하는 함수
function getScrollTop() {
  return window.pageYOffset !== undefined
    ? window.pageYOffset
    : (document.documentElement || document.body.parentNode || document.body)
        .scrollTop;
}

// 문서의 높이를 구하는 함수
function getDocumentHeight() {
  const body = document.body;
  const html = document.documentElement;

  return Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
}

export { scrollFetch };
