const https = require("https");

const [fundName = ""] = process.argv.slice(2);
console.log("Fund Name: ", fundName);

const options = {
  protocol: "https:",
  hostname: "codequiz.azurewebsites.net",
  method: "GET",
  headers: {
    Cookie: "hasCookie = true",
  },
};

const req = https.request(options, (response) => {
  let data = "";

  response.on("data", (chunk) => {
    data += chunk;
  });

  response.on("end", () => {
    const start = data.search("<table>");
    const end = data.search("</table>");
    const htmlText = data.slice(start, end);
    const temp1 = htmlText
      .replace("<table>", "")
      .replace(/<td>/g, "")
      .replace(/<tr>/g, "")
      .replace(/<th>/g, "")
      .replace(/ /g, "");
    const temp2 = temp1.split("</tr>");

    const fundList = temp2
      .filter((item) => item !== "")
      .map((row, i) => {
        if (i === 0) {
          const [fundName, nav, bid, offer, change] = row.split("</th>");
          return { fundName, nav, bid, offer, change };
        } else {
          const [fundName, nav, bid, offer, change] = row.split("</td>");
          return { fundName, nav, bid, offer, change };
        }
      });

    const fund = fundList.find((fund) => {
      return fund.fundName === fundName;
    });
    if (fund) {
      console.log(fund.nav);
    }
  });
});

req.on("error", (e) => {
  console.log("Problem with request:", e.message);
});
req.end();
