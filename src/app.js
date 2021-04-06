import SearchingSection from './components/SearchingSection.js';
import ResultsSection from './components/ResultsSection.js';
import DetailModal from './components/DetailModal.js';
import Loading from './components/Loading.js';
import Error from './components/Error.js';

import { api } from './api/theCatAPI.js';
import { getItem, setItem } from './util/sessionStorage.js';

export default class App {
  constructor($target) {
    // 세션에 저장된 키워드(검색어)불러옴
    const keywords = getItem('keywords');
    const data = getItem('data');

    const searchingSection = new SearchingSection({
      $target,
      keywords,
      onSearch: async (keyword) => {
        loading.toggleSpinner();
        
        const response = await api.fetchCats(keyword);
        if (!response.isError) {
          setItem('data', response.data);
          resultsSection.setState(response.data);
          loading.toggleSpinner();
        } else {
          error.setState(response.data);
        }
      },
      onRandom: async () => {
        loading.toggleSpinner();

        const response = await api.fetchRandomCats();
        if (!response.isError) {
          setItem('data', response.data);
          resultsSection.setState(response.data);
          loading.toggleSpinner();
        } else {
          error.setState(response.data);
        }
      },
    });

    const resultsSection = new ResultsSection({
      $target,
      data,
      onClick: (data) => {
        detailModal.setState(data);
      },
      onScroll: async () => {
        loading.toggleSpinner();

        const response = await api.fetchRandomCats();
        if (!response.isError) {
          // 기존에 sessionStorage에 있는 데이터를 불러옵니다.
          const beforeData = getItem('data');

          // 기존 데이터에 추가로 받아온 새 데이터를 concat합니다.
          const nextData = beforeData.concat(response.data);

          // 합쳐진 데이터를 다시 sessionStorage에 저장합니다.
          setItem('data', nextData);

          // 새 데이터를 바탕으로 결과 페이지에 상태를 변화시킵니다.
          resultsSection.setState(nextData);
          loading.toggleSpinner();
        } else {
          error.setState(response.data);
        }
      },
    });

    const detailModal = new DetailModal({
      $target,
    });

    const loading = new Loading({
      $target,
    });

    // 최상위인 App 컴포넌트로 전달된 에러는 Error 컴포넌트로 전달되어 error code에 따라 다른 에러 화면으로 랜더링된다.

    const error = new Error({
      $target,
    });

    const darkmodeBtn = document.createElement('span');
    darkmodeBtn.className = 'darkmode-btn';
    darkmodeBtn.innerText = '🌕';

    $target.appendChild(darkmodeBtn);
  }
}
