var page = require('webpage').create();
page.open('http://www.bing.com/search?q=i+dreamed+i+was+missing+and+you+were+so+scared+but+no+one+would+listen&go=Submit&qs=bs&form=QBLH', function (){
    console.log('Page Loaded');
    //page.render('github.png');
	var title = page.evaluate(function(){
		return document.title;

	});
	var links = page.evaluate(function() {
        return [].map.call(document.querySelectorAll('a'), function(link) {
            return link.getAttribute('href');
        });
    });
	 var newlinks = links.join('\n');	
	 page.render(newlinks);
    phantom.exit();
});
