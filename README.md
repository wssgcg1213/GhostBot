GhostBot
---
#### A Common Search Engine based On Ghost API
#### 基于Ghost API的通用搜索引擎
---
The plugin is written by [Zeroling](http://www.zeroling.com).
Updated by [Luna Shu](https://luna.fancylog.net).

The plugin allows front-end engineer to add Search Engine to your platform based on Ghost API. Similar but unlike GhostHunter ,there is no need of jQuery or lunr.js.

这个插件不需要任何依赖, 加载方式类似于博客系统Ghost的开源插件[GhostHunter](https://github.com/i11ume/ghostHunter/), 但是不需要 jQuery 和 lunr.js 的支持.

通过Ghost API 获取全站文章, 在 Chrome 和 Safari 环境下支持良好, 其他环境未测试.

If you find it useful, it's what I'd like to see.

If you cannot run it properly, or you have any good suggestions, cantact me and maybe I could make it better: <luna_shu@fancylog.net>.

Usage
---
Load the GhostBot.

```
<script src="js/ghostbot.min.js">	
```

You need a inputbox that for users inputting the keywords.

```
<input type="text" class="search-form-input" placeholder="Search"/>
```

And a resultbox where result was shown;

```
<div class="search-bar-result"></div>
```
Config the GhostBot after DOM is loaded totally;

```
var g = new GhostBot({
	inputbox: document.querySelector('.search-form-input'),
	target: document.querySelector('.search-bar-result'),
	info_template: "<h4>Find{{amount}}Articles.</h4>",
    result_template: "<a href='{{link}}' class='searchResult'>{{title}}</a>",
});
```

Options
---
- inputbox: The input box, we use `ele.value` to get keywords.  用来输入的元素, 内部用`ele.value`的方式读取关键词.

- target: The result box, we use `ele.innerHTML` to put formatted temlates in.  用来输出的元素, 内部用`ele.innerHTML`的方式来输出解析之后的模板.

- `optional` info_template: infomation template, we will use search result `amount` to replace {{amount}}.  信息模板, {{amount}}会被搜索结果的条数替换.
`default` : `"<h4>Find{{amount}}Articles.</h4>"`

- `optional` result_template: result template, we will use each result to replace {{link}}, {{title}}, {{content}}.   结果模板, {{link}}, {{title}}, {{content}}会被每一条搜索结果替换.
`default` : `"<a href='{{link}}' class='searchResult'>{{title}}</a>"`

