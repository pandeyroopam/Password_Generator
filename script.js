const lengthDisplay = document.querySelector("[data-lenNum]");
const inputSlider = document.querySelector(".slider");
const passwordDisplay = document.querySelector(".display");

const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMesg]");
const upperCase = document.querySelector("#uppercase");
const lowerCase = document.querySelector("#lowercase");
const number = document.querySelector("#number");
const Symbol = document.querySelector("#Symbol");
const indicator = document.querySelector(".indicator");

const generateBtn = document.querySelector(".generate");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols ='!@#$%^&*()_-+={}[]|\";.><,?/~`';


console.log(indicator);
let password = "";
let passwordLength = 10;
let checkCount = 0;
// set strength circle color to grey
handleSlider();
// set passwordLength  

// the only function of handle slider is to reflect the value of passwordLength on screen
function handleSlider(){
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
//   remaining part
}

function setIndicator(color){
        indicator.style.backgroundColor = color;
        // shadow
}

function getRandomInteger(min, max){
   return Math.floor( Math.random()*(max-min)) + min;

}

function generateRandomNumber(){
    return getRandomInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol(){
    let len = symbols.length;
    return symbols.charAt(getRandomInteger(0, len));
}

function calculateStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(upperCase.checked) hasUpper = true;
    if(lowerCase.checked) hasLower = true;
    if(Symbol.checked) hasSym = true;
    if(number.checked) hasNum = true;

    if(hasLower && hasUpper && hasNum && hasSym && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
       copyMsg.innerText = "Failed";
    }

    // to make copyMsg visisble
      copyMsg.classList.add("active");

      setTimeout(() => {
        copyMsg.classList.remove("active")
      }, 2000);
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
})

function handleCheckBox(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++ ;
          })

        //   special condition
        if(passwordLength < checkCount){
            passwordLength = checkCount;
            handleSlider();
        }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handleCheckBox);
})


function shufflePassword(array){
// fisher yates method
  for(let i=array.length-1; i > 0; i--){
    const j = Math.floor(Math.random()*(i+1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

generateBtn.addEventListener('click', () => {

    // if none of the checkboxes are selected then
         if(checkCount == 0)
            return;

         if(passwordLength < checkCount){
            passwordLength = checkCount;
            handleSlider();
         }

        //  let start the journey to find the new password
          console.log("starting the journey");
        // first remove the old password
        password = "";

        // let first select those things which were mention in the above password

        // if(upperCase.checked){
        //     password += generateUpperCase();
        // }
        // if(lowerCase.checked){
        //     password += generateLowerCase();
        // }
        // if(number.checked){
        //     password += generateRandomNumber();
        // }
        // if(Symbol.checked){
        //     password += generateSymbol();
        // }

        let funcArr = [];

        if(upperCase.checked)
            funcArr.push(generateUpperCase);

        if(lowerCase.checked)
            funcArr.push(generateLowerCase);

        if(number.checked)
            funcArr.push(generateRandomNumber);

        if(Symbol.checked)
            funcArr.push(generateSymbol);

        // compulsory addition

        for(let i=0; i<funcArr.length; i++){
            password += funcArr[i]();
        }

        // remaining addition
        for(let i=0; i<passwordLength-funcArr.length; i++){
            let randomIndex = getRandomInteger(0, funcArr.length);
            password += funcArr[randomIndex]();
        }

        // shuffle the password
        password = shufflePassword(Array.from(password));

        // show it UI
        passwordDisplay.value = password;
        // calculation Strength
        calculateStrength();
})