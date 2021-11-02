document.addEventListener("DOMContentLoaded", async () => {
  const dogBar = document.querySelector("#dog-bar");
  const dogInfo = document.querySelector("#dog-info");
  const goodDogFilter = document.querySelector("#good-dog-filter");

  const url = "http://localhost:3000/pups";

  const fetchDoggos = async url => await (await fetch(url)).json();

  const displayDoggos = doggos => {
    dogBar.innerHTML = "";
    doggos.forEach(({ name }) => {
      const span = document.createElement("SPAN");
      span.textContent = name;
      dogBar.appendChild(span);
    });
  };

  const doggos = await fetchDoggos(url);

  dogBar.addEventListener("click", e => {
    const dogName = e.target.textContent;
    let { name, image, isGoodDog, id } = (() => {
      for (let i = 0; i < doggos.length; i++) {
        if (doggos[i].name === dogName) return doggos[i];
      }
    })();
    const html = `
    <img src=${image}>
    <h2>${name}</h2>
    <button class="${id}">${isGoodDog ? "Good" : "Bad"} Dog!</button>
    `;
    dogInfo.innerHTML = html;
  });

  dogInfo.addEventListener("click", e => {
    const btn = e.currentTarget.querySelector("button");
    if (e.target === btn) {
      const id = "/" + btn.className;
      const isGood = btn.textContent === "Good Dog!";
      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isGoodDog: !isGood }),
      };

      isGood ? (btn.textContent = "Bad Dog!") : (btn.textContent = "Good Dog!");
      fetch(url + id, options)
        .then((res) => res.json())
        .then((data) => console.log(data));
    }
  });

  goodDogFilter.addEventListener("click", (e) => {
    const toggle = e.target.querySelector("span");
    if (toggle.textContent === "ON") {
      toggle.textContent = "OFF";
      displayDoggos(doggos);
    } else {
      toggle.textContent = "ON";
      const goodDoggos = [];
      doggos.forEach((dog) => {
        if (dog.isGoodDog) goodDoggos.push(dog);
      });
      displayDoggos(goodDoggos);
    }
  });

  displayDoggos(doggos);
});
