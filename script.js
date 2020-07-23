const apiRequest =
  'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo';

/* Variáveis de estado da aplicação */
let allUsersTab = null;
let filteredUsersTab = null;
let inputTextDigited = null;

let allUsers = [];
let filteredUsers = [];

let numberOfMen = 0;
let numberOfWomen = 0;
let totalFilteredUsers = 0;
let sumOfAges = 0;
let meanOfAges = 0;

window.addEventListener('load', () => {
  allUsersTab = document.querySelector('#allUsersTab');
  filteredUsersTab = document.querySelector('#filteredUsersTab');
  inputTextDigited = document.querySelector('#inputText');

  numberOfMen = document.querySelector('#numberOfMen');
  numberOfWomen = document.querySelector('#numberOfWomen');
  totalFilteredUsers = document.querySelector('#totalFilteredUsers');
  sumOfAges = document.querySelector('#sumOfAges');
  meanOfAges = document.querySelector('#meanOfAges');

  fetchUsers();
});

async function fetchUsers() {
  const res = await fetch(apiRequest);
  const data = await res.json();
  allUsers = data.results.map((user) => {
    const { gender, name, dob, picture } = user;
    return {
      gender,
      fullName: name.first + ' ' + name.last,
      age: dob.age,
      picture: picture.medium,
    };
  });
  render();
}

function render() {
  renderFilterUsers();
  handleKeyboardButtons();
}

function renderFilterUsers() {
  let filteredUsersHTMl =
    '<h2> Filtered Users...</h2> <div class="filterUsers"> ';

  filteredUsers.forEach((user) => {
    const { fullName, gender, picture, age } = user;

    const filterUser = `
      <div class="user col-3">
        <img src="${picture}" >
        <div class="usersInfo">
          <p> Name: ${fullName}</p>
          <p> Age: ${age} </p>
          <p> Gender: ${gender} </p>
        </div>
      </div>
    `;
    filteredUsersHTMl += filterUser;
  });

  filteredUsersHTMl += '</div>';
  filteredUsersTab.innerHTML = filteredUsersHTMl;
}

function renderStatistics() {
  // Number of men
  numberOfMen.textContent = filteredUsers.filter(
    (user) => user.gender === 'male'
  ).length;

  // Number of Women
  numberOfWomen.textContent = filteredUsers.filter(
    (user) => user.gender === 'female'
  ).length;

  totalFilteredUsers.textContent = filteredUsers.length;

  // Sum of ages
  sumOfAges.textContent = filteredUsers.reduce((acc, curr) => {
    return acc + curr.age;
  }, 0);

  // Mean of ages
  let meanOfAgesCalculation = filteredUsers.reduce((acc, curr) => {
    return acc + curr.age;
  }, 0);

  // Testa se o vetor está vazio
  filteredUsers.length == 0
    ? (meanOfAgesCalculation = 0)
    : (meanOfAgesCalculation = meanOfAgesCalculation / filteredUsers.length);

  meanOfAges.textContent = meanOfAgesCalculation.toFixed(2);
}

function handleKeyboardButtons() {
  inputTextDigited.addEventListener('keyup', () => {
    if (inputTextDigited.value !== '') {
      const peopleFiltered = allUsers.filter((user) => {
        return user.fullName
          .toLowerCase()
          .includes(inputTextDigited.value.toLowerCase());
      });
      filteredUsers = [...peopleFiltered];
    } else {
      filteredUsers = [];
    }

    renderFilterUsers();
    renderStatistics();
  });
}
