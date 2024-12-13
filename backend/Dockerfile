FROM python

WORKDIR /src

ENV PYTHONUNBUFFERED 1

COPY . .

RUN pip install -r ./requirements.txt

EXPOSE 8000