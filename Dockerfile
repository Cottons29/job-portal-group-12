FROM ubuntu:latest
LABEL authors="cottons"

ENTRYPOINT ["top", "-b"]