'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-07-26T17:01:17.194Z',
    '2025-01-24T23:36:17.929Z',
    '2025-01-28T23:36:17.929Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2024-04-10T14:43:26.374Z',
    '2024-06-25T18:49:59.371Z',
    '2024-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  // type: 'standart',

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2025-01-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2025-01-24T14:43:26.374Z',
    '2025-01-25T18:49:59.371Z',
    '2024-07-26T12:01:20.894Z',
  ],
  currency: 'JPY',
  locale: 'jp-JP',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  // type: 'basic',

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2025-01-29T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2025-01-28T16:33:06.386Z',
  ],
  currency: 'RUB',
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

const formatMovementDate = function (date, locale) {
  const calcDays = (date1, date2) =>
    Math.floor(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDays(new Date(), date);

  if (daysPassed === 0) return 'today';
  if (daysPassed === 1) return 'yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {

    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

function displayMovements(acc, sort = false) {
  containerMovements.innerHTML = '';

  const combinedMovDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));

  if (sort) combinedMovDates.sort((a, b) => a.movement - b.movement);

  combinedMovDates.forEach(function (obj, i) {
    const { movement, movementDate } = obj;

    const operation = movement > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(movementDate);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMove = formatCur(movement, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${operation}">${
      i + 1
    } ${operation}</div>
 
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMove}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => (acc += mov), 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const user = 'Steven Thomas Williams';
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map((dep, i, arr) => {
      return (dep * acc.interestRate) / 100;
    })
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);

  //Display summary
  calcDisplaySummary(acc);

  //Display balance
  calcDisplayBalance(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    time--;
  };

  let time = 180;

  const timer = setInterval(tick, 1000);

  return timer;
};

// EVENT Handlers
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
  }

  // Create current date and time
  labelDate.innerHTML = '';
  const now = new Date();
  const dayNow = new Intl.DateTimeFormat(currentAccount.locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);
  labelDate.textContent = dayNow;

  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();

  // start log out functionality
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();

  //update UI
  updateUI(currentAccount);
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  let amount = +inputTransferAmount.value;
  let receiver = accounts.find(acc => acc.username === inputTransferTo.value);

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiver &&
    receiver?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);

    // Adda a transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiver.movementsDates.push(new Date().toISOString());

    // reset timer
    clearInterval(timer);
    timer = startLogOutTimer();

    updateUI(currentAccount);
  } else {
    alert('NOT VALID AMOUNT');
  }

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(Math.floor(amount));

      // Add a loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);

    // reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
    }, 2000);
  } else {
    alert('NOT VALID LOAN');
  }

  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);

  sorted = !sorted;
});
