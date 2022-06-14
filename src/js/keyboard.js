export class Keyboard {
  // #(hash)로 선언한 변수는 private 변수가 되어서 class 외부 혹은 export 하는 곳에서 임의로 변경이 불가능해짐
  #switchEl;
  #fontSelectEl;
  #containerEl;
  #keyboardEl;
  #inputGroupEl;
  #inputEl;
  constructor() {
    this.#assignEl();
    this.#addEvent();
  }

  // switchEl과 fontSelectEl을 직접 document에서 찾기 보다, container를 미리 document에서 찾아놓고 그 안에서 해당 엘리먼트를 찾는 것이 비용적으로 유리
  // 주의할 점은 document만 getElement 관련 메서드를 쓸수 있기 때문에, #containerEl을 도입하면 querySelector 밖에 못쓴다는 점!
  #assignEl() {
    this.#containerEl = document.getElementById("container");
    this.#switchEl = this.#containerEl.querySelector("#switch");
    this.#fontSelectEl = this.#containerEl.querySelector("#font");
    this.#keyboardEl = this.#containerEl.querySelector("#keyboard");
    this.#inputGroupEl = this.#containerEl.querySelector("#input-group");
    this.#inputEl = this.#inputGroupEl.querySelector("input");
  }

  #addEvent() {
    this.#switchEl.addEventListener("change", this.#onChangeTheme);
    this.#fontSelectEl.addEventListener("change", this.#onChangeFont);
    document.addEventListener("keydown", this.#onKeydown.bind(this));
    document.addEventListener("keyup", this.#onKeyup.bind(this));
    this.#inputEl.addEventListener("input", this.#onInput.bind(this));
    this.#keyboardEl.addEventListener("mousedown", this.#onMouseDown);
    document.addEventListener("mouseup", this.#onMouseUp.bind(this));
  }

  #onMouseDown(e) {
    e.target.closest("div.key")?.classList.add("active");
  }

  #onMouseUp(e) {
    const keyEl = e.target.closest("div.key");
    const isActive = !!keyEl?.classList.contains("active");
    const val = keyEl?.dataset;

    if (
      isActive &&
      !!val.val &&
      val.val !== "Space" &&
      val.val !== "Backspace"
    ) {
      this.#inputEl.value += val.val;
    }

    if (isActive && val.val === "Space") {
      this.#inputEl.value += " ";
    }

    if (isActive && val.val === "Backspace") {
      this.#inputEl.value = this.#inputEl.value.slice(0, -1);
    }

    this.#keyboardEl.querySelector(".active")?.classList.remove("active");
  }

  #onKeyup(e) {
    this.#keyboardEl
      .querySelector(`[data-code=${e.code}]`)
      ?.classList.remove("active");
  }

  #onKeydown(e) {
    this.#inputGroupEl.classList.toggle("error", e.key === "Process");

    this.#keyboardEl
      .querySelector(`[data-code=${e.code}]`)
      ?.classList.add("active");
  }

  #onInput() {
    this.#inputEl.value = this.#inputEl.value.replace(
      /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
      ""
    );
  }

  #onChangeTheme(e) {
    document.documentElement.setAttribute(
      "theme",
      e.target.checked ? "dark-mode" : ""
    );
  }

  #onChangeFont(e) {
    document.body.style.fontFamily = e.target.value;
  }
}
