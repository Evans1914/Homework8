document.addEventListener("DOMContentLoaded", () => {
    fetchTechNews();
    fetchGitHubTrends();
});

const newsAPIKey = "your_news_api_key"; // Replace with your NewsAPI key
const newsURL = `https://newsapi.org/v2/top-headlines?category=technology&apiKey=${newsAPIKey}`;
const githubURL = "https://api.github.com/search/repositories?q=stars:%3E10000&sort=stars";

// Fetch Tech News
function fetchTechNews() {
    axios.get(newsURL)
        .then(response => {
            const articles = response.data.articles.slice(0, 5);
            const newsList = document.getElementById("news-list");
            newsList.innerHTML = articles.map(article => 
                `<li><a href="${article.url}" target="_blank">${article.title}</a></li>`).join("");
        })
        .catch(error => console.error("Error fetching news:", error));
}

// Fetch Trending GitHub Repositories
function fetchGitHubTrends() {
    axios.get(githubURL)
        .then(response => {
            const repos = response.data.items.slice(0, 5);
            const githubList = document.getElementById("github-list");
            githubList.innerHTML = repos.map(repo => 
                `<li><a href="${repo.html_url}" target="_blank">${repo.name} ⭐ ${repo.stargazers_count}</a></li>`).join("");
            
            // Prepare data for the chart
            const repoNames = repos.map(repo => repo.name);
            const stars = repos.map(repo => repo.stargazers_count);
            renderChart(repoNames, stars);
        })
        .catch(error => console.error("Error fetching GitHub trends:", error));
}

// Render Chart.js Visualization
function renderChart(labels, data) {
    const ctx = document.getElementById("trendsChart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "GitHub Stars",
                data: data,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
