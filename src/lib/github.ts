const GITHUB_REPO = "givestation/youbuidl-quadraticfunding";

export async function getGitHubStats() {
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`);
    if (!response.ok) {
      throw new Error('Failed to fetch GitHub stats');
    }
    const data = await response.json();
    return {
      forks: data.forks_count,
      stars: data.stargazers_count
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return { forks: 0, stars: 0 };
  }
}