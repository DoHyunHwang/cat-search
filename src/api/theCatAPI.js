/* eslint-disable no-useless-catch */
const API_ENDPOINT = 'https://api.thecatapi.com/v1';

// fetch API는 request 함수 안에서만 사용된다.
// response가 ok일 때만 정상 데이터가 리턴된다.
// fetch API 요청에 대한 에러는 { message: String, status: String } 형태로 throw 된다.
// 하위에서 던져진 에러는 상위로 전달되어 { isError: boolean, data: Object } 형태로 다시 상위로 throw 된다.
const request = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json();
      throw errorData;
    }
  } catch (e) {
    throw {
      message: e.message,
      status: e.status,
    };
  }
};

const api = {
  fetchCats: async (keyword) => {
    /*
        keyword로 breed를 찾고 각 breed의 id로 이미지를 찾는다.
    */
    try {
      const breeds = await request(
        `${API_ENDPOINT}/breeds/search?q=${keyword}`
      );
      const requests = breeds.map(async (breed) => {
        return await request(
          `${API_ENDPOINT}/images/search?limit=20&breed_ids=${breed.id}`
        );
      });
      const responses = await Promise.all(requests);
      const result = Array.prototype.concat.apply([], responses);

      return {
        isError: false,
        data: result,
      };
    } catch (e) {
      return {
        isError: true,
        data: e,
      };
    }
  },
  fetchRandomCats: async () => {
    /*
      랜덤으로 20개의 고양이 사진을 리턴한다.
    */
    try {
      const result = await request(`${API_ENDPOINT}/images/search?limit=20`);
      return {
        isError: false,
        data: result,
      };
    } catch (e) {
      return {
        isError: true,
        data: e,
      };
    }
  },
};

export { api };
