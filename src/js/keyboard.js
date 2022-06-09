export class Keyboard {
  // #(hash)로 선언한 변수는 private 변수가 되어서 class 외부 혹은 export 하는 곳에서 임의로 변경이 불가능해짐
  #switchEl;
  #fontSelectEl;
  #containerEl;
  constructor() {
    this.#assginElement();
    this.#addEvent();
  }

  // switchEl과 fontSelectEl을 직접 document에서 찾기 보다, container를 미리 document에서 찾아놓고 그 안에서 해당 엘리먼트를 찾는 것이 비용적으로 유리
  #assginElement() {
    this.#containerEl = document.getElementById("container");
    this.#switchEl = this.#containerEl.querySelector("#switch");
    this.#fontSelectEl = this.#containerEl.querySelector("#font");
  }

  #addEvent() {
    this.#switchEl.addEventListener("change", this.#onChangeTheme);
    this.#fontSelectEl.addEventListener("change", this.#onChangeFont);
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
