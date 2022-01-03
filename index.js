//const apiUrl = "https://api-mainnet.magiceden.io/all_collections";
const apiUrl =
  "https://api-mainnet.magiceden.io/rpc/getAggregatedCollectionMetrics";

async function fetchData(url) {
  const response = await fetch(url);
  let data = await response.json();
  return data;
}

const collections = fetchData(apiUrl);
collections.then(function (data) {
  data.results.forEach((x) => {
    console.log(x);
    const nftName = x.name;
    const currentVol = x.txVolume.value1d.toFixed(2);
    const previous1d = x.txVolume.prev1d.toFixed(2);
    const currentFloor = x.floorPrice.value1d.toFixed(2);
    const previousFloor = x.floorPrice.prev1d.toFixed(2);
    

    if (currentVol > previous1d) {
      populateTable(nftName, currentVol, previous1d, currentFloor, previousFloor);
    }
  });
});


function populateTable(nftName, currentVol, previous1d, currentFloor, previousFloor) {
  const table = document.getElementById("floorResults");
  const row = document.createElement("tr");
  const name = document.createElement("td");
  const volume = document.createElement("td");
  const pvolume = document.createElement("td");
  const floor = document.createElement("td");
  const pfloor = document.createElement("td");

  name.innerHTML = nftName;
  volume.innerHTML = currentVol;
  pvolume.innerHTML = previous1d;
  floor.innerHTML = currentFloor;
  pfloor.innerHTML = previousFloor;

  row.appendChild(name);
  row.appendChild(volume);
  row.appendChild(pvolume);
  row.appendChild(floor);
  row.appendChild(pfloor);

  table.appendChild(row);
}
