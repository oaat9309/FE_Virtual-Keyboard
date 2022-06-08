export class Keyboard {
  // #(hash)로 선언한 변수는 private 변수가 되어서 class 외부 혹은 export 하는 곳에서 임의로 변경이 불가능해짐
  #switchEl;
  constructor() {
    this.#assginElement();
    this.#addEvent();
  }

  #assginElement() {
    this.#switchEl = document.getElementById("switch");
  }

  #addEvent() {
    this.#switchEl.addEventListener("change", (e) => {
      console.log(e.target);
      document.documentElement.setAttribute(
        "theme",
        e.target.checked ? "dark-mode" : ""
      );
    });
  }
}
