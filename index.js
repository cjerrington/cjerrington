const md = require("markdown-it")({
  html: true, // Enable HTML tags in source
  breaks: true, // Convert '\n' in paragraphs into <br>
  linkify: true, // Autoconvert URL-like text to links
});
const emoji = require("markdown-it-emoji");
const fs = require("fs");
const Parser = require("rss-parser");

const parser = new Parser();

const feedUrl = "https://claytonerrington.com/feed.xml";
const usefulscriptingFeedURL = "https://usefulscripting.network/feed.xml"
const usnWebsite = "https://usefulscripting.network"
const mywebsite = "https://claytonerrington.com";
const twitterUrl = "https://www.twitter.com/cjerrington";
const linkedInUrl = "https://www.linkedin.com/in/claytonerrington/";
const mastodonUrl = "https://mstdn.social/@cjerrington"
const instagramUrl = "https://www.instagram.com/cjerrington/";
const blogPostLimit = 5;
const badgeHeight = "25";

const projects = `
Project | Description
--------|------------
[SQLBuilder](https://github.com/cjerrington/SQLBuilder/blob/main/README.md) | Simple SQL Attach Script Generator
[net-check](https://claytonerrington.com/net-check/) | NodeJS & Electron application to check the status of remote ports if a connection can be made
[Wakey](https://github.com/cjerrington/wakey) | Simple Python app to keep a computer awake
[netutil](https://pypi.org/project/netutil/) | Python module to check the status of ports for local and remote connections
[MoneyCounter](https://github.com/cjerrington/MoneyCounter) | Simple VueJS app to count your change and bills
Deployment HQ | Internal project at work to help assist the deployment engineers with daily tasks`;

md.use(emoji);

(async () => {
  let blogPosts = "";
  try {
    blogPosts = await loadBlogPosts(feedUrl, mywebsite);
  } catch (e) {
    console.error(`Failed to load blog posts from ${mywebsite}`, e);
  }

  let usnblogPosts = "";
  try {
    usnblogPosts = await loadBlogPosts(usefulscriptingFeedURL, usnWebsite);
  } catch (e) {
    console.error(`Failed to load blog posts from ${usnWebsite}`, e);
  }
  
  let now = "";
  try {
    now = await getDateNow();
  } catch (e) {
    console.error('Failed to get date and time', e);
  }

  const headerText = `<h1>Hi 👋, I'm Clayton</h1>\n\n<h3>A passionate developer of open source projects from Texas</h3>`;
  //const headerImage = `<img src="https://i.imgur.com/RK1kR8g.png" alt="cjerrington GitHub README header image">`;
  const websiteBadge = `[<img src="https://img.shields.io/website?down_color=lightgrey&down_message=offline&style=flat-square&up_color=blue&up_message=claytonerrington.com&url=https%3A%2F%2Fclaytonerrington.com" height=${badgeHeight}>](${mywebsite})`;
  const mastodonBadge = `[<img src="https://img.shields.io/mastodon/follow/108200000569711642?domain=https%3A%2F%2Fmstdn.social&style=for-the-badge" height=${badgeHeight}>](${mastodonUrl})`;
  const twitterBadge = `[<img src="https://img.shields.io/badge/twitter-%231DA1F2.svg?&style=for-the-badge&logo=twitter&logoColor=white" height=${badgeHeight}>](${twitterUrl})`;
  const linkedInBadge = `[<img src="https://img.shields.io/badge/linkedin-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white" height=${badgeHeight}>](${linkedInUrl})`;
  const instagramBadge = `[<img src="https://img.shields.io/badge/instagram-%23E4405F.svg?&style=for-the-badge&logo=instagram&logoColor=white" height=${badgeHeight}>](${instagramUrl})`;
  
  const buyMeACoffeeButton = `<a href="https://www.buymeacoffee.com/cjerrington" target="_blank" rel="noreferrer nofollow">
      <img src="https://cdn.buymeacoffee.com/buttons/default-red.png" alt="Buy Me A Coffee" height="40" width="170" >
    </a>`;

  const footer = `<p align="center"><small>Updated once a day via <a href="https://github.com/cjerrington/cjerrington/blob/main/.github/workflows/build.yml">Github Actions</a>. Last update: ${now}</small></p>`

  const text = `${headerText}\n\n
  ${websiteBadge} ${twitterBadge} ${linkedInBadge} ${mastodonBadge} ${instagramBadge}\n\n
  [:arrow_right: Check out my website](${mywebsite})\n\n
  ${buyMeACoffeeButton}\n\n
  ## My Latest Blog Posts\n
  ${blogPosts}\n
  ## Useful Scripting Network Blog Posts\n 
  ${usnblogPosts}
  ## Noteworthy Projects
  ${projects}\m
  ${footer}
  `;

  const result = md.render(text);

  fs.writeFile("README.md", result, function (err) {
    if (err) return console.log(err);
    console.log(`${result} > README.md`);
  });
})();

async function loadBlogPosts(thefeedurl, websiteUrl) {
  const feed = await parser.parseURL(thefeedurl);

  let links = "";

  feed.items.slice(0, blogPostLimit).forEach((item) => {
    links += `<li><a href=${item.link}>${item.title}</a></li>`;
  });

  return `
  <ul>
    ${links}
  </ul>\n
  [:arrow_right: More blog posts](${websiteUrl})
  `;
}

async function getDateNow(){
  
  const dateObject = new Date();
  // current date
  // adjust 0 before single digit date
  const date = (`0 ${dateObject.getDate()}`).slice(-2);
  
  // current month
  const month = (`0 ${dateObject.getMonth() + 1}`).slice(-2);
  
  // current year
  const year = dateObject.getFullYear();
  
  // current hours
  const hours = dateObject.getHours();
  
  // current minutes
  const minutes = dateObject.getMinutes();

  const datetime = `${month}-${date}-${year}`
  
  // prints date & time in YYYY-MM-DD HH:MM:SS format
  console.log(datetime);

  return datetime
}