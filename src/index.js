const fetchDoggos = async (url) => {
  const doggos = await (await fetch(url)).json()
  return doggos;
}

document.addEventListener('DOMContentLoaded', async () => {
  const dogBar = document.querySelector('#dog-bar')
  const dogInfo = document.querySelector('#dog-info')

  const url = 'http://localhost:3000/pups'

  const doggos = await fetchDoggos(url)
  console.log(doggos);
  doggos.forEach(({name}) => {
    const span = document.createElement('SPAN');
    span.textContent = name;
    dogBar.appendChild(span)
  })
  
  
  dogBar.addEventListener('click', (e) => {
    const dogName = e.target.textContent;
    let {name, image, isGoodDog, id} = (() => {
      for (let i = 0; i < doggos.length; i++) {
        if (doggos[i].name === dogName) return doggos[i]
      }
    })();
    const html = `
    <img src=${image}>
    <h2>${name}</h2>
    <button class="${id}">${isGoodDog ? "Good" : "Bad"} Dog!</button>
    `;
    dogInfo.innerHTML = html;
  })

  dogInfo.addEventListener('click', (e) => {
    const btn = e.currentTarget.querySelector('button');
    if (e.target === btn) {
      const id = "/" + btn.className
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({isGoodDog: false || true}),
      }
      btn.textContent === "Good Dog!" ? btn.textContent = "Bad Dog!" : btn.textContent = "Good Dog!";
      fetch(url + id, options)
        .then(res => res.json())
        .then(data => console.log(data))
    }
  })
})