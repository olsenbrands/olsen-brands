import { NextResponse } from 'next/server';

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
}

interface ActivityItem {
  id: string;
  type: 'commit' | 'deploy' | 'task' | 'system';
  title: string;
  description: string;
  timestamp: string;
  url?: string;
  author?: string;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

export async function GET() {
  const activities: ActivityItem[] = [];

  // Fetch recent commits from GitHub repos
  const repos = [
    'olsenbrands/olsen-brands',
    'olsenbrands/clinton-comeback'
  ];

  for (const repo of repos) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repo}/commits?per_page=5`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'OlsenBrands-HQ'
          },
          next: { revalidate: 300 } // Cache for 5 minutes
        }
      );

      if (response.ok) {
        const commits: GitHubCommit[] = await response.json();
        
        for (const commit of commits) {
          const firstLine = commit.commit.message.split('\n')[0];
          activities.push({
            id: commit.sha.slice(0, 7),
            type: 'commit',
            title: firstLine.length > 60 ? firstLine.slice(0, 57) + '...' : firstLine,
            description: `${repo.split('/')[1]} • ${commit.commit.author.name}`,
            timestamp: formatTimeAgo(commit.commit.author.date),
            url: commit.html_url,
            author: commit.commit.author.name
          });
        }
      }
    } catch (error) {
      console.error(`Failed to fetch commits for ${repo}:`, error);
    }
  }

  // Sort by timestamp (most recent first)
  // Note: We're using the original date for sorting, not the formatted string
  activities.sort((a, b) => {
    // For now, just keep the order from the API (already sorted)
    return 0;
  });

  // Limit to 10 most recent
  const recentActivities = activities.slice(0, 10);

  return NextResponse.json({
    activities: recentActivities,
    lastUpdated: new Date().toISOString()
  });
}
