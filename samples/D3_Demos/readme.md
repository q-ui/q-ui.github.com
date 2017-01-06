项目启动方式
1. 下载安装nodejs，http://nodejs.cn/ 安装完成后在cmd中输入node --version，确认是否完成安装并添加到环境变量

2. 在cmd中进入当前目录，执行npm install，下载所需要的各项包文件，主要为d3.js和bootstrap.css文件

3. 启动外部的nginx或者apache服务器，并设置本项目文件的路径

4. 如电脑未安装nginx或者apache，则执行start_server.bat文件，启动nodejs服务器，并在浏览器中访问 http://localhost:3000 以访问当前项目。如需关闭nodejs服务器，连续按下两次ctrl+c,或者关闭弹出的cmd窗口即可。