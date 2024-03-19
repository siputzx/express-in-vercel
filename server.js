const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = 3000;

//scraper by miftah
async function nexLibur() {
  const { data } = await axios.get("https://www.liburnasional.com/");
  let libnas_content = [];
  let $ = cheerio.load(data);
  let result = {
    nextLibur:
      "Hari libur" +
      $("div.row.row-alert > div").text().split("Hari libur")[1].trim(),
    libnas_content,
  };
  $("tbody > tr > td > span > div").each(function (a, b) {
    const summary = $(b).find("span > strong > a").text();
    const days = $(b).find("div.libnas-calendar-holiday-weekday").text();
    const dateMonth = $(b).find("time.libnas-calendar-holiday-datemonth").text();
    const img = $(b).find(".libnas-holiday-calendar-img").attr("src")
    libnas_content.push({ summary, days, dateMonth, img });
  });
  return result;
}

app.get("/", async (req, res) => {
  try {
    const result = await nexLibur();
    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
