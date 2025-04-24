import asyncio as aio
from functools import reduce

from .parsers import (
    IZParser,
    RTParser,
    GazetaParser,
)


class NewsManager:
    @classmethod
    async def get_news(cls, number_of_articles: int) -> list[dict]:
        iz_parser = IZParser()
        gazeta_parser = GazetaParser()
        rt_parser = RTParser()

        coroutines = (coroutine for coroutine in [
            iz_parser.get_news(number_of_articles),
            gazeta_parser.get_news(number_of_articles),
            rt_parser.get_news(number_of_articles),
        ])

        async with aio.TaskGroup() as tg:
            tasks = [tg.create_task(coroutine) for coroutine in coroutines]

        news = reduce(lambda x, y: x + y, [task.result() for task in tasks], [])
        news.sort(key=lambda x: x['published_at'], reverse=True)
        return news

    @classmethod
    async def get_news_by_category(cls, number_of_articles: int, categories: list[str]) -> list[dict]:
        iz_parser = IZParser()
        gazeta_parser = GazetaParser()
        rt_parser = RTParser()

        coroutines = (coroutine for coroutine in [
            iz_parser.get_news(number_of_articles),
            gazeta_parser.get_news(number_of_articles),
            rt_parser.get_news(number_of_articles),
        ])

        async with aio.TaskGroup() as tg:
            tasks = [tg.create_task(coroutine) for coroutine in coroutines]

        news = reduce(lambda x, y: x + y, [task.result() for task in tasks], [])
        news.sort(key=lambda x: x['published_at'], reverse=True)
        return news

    @classmethod
    async def search(cls, prompt: str) -> list[dict]:
        iz_parser = IZParser()
        return await iz_parser.search(prompt)
