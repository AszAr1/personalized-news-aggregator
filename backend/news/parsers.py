import requests as r
from datetime import datetime, timedelta
from bs4 import BeautifulSoup, Tag


class BBCParser:
    source = 'https://www.bbc.com'
    category_to_link = {
        "Tech": f"{source}/innovation/technology",
        "Business": f"{source}/business",
        "Culture": f"{source}/culture",
    }

    def getNews(self, number_of_articles: int) -> list[dict]:
        news = []
        for category in self.category_to_link.keys():
            category_news = self.getNewsByCategory(number_of_articles, category)
            news += category_news

            news.sort(key=lambda x: x['published_at'])

        return news[-1:-1 - number_of_articles:-1]

    def getNewsByCategory(self, number_of_articles: int, category: str) -> list[dict]:
        page = r.get(self.category_to_link[category])
        soup = BeautifulSoup(page.text, 'html.parser')

        articles: list[Tag] = soup.findAll(
            'div',
            attrs={'data-testid': 'edinburgh-card'}
        )
        titles = []
        for article in articles[:number_of_articles]:
            headline = article.find('h2', attrs={'data-testid': 'card-headline'})
            link = article.find('a', attrs={'data-testid': 'internal-link'})
            if not link:
                continue

            body = article.find('p', attrs={'data-testid': 'card-description'})
            last_updated = article.find('span', attrs={'data-testid': 'card-metadata-lastupdated'})
            if 'ago' in last_updated.getText():
                if str(last_updated.getText()).split(' ')[1][0] == 'h':
                    date = datetime.today().date()
                else:
                    days_passed = int(str(last_updated.getText()).split(' ')[0])
                    date = datetime.today().date() - timedelta(days=days_passed)
            elif last_updated.getText() == "Just now":
                date = datetime.today().date()
            else:
                date = datetime.strptime(last_updated.getText(), '%d %b %Y').date()

            titles.append({
                'title': headline.getText(),
                'body': body.getText(),
                'category': category,
                'published_at': date,
                'url': f"{self.source}{link['href']}",
                'source': self.category_to_link[category],
            })

        return titles[::-1]

    def search(self, prompt: str) -> list[dict]:
        page = r.get(f'{self.source}/search?q={prompt.replace(" ", "+")}')
        soup = BeautifulSoup(page.text, 'html.parser')

        results = soup.findAll(
            'div',
            attrs={'data-testid': 'newport-card'}
        )

        titles = []
        for result in results:
            headline = result.find('h2', attrs={'data-testid': 'card-headline'})
            link = result.find('a', attrs={'data-testid': 'internal-link'})
            body_wrapper: Tag = result.find('div', attrs={'data-testid': 'newport-article'})
            body: Tag = body_wrapper.contents[2]
            last_updated = result.find('span', attrs={'data-testid': 'card-metadata-lastupdated'})

            if 'ago' in last_updated.getText():
                if str(last_updated.getText()).split(' ')[1][0] == 'h':
                    date = datetime.today().date()
                else:
                    days_passed = int(str(last_updated.getText()).split(' ')[0])
                    date = datetime.today().date() - timedelta(days=days_passed)
            else:
                date = datetime.strptime(last_updated.getText(), '%d %b %Y').date()

            titles.append({
                'title': headline.getText(),
                'body': body.getText(),
                'published_at': date,
                'url': f"{self.source}{link['href']}",
            })

        return titles


class ABCParser:
    source = "https://abcnews.go.com"
    category_to_link = {
        "Sports": f"{source}/Sports",
        "Tech": f"{source}/Technology",
        "Business": f"{source}/Business",
        "Health": f"{source}/Health",
        "Politics": f"{source}/Politics",
    }

    def getNews(self, number_of_articles: int) -> list[dict]:
        news = []
        for category in self.category_to_link.keys():
            category_news = self.getNewsByCategory(number_of_articles, category)
            news += category_news

            news.sort(key=lambda x: x['published_at'])

        return news[-1:-1 - number_of_articles:-1]

    def getNewsByCategory(self, number_of_articles: int, category: str) -> list[str]:
        page = r.get(self.category_to_link[category])
        soup = BeautifulSoup(page.text, 'html.parser')
        articles: list[Tag] = soup.findAll(
            "section",
            attrs={"class": "ContentRoll__Item"}
        )

        titles = []
        for article in articles[:number_of_articles]:
            headline = article.find('a', attrs={'class': 'AnchorLink'})
            body = article.find('div', attrs={'class': 'ContentRoll__Desc'})
            last_updated = article.find('div', attrs={'class': 'ContentRoll__Date'})

            if "ago" in last_updated.getText():
                date = datetime.today().date()
            else:
                date = datetime.strptime(
                    f"{datetime.today().year} {last_updated.getText()}",
                    '%Y %B %d'
                ).date()

            titles.append({
                'title': headline.getText(),
                'body': str(body.getText()),
                'category': category,
                'published_at': date,
                'url': f"{headline['href']}",
                'source': self.category_to_link[category],
            })

        return titles[::-1]


class NBCParser:
    source = 'https://www.nbcnews.com'
    category_to_link = {
        "Sports": f"{source}/sports",
        "Tech": f"{source}/tech-media",
        "Business": f"{source}/business",
        "Health": f"{source}/health",
        "Politics": f"{source}/politics",
        "Culture": f"{source}/culture-matters",
    }

    def getNews(self, number_of_articles: int) -> list[dict]:
        news = []
        for category in self.category_to_link.keys():
            category_news = self.getNewsByCategory(number_of_articles, category)
            news += category_news

            news.sort(key=lambda x: x['published_at'])

        return news[-1:-1 - number_of_articles:-1]

    def getNewsByCategory(self, number_of_articles: int, category: str) -> list[dict]:
        page = r.get(self.category_to_link[category])
        soup = BeautifulSoup(page.text, 'html.parser')

        articles = soup.findAll(
            'div',
            attrs={"data-testid": "wide-tease"}
        )

        titles = []
        for article in articles[:number_of_articles]:
            headline = article.find('h2', attrs={'data-testid': 'wide-tease-headline'})
            link_wrapper: Tag = article.find('div', attrs={'data-testid': 'wide-tease-info-wrapper'})
            link: Tag = link_wrapper.contents[1]
            body = article.find('div', attrs={'data-testid': 'wide-tease-dek'})
            last_updated = article.find('div', attrs={'data-testid': 'wide-tease-date'})
            text = str(last_updated.getText())
            date = datetime.today().date() if text.split(' ')[0][-1] in ('h', 'm') else \
                datetime.today().date() - timedelta(days=int(text.split(' ')[0][:-1]))

            titles.append({
                'title': headline.getText(),
                'body': body.getText(),
                'category': category,
                'published_at': date,
                'url': link['href'],
                'source': self.category_to_link[category],
            })

        return titles[::-1]
