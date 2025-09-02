# designated base image
FROM node:18

# designated timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' > /etc/timezone

# default workdir
WORKDIR /home/project

# copy project files into build runtime enviroment
COPY . .

# install requirement modules
RUN npm install

# build project
RUN npm run build

# launch core js, to use pm2 for docker container, it needs to use pm2-runtime to keep the container running continued.
CMD ["pm2-runtime", "start", "/home/project/dist/index.js"]