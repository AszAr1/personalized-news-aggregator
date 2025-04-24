from functools import reduce
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from bs4.element import Tag
from abc import ABC, abstractmethod
import requests as r
import aiohttp


class Parser(ABC):
    @abstractmethod
    async def get_news(self, number_of_articles: int) -> list[dict]:
        pass

    @abstractmethod
    async def get_news_by_category(self, number_of_articles: int, category: str) -> list[dict]:
        pass


class IZParser(Parser):
    source = 'https://iz.ru'
    headers = {
        "User-Agent": "Chrome/91.0.4472.124",
    }
    category_to_link = {
        "Culture": f"{source}/rubric/kultura",
        "Business": f"{source}/rubric/ekonomika",
        "Politics": f"{source}/rubric/politika",
        "Sports": f"{source}/rubric/sport",
        "Health": f"{source}/rubric/zdorove",
        "Tech": f"{source}/rubric/internet",
    }

    async def get_news(self, number_of_articles: int) -> list[dict]:
        news = reduce(lambda x, y: x + y, [
            await self.get_news_by_category(number_of_articles, category)
            for category in self.category_to_link.keys()
        ], [])
        return news

    async def get_news_by_category(self, number_of_articles: int, category: str) -> list[dict]:
        link = self.category_to_link.get(category, None)
        if not link:
            return []

        async with aiohttp.ClientSession() as session:
            page = await session.get(link, headers=self.headers)
            content = await page.text()

        soup = BeautifulSoup(content, 'html.parser')
        articles: list[Tag] = soup.findAll(
            'a',
            attrs={'class': 'node__cart__item__inside'},
            limit=number_of_articles,
        )
        titles = []
        for article in articles:
            headline = article.find('div', attrs={'class': 'node__cart__item__inside__info__title'})
            img = article.find("img")
            if img.get("data-src"):
                image = f"https:{img['data-src']}"
            else:
                image = f"https:{img['src']}"

            date_string = article.find('time')['datetime'].split('T')[0].strip()
            date = datetime.strptime(date_string, '%Y-%m-%d').date()

            titles.append({
                'title': headline.getText().strip(),
                'category': category,
                'image': image,
                'published_at': date,
                'url': f"{self.source}{article['href']}",
                'source': self.category_to_link[category],
            })

        return titles[::-1]

    async def search(self, prompt: str) -> list[dict]:
        async with aiohttp.ClientSession() as session:
            page = await session.get("https://iz.ru/search", headers=self.headers, params={'text': prompt})
            content = await page.text()

        soup = BeautifulSoup(content, 'html.parser')
        articles: list[Tag] = soup.find_all(
            'div',
            attrs={'class': 'view-search'},
        )

        titles = []
        for article in articles:
            headline = article.find('div', attrs={'class': 'view-search__title'})
            link = article.find('a')
            last_updated = article.find('div', attrs={'view-search__date'})

            titles.append({
                'title': headline.getText(),
                'published_at': last_updated.getText(),
                'url': f"{link['href']}",
            })

        return titles


class GazetaParser(Parser):
    source = 'https://www.gazeta.ru'
    category_to_link = {
        "Culture": f"{source}/culture",
        "Business": f"{source}/business",
        "Politics": f"{source}/politics",
        "Sports": f"{source}/sport",
        "Tech": f"{source}/tech",
    }

    def has_img(self, tag: Tag):
        return tag.has_attr('class') and "b_ear" in tag['class'] and tag.find('img')

    async def get_news(self, number_of_articles: int) -> list[dict]:
        news = reduce(lambda x, y: x + y, [
            await self.get_news_by_category(number_of_articles, category)
            for category in self.category_to_link.keys()
        ], [])
        return news

    async def get_news_by_category(self, number_of_articles: int, category: str) -> list[dict]:
        link = self.category_to_link.get(category, None)
        if not link:
            return []

        async with aiohttp.ClientSession() as session:
            page = await session.get(link)
            content = await page.text()

        soup = BeautifulSoup(content, 'html.parser')
        articles: list[Tag] = soup.find_all(
            self.has_img,
            limit=number_of_articles,
        )

        titles = []
        for article in articles:
            headline = article.find('div', attrs={'class': 'b_ear-title'})
            img = article.find("img")
            date_string = article.find('time')['datetime'].split('T')[0].strip()
            date = datetime.strptime(date_string, '%Y-%m-%d').date()

            titles.append({
                'title': headline.getText(),
                'image': img['src'],
                'category': category,
                'published_at': date,
                'url': f"{self.source}{article['href']}",
                'source': self.category_to_link[category],
            })

        return titles[::-1]


class RTParser(Parser):
    source = 'https://russian.rt.com'
    category_to_link = {
        "Culture": f"{source}/trend/335012-kultura",
        "Business": f"{source}/business",
        "Politics": f"{source}/trend/334937-politika",
        "Sports": f"{source}/sport",
        "Health": f"{source}/trend/334967-medicina",
        "Tech": f"{source}/trend/335010-tehnologii",
    }

    async def get_news(self, number_of_articles: int) -> list[dict]:
        news = reduce(lambda x, y: x + y, [
            await self.get_news_by_category(number_of_articles, category)
            for category in self.category_to_link.keys()
        ], [])
        return news

    async def get_news_by_category(self, number_of_articles: int, category: str) -> list[dict]:
        link = self.category_to_link.get(category, None)
        if not link:
            return []

        async with aiohttp.ClientSession() as session:
            page = await session.get(link)
            content = await page.text()

        soup = BeautifulSoup(content, 'html.parser')
        articles: list[Tag] = soup.findAll(
            'div',
            attrs={
                'class':
                    'listing__card listing__card_sections' if category in ['Sports', "Business"] else 'listing__card'
            },
            limit=number_of_articles,
        )

        titles = []
        for i, article in enumerate(articles):
            headline = article.find('div', attrs={'class': 'card__heading'})
            link = headline.find('a')
            img = article.find("div", attrs={'class': "cover__media"})
            if img and not img.has_attr("style"):
                img_image = img.find("img")
                image = img_image['src']
            else:
                image = img['style'].split('(')[-1].strip().removesuffix(")")

            last_updated = article.find('time')
            date = datetime.today().date() if not last_updated else \
                datetime.strptime(last_updated['datetime'].split(' ')[0].strip(), '%Y-%m-%d').date()

            titles.append({
                'title': headline.getText(),
                'image': image,
                'category': category,
                'published_at': date,
                'url': f"{self.source}{link['href']}",
                'source': self.category_to_link[category],
            })

        return titles


class BBCParser(Parser):
    source = 'https://www.bbc.com'
    category_to_link = {
        "Tech": f"{source}/innovation/technology",
        "Business": f"{source}/business",
        "Culture": f"{source}/culture",
    }

    async def get_news(self, number_of_articles: int) -> list[dict]:
        news = []
        for category in self.category_to_link.keys():
            category_news = await self.get_news_by_category(number_of_articles, category)
            news += category_news

            news.sort(key=lambda x: x['published_at'])

        return news[::-1]

    async def get_news_by_category(self, number_of_articles: int, category: str) -> list[dict]:
        link = self.category_to_link.get(category, None)
        if not link:
            return []

        async with aiohttp.ClientSession() as session:
            page = await session.get(link)
            content = await page.text()

        soup = BeautifulSoup(content, 'html.parser')
        articles: list[Tag] = soup.findAll(
            'div',
            attrs={'data-testid': 'edinburgh-card'}
        )

        titles = []
        for article in articles[:number_of_articles]:
            headline = article.find('h2', attrs={'data-testid': 'card-headline'})
            title_link = article.find('a', attrs={'data-testid': 'internal-link'})
            if not title_link:
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
                'url': f"{self.source}{title_link['href']}",
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
            category_text = result.find('span', attrs={'data-testid': 'card-metadata-tag'}).getText()
            if not category_text:
                category_text = None

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
                'category': category_text,
                'published_at': date,
                'url': f"{self.source}{link['href']}",
            })

        return titles


class ABCParser(Parser):
    source = "https://abcnews.go.com"
    category_to_link = {
        "Sports": f"{source}/Sports",
        "Tech": f"{source}/Technology",
        "Business": f"{source}/Business",
        "Health": f"{source}/Health",
        "Politics": f"{source}/Politics",
    }

    async def get_news(self, number_of_articles: int) -> list[dict]:
        news = []
        for category in self.category_to_link.keys():
            category_news = await self.get_news_by_category(number_of_articles, category)
            news += category_news

            news.sort(key=lambda x: x['published_at'])

        return news[::-1]

    async def get_news_by_category(self, number_of_articles: int, category: str) -> list[dict]:
        link = self.category_to_link.get(category, None)
        if not link:
            return []

        async with aiohttp.ClientSession() as session:
            page = await session.get(link)
            content = await page.text()

        soup = BeautifulSoup(content, 'html.parser')
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


class NBCParser(Parser):
    source = 'https://www.nbcnews.com'
    category_to_link = {
        "Sports": f"{source}/sports",
        "Tech": f"{source}/tech-media",
        "Business": f"{source}/business",
        "Health": f"{source}/health",
        "Politics": f"{source}/politics",
        "Culture": f"{source}/culture-matters",
    }

    async def get_news(self, number_of_articles: int) -> list[dict]:
        news = []
        for category in self.category_to_link.keys():
            category_news = await self.get_news_by_category(number_of_articles, category)
            news += category_news

            news.sort(key=lambda x: x['published_at'])

        return news[::-1]

    async def get_news_by_category(self, number_of_articles: int, category: str) -> list[dict]:
        link = self.category_to_link.get(category, None)
        if not link:
            return []

        async with aiohttp.ClientSession() as session:
            page = await session.get(link)
            content = await page.text()

        soup = BeautifulSoup(content, 'html.parser')
        articles = soup.findAll(
            'div',
            attrs={"data-testid": "wide-tease"}
        )

        titles = []
        for article in articles[:number_of_articles]:
            headline = article.find('h2', attrs={'data-testid': 'wide-tease-headline'})
            link_wrapper: Tag = article.find('div', attrs={'data-testid': 'wide-tease-info-wrapper'})
            title_link: Tag = link_wrapper.contents[1]
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
                'url': title_link['href'],
                'source': self.category_to_link[category],
            })

        return titles[::-1]
