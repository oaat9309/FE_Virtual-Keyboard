export class Keyboard {
  // #(hash)로 선언한 변수는 private 변수가 되어서 class 외부 혹은 export 하는 곳에서 임의로 변경이 불가능해짐
  #switchEl;
  #fontSelectEl;
  #containerEl;
  #keyboardEl;
  #inputGroupEl;
  #inputEl;
  #keyPress = false;
  #mouseDown = false;
  constructor() {
    this.#assginElement();
    this.#addEvent();
  }

  // switchEl과 fontSelectEl을 직접 document에서 찾기 보다, container를 미리 document에서 찾아놓고 그 안에서 해당 엘리먼트를 찾는 것이 비용적으로 유리
  // 주의할 점은 document만 getElement 관련 메서드를 쓸수 있기 때문에, #containerEl을 도입하면 querySelector 밖에 못쓴다는 점!
  #assginElement() {
    this.#containerEl = document.getElementById("container");
    this.#switchEl = this.#containerEl.querySelector("#switch");
    this.#fontSelectEl = this.#containerEl.querySelector("#font");
    this.#keyboardEl = this.#containerEl.querySelector("#keyboard");
    this.#inputGroupEl = this.#containerEl.querySelector("#input-group");
    this.#inputEl = this.#containerEl.querySelector("#input");
  }

  #addEvent() {
    this.#switchEl.addEventListener("change", this.#onChangeTheme);
    this.#fontSelectEl.addEventListener("change", this.#onChangeFont);
    document.addEventListener("keydown", (e) => {
      if (this.#mouseDown) return;
      this.#keyPress = true;
      console.log(e.code);
      // 정규식을 사용하여 한글 입력을 방지
      // 만약 입력이 어떤 식으로든 한글이면 toggle에 넣어준 두번째 인자는 true가 나옴, 그러면 error 클래스명이 빠지는 구조
      // 즉, 토글 메서드의 두번째 인자가 참일때 toggle이 실행되는 구조
      this.#inputGroupEl.classList.toggle(
        "error",
        /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(e.key)
      );

      // 현재 ctrl, alt, tab 등의 특수 키들은 data-code를 지정 안한 상태
      // 따라서 space와 backspace를 제외한 애들은 눌러도 따로 효과 없고 콘솔에 에러가 뜰 것 (data-code를 못찾으니까)
      // 코드의 안정성을 위해 옵션 체이닝으로 (?)를 넣어줌으로서 에러 방지 (if 문 없이 그냥 classList 조작하는 코드만 써도 동작은 함)
      this.#keyboardEl
        .querySelector(`[data-code=${e.code}]`)
        ?.classList.add("active");
    });
    document.addEventListener("keyup", (e) => {
      if (this.#mouseDown) return;
      this.#keyPress = false;
      console.log(e.code);
      this.#keyboardEl
        .querySelector(`[data-code=${e.code}]`)
        ?.classList.remove("active");
    });

    // 한글을 입력하면 아예 input 칸에 띄우지 않게 하는 코드!
    // 위와 마찬가지로 정규식을 가져와서, replace 메서드 안에 넣음
    this.#inputEl.addEventListener("input", () => {
      this.#inputEl.value = this.#inputEl.value.replace(
        /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
        ""
      );
    });

    // 마우스로 입력하는 거 구현
    this.#keyboardEl.addEventListener("mousedown", this.#onMouseDown);
    document.addEventListener("mouseup", this.#onMouseUp);
  }

  #onMouseDown(e) {
    if (this.#keyPress) return;
    this.#mouseDown = true;
    // closest는 가장 가까운 부모 요소부터 인자에 해당하는 DOM 엘리먼트를 찾는 메서드
    e.target.closest("div.key").classList.add("active");
  }

  //내가 마우스를 떼는 위치가 반드시 누른 키보드가 아닐 수도 있음
  //그래서 mouseUp에 해당하는 함수는 이벤트 객체가 아니라 keyboardEl에서 active 클래스명을 가진 애를 찾도록 함
  //따라서 위 addEvent에서 mouseup에 해당하는 부분을 보면 keyboardEl이 아니라 document 전체에 이벤트 리스너를 걸어준거
  #onMouseUp(e) {
    if (this.#keyPress) return;
    this.#mouseDown = false;
    const keyEl = e.target.closest("div.key");
    // 느낌표 두 개 붙인건 확실하게 boolean 값으로 바꿀려고 그런거
    const isActive = !!keyEl?.classList.contains("active");
    const val = keyEl?.dataset.val;
    if (isActive && !!val && val !== "Space" && val !== "Backspace") {
      this.#inputEl.value += val;
    }
    if (isActive && val === "Space") {
      this.#inputEl.value += " ";
    }
    if (isActive && val === "Backspace") {
      this.#inputEl.value = this.#inputEl.value.slice(0, -1);
    }
    this.#keyboardEl.querySelector(".active").classList.remove("active");
  }

  #onChangeTheme(e) {
    document.documentElement.setAttribute(
      "theme",
      e.target.checked ? "dark-mode" : ""
    );
  }

  #onChangeFont(e) {
    console.log(e.target);
    document.body.style.fontFamily = e.target.value;
  }
}
