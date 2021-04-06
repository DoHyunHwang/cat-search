import { setItem } from '../util/sessionStorage.js';

export default class SearchBar {
  constructor({ $target, keywords, onSearch, onRandom }) {
    this.recent = keywords;
    this.onSearch = onSearch;
    this.onRandom = onRandom;
    this.section = document.createElement('section');
    this.section.className = 'searching-section';

    $target.appendChild(this.section);

    this.render();

    this.focusOnSearchBox();
  }

  focusOnSearchBox() {
    const searchBox = document.querySelector('.search-box');
    searchBox.focus();
  }

  addRecentKeyword(keyword) {
    // 최근 검색어에 같은 키워드가 있으면 리턴
    if (this.recent.includes(keyword)) return;
    // 저장된 최근 검색어 5개 이상이면 오래된 순으로 앞에서부터 제거
    if (this.recent.length === 5) this.recent.shift();

    this.recent.push(keyword);
    setItem('keywords', this.recent);

    this.render();
  }

  searchByKeyword(keyword) {
    if (keyword.length === 0) return;

    this.addRecentKeyword(keyword);
    this.onSearch(keyword);
  }

  deleteKeyword() {
    const searchBox = document.querySelector('.search-box');
    searchBox.value = '';
  }

  render() {
    this.section.innerHTML = '';

    const randomBtn = document.createElement('span');
    randomBtn.className = 'random-btn';
    randomBtn.innerText = '🐱';
    randomBtn.title = '클릭시 랜덤으로 고양이가 나타납니다.';

    const wrapper = document.createElement('div');
    wrapper.className = 'search-box-wrapper';

    const searchBox = document.createElement('input');
    searchBox.className = 'search-box';
    searchBox.placeholder = '고양이를 검색하세요.';

    const recentKeywords = document.createElement('div');
    recentKeywords.className = 'recent-keywords';

    this.recent.map((keyword) => {
      const link = document.createElement('span');
      link.className = 'keyword';
      link.innerText = keyword;

      link.addEventListener('click', () => {
        this.searchByKeyword(keyword);
      });
      recentKeywords.appendChild(link);
    });

    randomBtn.addEventListener('click', this.onRandom);
    searchBox.addEventListener('focus', this.deleteKeyword);
    searchBox.addEventListener('keypress', (event) => {
      if (event.key == 'Enter') {
        this.searchByKeyword(searchBox.value);
      }
    });

    wrapper.appendChild(searchBox);
    wrapper.appendChild(recentKeywords);
    this.section.appendChild(randomBtn);
    this.section.appendChild(wrapper);
  }
}
