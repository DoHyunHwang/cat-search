export const throttling = () => {
  let throttleCheck;

  return {
    throttle(callback, milliseconds) {
      if (!throttleCheck) {
        // setTimeout은 timer id를 반환하기 때문에 호출 시점에 throttleCheck에 숫자가 할당되어 true 값으로 여겨진다.
        // setTimeout을 이용하여 설정한 주기마다 콜백이 실행될 수 있도록 하였고, 실행이 끝난 후에는 다시 throttleCheck를 false로 만들어 주어, 설정한 주기마다 이벤트가 한 번씩만 호출되도록 하였습니다.
        throttleCheck = setTimeout(() => {
          callback(...arguments);
          throttleCheck = false;
        }, milliseconds);
      }
    },
  };
};
