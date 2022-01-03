const apiUrl =
  "https://api-mainnet.magiceden.io/rpc/getAggregatedCollectionMetrics";

async function fetchData(url) {
  const response = await fetch(url);
  let data = await response.json();
  return data;
}

async function startTracking() {
  const collections = fetchData(apiUrl);

  let job = new CronJob(
    "* */0.5 * * *", // fetch every 30 seconds
    function () {
      collections.then(function (data) {
        console.log(data.results.length);
        data.results.forEach((x) => { 
          const nftName = x.name;
          const currentVol = x.txVolume.value1d.toFixed(4);
          const previous1d = x.txVolume.prev1d.toFixed(4);
          const currentFloor = x.floorPrice.value1d.toFixed(4);
          const previousFloor = x.floorPrice.prev1d.toFixed(4);

          //refactor to use async await
          supabase
            .from("SolanaFloorTracker")
            .insert([
              {
                CollectionName: nftName,
                TodaysVol: currentVol,
                PreviousVol: previous1d,
                CurFloor: currentFloor,
                PrevFloor: previousFloor,
              },
            ])
            .then((response) => {
              console.log(response);
            });
        });
      });
    },
    null,
    true,
    null,
    null,
    true
  );
  job.start();
}

startTracking();

//for later
// async function sendNotification(collection) {
//   let transporter = createTransport({
//     service: "gmail",
//     auth: {
//       user: "*****@gmail.com",
//       pass: "*****",
//     },
//   });

//   let textToSend = `The collection ${collection} has significantly risen in price in the last hour.`;
//   let info = await transporter.sendMail({
//     from: '"Solana Floor Tracker" <*****@gmail.com>',
//     to: "*****@gmail.com",
//     subject: "Solana Floor Tracker Update",
//     text: textToSend,
//   });

//   console.log("Message sent: %s", info.messageId);
// }
