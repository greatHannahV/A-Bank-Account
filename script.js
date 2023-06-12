'use strict';
///////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2023-06-06T14:11:59.604Z',
        '2023-06-08T17:01:17.194Z',
        '2023-06-11T23:36:17.929Z',
        '2023-06-12T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'EUR',
    locale: 'de-De',
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const wrong = document.querySelector('.wrong');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
//functions
//create a curr date
const formatMovementDate = function(date, locale) {

    const calcDaysPass = (date1, date2) =>
        Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    const daysPassed = calcDaysPass(new Date(), date)

    if (daysPassed === 0) return 'Today'
    if (daysPassed === 1) return 'Yesterday'
    if (daysPassed <= 7) return `${daysPassed} days ago`
        // else {
        //     const day = `${date.getDate()}`.padStart(2, 0);
        //     const month = `${date.getMonth() + 1}`.padStart(2, 0);
        //     const year = date.getFullYear();
        //     return `${day}/${month}/${year}`
        // }
    return new Intl.DateTimeFormat(locale).format(date)

}


const calcFormattedMov = function(value, locale, currency) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,

    }).format(value)
}
const displayMovements = function(acc, sort = false) {
    //ereased our page
    containerMovements.innerHTML = '';
    //sclice  used to create a shallow copy
    const movs = sort ? acc.movements.slice().sort(((a, b) => a - b)) : acc.movements


    movs.forEach(function(mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const date = new Date(acc.movementsDates[i]);
        const displayDate = formatMovementDate(date, acc.locale);

        const formattedMov = calcFormattedMov(mov, acc.locale, acc.currency)

        const html = ` <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i} ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>`;

        containerMovements.insertAdjacentHTML('afterbegin', html); //1=position 2 =string withhtml
    });
};

const calcDisplayBalance = function(acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    const formattedMov = calcFormattedMov(acc.balance, acc.locale, acc.currency)
    labelBalance.textContent = formattedMov
        // labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
        // acc.balance = balance
};


const calcDisplaySummery = function(acc) {
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = calcFormattedMov(incomes, acc.locale, acc.currency);
    const outcomes = acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = calcFormattedMov(Math.abs(outcomes), acc.locale, acc.currency);

    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * acc.interestRate) / 100)
        .filter(int => int >= 1)
        .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = calcFormattedMov(interest, acc.locale, acc.currency);
};

const createUserNames = function(accs) {
    accs.forEach(function(acc) {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');
    });
};
createUserNames(accounts);

const updateUI = function(acc) {
    //display movements
    displayMovements(acc);
    //display summary

    calcDisplaySummery(acc);
    //display balance

    calcDisplayBalance(acc);
}



//Timer

const startLogOutTimer = () => {
    const tick = () => {
            const min = String(Math.trunc(time / 60)).padStart(2, 0)
            const sec = String(time % 60).padStart(2, 0)
                //in each call, print the remaining time 
            labelTimer.textContent = `${min}:${sec}`

            //when 0s -stop and log out
            if (time === 0) {
                clearInterval(timer)
                containerApp.style.opacity = 0
                labelWelcome.textContent = 'Log in to get started'
                    //clear input fields
                inputLoginUsername.value = inputLoginPin.value = '';
                //removed the focus
                inputLoginPin.blur();
            }
            //decrese 1 s
            time--

        }
        //set time to 5 min
        //call the timer every sec
    let time = 300;
    tick();
    timer = setInterval(tick, 1000);
    return timer


}

//Event handler
let currentAccount, timer;

btnLogin.addEventListener('click', function(e) {
    //prevent form  from submiting
    e.preventDefault();

    currentAccount = accounts.find(
        acc => acc.username === inputLoginUsername.value
    );
    // console.log(currentAccount);

    if (currentAccount && currentAccount.pin === +inputLoginPin.value) {
        //display UI and welcome message
        labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`
        containerApp.style.opacity = 100;
        //date (day/m/year)

        const now = new Date();
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        };
        // const locate = navigator.language;
        labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now)
            // const day = `${now.getDate()}`.padStart(2, 0);
            // const month = `${now.getMonth() + 1}`.padStart(2, 0);
            // const year = now.getFullYear();
            // const hour = now.getHours()
            // const min = `${now.getMinutes()}`.padStart(2, 0)
            // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`


        // //display movements
        // displayMovements(currentAccount.movements);
        // //display summary

        // calcDisplaySummery(currentAccount);
        // //display balance

        // calcDisplayBalance(currentAccount);

        //clear input fields
        inputLoginUsername.value = inputLoginPin.value = '';
        //removed the focus

        inputLoginPin.blur();
        wrong.style.opacity = 0;
        //timer
        if (timer) clearInterval(timer)
        timer = startLogOutTimer();
        //upadeUI
        updateUI(currentAccount);





    } else if (currentAccount === undefined) {
        wrong.style.opacity = 100;
        containerApp.style.opacity = 0
        labelWelcome.textContent = 'Log in to get started'

        wrong.textContent = "Wrong username or password"
            //clear input fields
        inputLoginUsername.value = inputLoginPin.value = '';
        //removed the focus
        inputLoginPin.blur();


        //upadeUI
        updateUI(currentAccount)


    }

});
//transer

btnTransfer.addEventListener('click', function(e) {
    e.preventDefault()
    const amount = Number(inputTransferAmount.value)
    const reciverAccount = accounts.find(acc => acc.username === inputTransferTo.value)

    inputTransferAmount.value = inputTransferTo.value = ''
    inputTransferAmount.blur()
    if (amount > 0 && reciverAccount && currentAccount.balance >= amount &&
        reciverAccount.username !== currentAccount.username) {
        //doing transfer
        currentAccount.movements.push(-amount)
        reciverAccount.movements.push(amount)

        //add a tranfer date
        currentAccount.movementsDates.push(new Date().toISOString())
        reciverAccount.movementsDates.push(new Date().toISOString())
            //upadeUI
        updateUI(currentAccount)
            //reset timer
        clearInterval(timer);
        timer = startLogOutTimer()

    }
})


btnClose.addEventListener('click', function(e) {
    e.preventDefault()

    if (currentAccount.pin === Number(inputClosePin.value) && currentAccount.username ===
        inputCloseUsername.value) {

        const index = accounts.findIndex(acc => acc.username === currentAccount.username)
            //delete account
        accounts.splice(index, 1)

        containerApp.style.opacity = 0
        labelWelcome.textContent = 'Log in to get started'



    }
    inputCloseUsername.value = inputClosePin.value = '';

    inputLoginPin.blur();
})

//loan
btnLoan.addEventListener('click', function(e) {
    e.preventDefault()
    inputLoanAmount.placeholder = '';

    const loan = Math.floor(inputLoanAmount.value)
        //some of them>10%
    if (loan > 0 && currentAccount.movements.some(mov => mov >= loan * 0.1)) {
        setTimeout(() => {
            currentAccount.movements.push(loan)
                //add a loan date
            currentAccount.movementsDates.push(new Date().toISOString())
            updateUI(currentAccount)

            //reset timer
            clearInterval(timer);
            timer = startLogOutTimer()
        }, 2500)



    } else {
        inputLoanAmount.value = ''
        inputLoanAmount.placeholder = 'Denied';


    }


    inputLoanAmount.value = ''
    inputLoanAmount.blur()



})

//sort
let sorted = false;
btnSort.addEventListener('click', function(e) {
    e.preventDefault()
    displayMovements(currentAccount, !sorted)
    sorted = !sorted;
})



//fake always logged in

// currentAccount = account1
// updateUI(currentAccount)
// containerApp.style.opacity = 100




/////////////////////////////////////////////////
/////////////////////////////////////////////////


// const allSum = accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov, 0);
// console.log(allSum);


//return <0, A, B or return>0, B,A
// .sort((a, b) => a-b)
//sorting



// const y = Array.from({ length: 7 }, () => 2)
// const z = Array.from({ length: 8 }, (_, i) => i + 1)
// const z = Array.from({ length: 100 }, () => Math.trunc(Math.random() * 100) + 1)
// console.log(z);


// labelBalance.addEventListener("click", function() {
//     const movementsUI = Array.from(document.querySelectorAll('.movements__value'),
//         el => Number(el.textContent.replace('€', "")))
//     console.log(movementsUI);

// })

// const bankDepositSum = accounts
//     .flatMap(acc => acc.movements.filter(mov => mov > 0))
//     .reduce((acc, mov) => acc + mov, 0);

// const numDeposits1000 = accounts.flatMap(acc => acc.movements).filter(mov => mov >= 1000).length
// const numDeposits1000 = accounts.flatMap(acc => acc.movements)
//     .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0)
// const numDeposits1000 = accounts.flatMap(acc => acc.movements)
//     .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0)
// console.log(numDeposits1000);

//
// const { deposit, withdraws } = accounts
//     .flatMap(acc => acc.movements).reduce((sums, cur) => {
//         // cur > 0 ? sums.deposit += cur : sums.withdraws += cur
//         sums[cur > 0 ? 'deposit' : 'withdraws'] += cur
//         return sums

//     }, { deposit: 0, withdraws: 0 })
// console.log(deposit, withdraws);


// const numDepositsum = accounts.reduce((count, acc) => {
//     return acc.movements.reduce((sum, cur) => {
//         sum[cur > 0 ? 'deposit' : 'withdraws'] += cur
//         return sum
//     }, count)

// }, { deposit: 0, withdraws: 0 })
// console.log(numDepositsum);

//
// labelBalance.addEventListener('click', function() {
//     [...document.querySelectorAll('.movements__row')].
//     forEach(function(row, i) {
//         if (i % 2 === 0) row.style.backgroundColor = 'orangered'
//         if (i % 3 === 0) row.style.backgroundColor = 'blue'


//     })
// })