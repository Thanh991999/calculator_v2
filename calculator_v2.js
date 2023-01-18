//  calculator width classes es6

class Calculator {
  constructor() {
    this.numberBtns      = document.querySelectorAll('.number');
    this.operationBtns   = document.querySelectorAll('.operation');
    this.resultBtn       = document.querySelector('.btn--equal');
    this.displayPrevious = document.querySelector('.screen__math');
    this.displayCurrent  = document.querySelector('.screen__result');
    this.clearBtn        = document.querySelector('.btn--ce');
    this.deleteBtn       = document.querySelector('.btn--dl');
    this.darkmodeBtn     = document.querySelector('.header__menu');
    this.app             = document.querySelector('.app');
    this.screen          = document.querySelector('.screen');
    this.history         = document.querySelector('.drawer__history');
    this.countResult     = 0;
    this.arrHistory      = [];

    this.clear();
    this.renderDisplay();
    this.handleEvent();
  }

  renderDisplay() {
    // console.log(this.operandCurrent, this.operandPrevious, this.operation)
    this.displayCurrent.style.fontSize = (this.operandCurrent.toString().length >= 11) ? '40px' : '60px';
    if( this.operandPrevious == '' ) {
      this.displayPrevious.innerText = this.operandPrevious;
    }
    else {
      this.displayPrevious.innerText = this.operandPrevious + '=';
    }
    this.displayCurrent.innerText = this.operandCurrent;
  }

  clear() {
    this.operandCurrent  = '';
    this.operandPrevious = '';
    this.operation       = '';
    this.countResult     = 0;
    this.displayCurrent.setAttribute('parenses', '');
  }

  handleEvent() {
    const _this = this;

    this.numberBtns.forEach(function(numberBtn) {
      numberBtn.addEventListener("click", (e) => {
        let number = e.target.textContent;
        _this.appendNumber(number);
        _this.renderDisplay();
      })
    })

    this.clearBtn.onclick = function() {
      _this.clear();
      _this.renderDisplay();
    }

    this.deleteBtn.onclick = function() {
      if (typeof(_this.operandCurrent) === 'number') return

      // _this.deleteParentheses(_this.operandCurrent);

      let valueInputArray = _this.operandCurrent.split("");
      if (valueInputArray[valueInputArray.length-1] == undefined) return;

      if (valueInputArray[valueInputArray.length-1] == '(') {
        console.log(1);
        _this.operandCurrent = _this.operandCurrent.slice(0, _this.operandCurrent.length - 1);
        _this.displayCurrent.setAttribute('parenses', ')'.repeat(Math.max((_this.displayCurrent.getAttribute('parenses') || '').length-1, 0)));
      }
      else {
        _this.operandCurrent = _this.operandCurrent.slice(0, _this.operandCurrent.length - 1);
      }


      //  remove ()
      // if (_this.displayCurrent.getAttribute('parenses').length < 1) return false;
      // _this.displayCurrent.setAttribute('parenses', ')'.repeat(Math.max((_this.displayCurrent.getAttribute('parenses') || '').length-1, 0)));

      _this.renderDisplay();
    }

    this.resultBtn.onclick = function() {
      if (_this.countResult > 0) return
      _this.calculate();
      _this.renderDisplay();
      _this.historyFeature(_this.displayPrevious.innerText, _this.operandCurrent)
      _this.countResult ++;
    }

    this.darkmodeBtn.onclick = function() {
      _this.app.classList.toggle('dark');
    }

    // this.history.onclick = function() {
    //   console.log('This is history');
    // }

    window.addEventListener('keydown', (k) => {
      let keyInput = k.which;
      let keyValue = k.key
      let isShift = k.shiftKey
      _this.keyboardInput(keyInput, keyValue, isShift);
    })
  }

  appendNumber(key) {
    // check result ex 1+1 = 2 ->  operand tinh tiep, number set lai phep tinh
    if (this.countResult >= 1 && this.isOperand(key)) {
      this.countResult = 0;
    }
    if (this.countResult >= 1 && key >= '0' && key <= '9') {
      this.clear();
    }

    let valueInput = this.operandCurrent.toString() + key.toString();
    let valueInputClean = this.cleanInput(valueInput, key);

    valueInputClean = this.handleUserBehavior(valueInputClean, key);

    if (!this.checkDot(valueInputClean) || !this.checkParenses(key)) {
      return
    }
    else {
      this.operandCurrent = valueInputClean;
    }
  }

  checkDot(valueInput){
    const _this = this;
    let valueInputArray = valueInput.split('');
    let newArray = [];
    for (let i = 0; i < valueInputArray.length; i++) {
      newArray.push(valueInputArray[i]);
      if (_this.isOperand(valueInputArray[i])) newArray = [];
      if (newArray.includes('.') && newArray.lastIndexOf('.') != newArray.indexOf('.')) return false;
    }
    return true;
  }

  isOperand(key) {
    let arrayOperand = ["+", "-", "*", "/"];
    let resultCheck = arrayOperand.some((element) => {
      return element === key;
    })
    return resultCheck;
  }

  cleanInput(valueInput, key) {
    // check +,-,*,/
    let valueInputArray = valueInput.split("");

    if (this.isOperand(key) && this.isOperand(valueInputArray[valueInputArray.length - 2]) && key == '-') {
      if (valueInputArray[valueInputArray.length - 2] == '-') {
        console.log("hahaha");
        valueInputArray.splice(-2, 1);
      }
    }
    else if (this.isOperand(key) && this.isOperand(valueInputArray[valueInputArray.length - 2])) {
      if (this.isOperand(valueInputArray[valueInputArray.length - 3])) {
        valueInputArray.splice(-3, 2);
      }
      else {
        console.log(1);
        valueInputArray.splice(-2, 2, key.toString());
      }
    }
    valueInput = valueInputArray.join("");

    return valueInput;
  }

  checkParenses(key) {
    if (key  == '(') {
      this.displayCurrent.setAttribute('parenses', ')'.repeat((this.displayCurrent.getAttribute('parenses') || '').length+1));
    }
    else if (key == ')') {
      if (this.displayCurrent.getAttribute('parenses').length < 1) return false;
      this.displayCurrent.setAttribute('parenses', ')'.repeat(Math.max((this.displayCurrent.getAttribute('parenses') || '').length-1, 0)));
    }

    return true;
  }

  handleUserBehavior(valueInput) {
    let valueInputArray = valueInput.split("");
    if (this.isOperand(valueInputArray[0]) && valueInputArray[0] != '-'){
      valueInputArray.splice(0, 0, '0');
    }


    for ( let i = 0; i < valueInputArray.length; i++) {
      //  check operand them * vao truoc ()
      if (valueInputArray[i] == '(' && i >= 1 && !isNaN(Number(valueInputArray[i - 1])) || valueInputArray[i] == '(' &&  i >= 1 && valueInputArray[i - 1] == '.' ) {
        valueInputArray.splice(i, 0, '*');
      }

      //  check . them 0 vao truoc .
      if (valueInputArray[i] == '.' && i == 0 || valueInputArray[i] == '.' &&  valueInputArray[i] == '.' && this.isOperand(valueInputArray[i - 1])) {
        valueInputArray.splice(i, 0, '0');
      }
    }

    return valueInputArray.join("");
  }

  keyboardInput(keyInput, keyValue, isShift) {
    console.log(keyInput, keyValue);
    if (keyInput > 48 && keyInput < 56 && !isShift || keyInput == 56 || keyInput == 57 || keyInput == 48 || keyInput == 187
      || keyInput == 189 && !isShift || keyInput == 191 && !isShift || keyInput == 190 && !isShift) {
      this.appendNumber(keyValue);
      this.renderDisplay();
    } else if (keyInput == 8 || keyInput == 46) {
      if (typeof(this.operandCurrent) === 'number') return
      // this.operandCurrent = this.operandCurrent.slice(0, this.operandCurrent.length - 1);
      let valueInputArray = this.operandCurrent.split("");
      if (valueInputArray[valueInputArray.length-1] == undefined) return;

      if (valueInputArray[valueInputArray.length-1] == '(') {
        console.log(1);
        this.operandCurrent = this.operandCurrent.slice(0, this.operandCurrent.length - 1);
        this.displayCurrent.setAttribute('parenses', ')'.repeat(Math.max((this.displayCurrent.getAttribute('parenses') || '').length-1, 0)));
      }
      else {
        this.operandCurrent = this.operandCurrent.slice(0, this.operandCurrent.length - 1);
      }
      this.renderDisplay();
    }
    else if (keyInput == 187 || keyInput == 13 ) {
      if (this.countResult > 0) return
      this.calculate();
      this.renderDisplay();
      this.countResult ++;
    }
    else if (keyInput == 27) {
      this.clear();
      this.renderDisplay();
    }
  }

  // historyFeature(a , b) {
  //   //  viet tinh nang luu lich su phep tinh
  //   let valueHistory = `${a}${b}`
  //   console.log(valueHistory);
  //   this.history.innerText = valueHistory;
  //   this.arrHistory.push(valueHistory);
  //   console.log(this.arrHistory);
  //   this.arrHistory.map((element) => {
  //     return `<li>${element}</li>`
  //   })
  // }

  calculate() {
    if (this.displayCurrent.getAttribute('parenses')) {
      this.operandCurrent = this.operandCurrent + this.displayCurrent.getAttribute('parenses');
      this.displayCurrent.setAttribute('parenses', '');
    }

    try {
      let result = eval(this.operandCurrent);
      result = Math.round((result + Number.EPSILON) * 100) / 100;
      result = (result != "Infinity") ? result : 'Cannot divide by zero';

      this.operandPrevious = this.operandCurrent;
      this.operandCurrent = result;
    }
    catch {
      this.operandCurrent = 'Error';
    }
  }
}
console(123)

const calculatorObj = new Calculator();
