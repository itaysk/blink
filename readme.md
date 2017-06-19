Blink is a collaborative bookmarking tool for teams, just like your browser's bookmarks, but shared. I created it for our team at work. It's build for Microsoft Azure.

System overview:

![architecture](./architecture.png)

* Important note!
CUrrently it is not recommended to serve the application directly from Storage. See this issue for more details:
[https://feedback.azure.com/forums/217298-storage/suggestions/6417741-static-website-hosting-in-azure-blob-storage](https://feedback.azure.com/forums/217298-storage/suggestions/6417741-static-website-hosting-in-azure-blob-storage)  
As a workaround, add a CDN service in from and serve the app from there. see here: [https://blog.lifeishao.com/2017/05/24/serving-your-static-sites-with-azure-blob-and-cdn](https://blog.lifeishao.com/2017/05/24/serving-your-static-sites-with-azure-blob-and-cdn)