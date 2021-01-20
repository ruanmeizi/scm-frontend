## 开发,本地调试环境

- 安装docker,docker-compose和active support

  Docker Installation:https://docs.docker.com/install/

  sudo apt install docker-compose
  
  sudo gem install activesupport
  
 如果出现 Error: Cannot find module 'node-sass'
  
  cnpm i node-sass
  

启动生产环境  `rake docker:prod`

启动调试环境  `rake docker:dev`

启动调试环境但是不运行web服务 `rake docker:up`  //主要用于rake docker:bash 进去其他调试

## 发布

- 发布到测试环境，
  1. 请merge 到test branch
  2. git push origin test
  3. push动作会自动出发测试环境的pipeline，发布成功，叮叮会有消息通知
  4. 去测试环境验证是否发布已经包含更新, https://portaltest.vitalitytex.com.cn

- 发布到生产环境，
  1. 请merge prod branch
  2. git push origin prod
  3. push动作会自动出发生产环境的pipeline，发布成功，叮叮会有消息通知
  4. 去生产环境验证是否发布已经包含更新, https://portal.vitalitytex.com
