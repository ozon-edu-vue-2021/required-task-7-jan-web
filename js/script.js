const contactsList = document.querySelector(".contacts-list");
const detailsView = document.querySelector(".details-view");
const container = document.querySelector("#container");
const backArrow = detailsView.querySelector(".back");
const detailsViewUl = detailsView.querySelector("ul");
let contactsListCards;

const xhr = new XMLHttpRequest();
xhr.open("GET", "data.json", true);
xhr.send();
xhr.addEventListener("load", () => {
	const contactsListLayout = makeLayout(JSON.parse(xhr.responseText));
	contactsList.innerHTML = contactsListLayout;
	contactsListCards = contactsList.querySelectorAll("li");
	contactsListCards.forEach((card) => {
		card.addEventListener("click", onCardClick);
	});
	backArrow.addEventListener("click", hideFriends);
});

const onCardClick = (e) => {
	const targetLi = e.target.closest("li");
	showFriends(targetLi);
};

function showFriends(targetLi) {
	container.classList.add("details");
	targetLi.classList.add("active");
	const id = targetLi.id;
	const allFriendsData = [...contactsListCards].reduce((acc, item, index) => {
		const name = item.querySelector("strong").textContent;
		const obj = {};
		obj[index] = { name: name, friends: item.dataset.friends };
		acc.push(obj);
		return acc;
	}, []);

	const friendsNames = getFriends(allFriendsData, id);
	const notFriends = getNotFriends(allFriendsData, id);
	const popularFriends = getPopularFriends(allFriendsData);

	detailsViewUl.innerHTML = `
    <li class="people-title">Друзья</li>
    <li><i class="fa fa-male"></i><span>${friendsNames[0]}</span></li>
    <li><i class="fa fa-male"></i><span>${friendsNames[1]}</span></li>
    <li><i class="fa fa-male"></i><span>${friendsNames[2]}</span></li>
    <li class="people-title">Не в друзьях</li>
    <li><i class="fa fa-male"></i><span>${notFriends[0]}</span></li>
    <li><i class="fa fa-male"></i><span>${notFriends[1]}</span></li>
    <li><i class="fa fa-male"></i><span>${notFriends[2]}</span></li>
    <li class="people-title">Популярные люди</li>
    <li><i class="fa fa-male"></i><span>${popularFriends[0]}</span></li>
    <li><i class="fa fa-male"></i><span>${popularFriends[1]}</span></li>
    <li><i class="fa fa-male"></i><span>${popularFriends[2]}</span></li>
  `;
}

function getPopularFriends(allFriendsData) {
	const chart = [];
	const mostPopularIdxs = [];
	const mostPopularPersons = [];
	chart.length = allFriendsData.length;
	chart.fill(0, 0, allFriendsData.length);
	allFriendsData.forEach((person, idx) => {
		const friendsById = getFriendsById(allFriendsData, idx);
		friendsById.forEach((elem) => {
			chart[elem - 1] += 1;
		});
	});

	for (let i = 0; i < 3; i++) {
		const mostPopular = chart.reduce((acc, item) => {
			if (item > acc) {
				acc = item;
			}
			return acc;
		}, 0);
		const mostPopularIdx = chart.findIndex((item) => {
			return item === mostPopular;
		});
		mostPopularIdxs.push(mostPopularIdx);
		chart[mostPopularIdx] = -1;
	}
	mostPopularIdxs.forEach((id) => {
		mostPopularPersons.push(allFriendsData[id][id].name);
	});
	return mostPopularPersons.sort();
}

function getNotFriends(allFriendsData, id) {
	const notFriends = [];
	const friendsById = getFriendsById(allFriendsData, id);
	do {
		const randomFriend = Math.ceil(Math.random() * allFriendsData.length);
		if (!friendsById.includes(randomFriend)) {
			const newNonFriend =
				allFriendsData[randomFriend - 1][randomFriend - 1].name;
			notFriends.push(newNonFriend);
			friendsById.push(randomFriend);
		}
	} while (notFriends.length < 3);
	return notFriends;
}

function getFriends(allFriendsData, id) {
	const friendsNames = [];
	const friendsById = getFriendsById(allFriendsData, id);
	friendsById.forEach((id) => {
		friendsNames.push(allFriendsData[id - 1][id - 1].name);
	});
	return friendsNames;
}

function getFriendsById(allFriendsData, id) {
	return allFriendsData[id][id].friends.split(",").map((elem) => +elem);
}

function hideFriends() {
	detailsView.style.zIndex = 0;
	container.classList.remove("details");
	contactsListCards.forEach((card) => {
		card.classList.remove("active");
	});
	detailsViewUl.innerHTML = "";
}

function makeLayout(persons) {
	return persons
		.map((person) => {
			const personCard = `
      <li id=${person.id - 1} data-friends=${	person.friends }>
        <strong>${person.name}</strong>
      </li>
      `;
			return personCard;
		})
		.join("");
}
