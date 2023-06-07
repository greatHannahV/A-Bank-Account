'use strict';
///////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
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

const displayMovements = function(movements) {
    containerMovements.innerHTML = ''; //ereased our page
    movements.forEach(function(mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const html = ` <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i} ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov}€</div>
    </div>`;

        containerMovements.insertAdjacentHTML('afterbegin', html); //1=position 2 =string withhtml
    });
};

const calcDisplayBalance = function(acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = `${acc.balance}€`;
    // acc.balance = balance
};


const calcDisplaySummery = function(acc) {
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${incomes}€`;
    const outcomes = acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(outcomes)}€`;

    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * acc.interestRate) / 100)
        .filter(int => int >= 1)
        .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = `${interest }€`;
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
    displayMovements(acc.movements);
    //display summary

    calcDisplaySummery(acc);
    //display balance

    calcDisplayBalance(acc);
}

//Event handler
let currentAccount;

btnLogin.addEventListener('click', function(e) {
    //prevent form  from submiting
    e.preventDefault();

    currentAccount = accounts.find(
        acc => acc.username === inputLoginUsername.value
    );
    // console.log(currentAccount);

    if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
        //display UI and welcome message
        labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`
        containerApp.style.opacity = 100;


        // //display movements
        // displayMovements(currentAccount.movements);
        // //display summary

        // calcDisplaySummery(currentAccount);
        // //display balance

        // calcDisplayBalance(currentAccount);

        //clear input fields
        inputLoginUsername.value = inputLoginPin.value = '';
        //removed the focus
        inputLoginPin.blur()
        wrong.style.opacity = 0;
        //upadeUI
        updateUI(currentAccount)





    } else if (currentAccount === undefined) {
        wrong.style.opacity = 100;
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
            //upadeUI
        updateUI(currentAccount)

    }
})

btnLoan.addEventListener('click', function(e) {
    e.preventDefault()
    const loan = Number(inputLoanAmount.value)

    currentAccount.movements.push(loan)
    updateUI(currentAccount)

    inputTransferAmount.value = inputTransferTo.value = ''
    inputTransferAmount.blur()


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

/////////////////////////////////////////////////
/////////////////////////////////////////////////