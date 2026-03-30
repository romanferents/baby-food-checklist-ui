export function formatDate(dateString: string, language: string): string {
  const date = new Date(dateString);
  const locale = language === 'uk' ? 'uk-UA' : 'en-US';

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatShortDate(dateString: string, language: string): string {
  const date = new Date(dateString);
  const locale = language === 'uk' ? 'uk-UA' : 'en-US';

  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
  });
}

export function formatRelativeDate(dateString: string, language: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return language === 'uk' ? 'Сьогодні' : 'Today';
  } else if (diffDays === 1) {
    return language === 'uk' ? 'Вчора' : 'Yesterday';
  } else if (diffDays < 7) {
    return language === 'uk' ? `${diffDays} дні тому` : `${diffDays} days ago`;
  }

  return formatShortDate(dateString, language);
}

export function toISOString(date: Date = new Date()): string {
  return date.toISOString();
}
