Results = new Mongo.Collection('results');


if(Meteor.isClient && !Meteor.isCordova){
	window.query = '';
	var recognizing = false;
		var recognizer = new webkitSpeechRecognition();
		recognizer.continuous = true;
		recognizer.interimResults = true;
		final_transcript = '';
		recognizer.lang = 'en-US';
		recognizer.onstart = function(e){
			recognizing = true;
			$('.record-results').removeClass('final');
			$('.search-results').fadeOut('fast');
			$('.video-card').fadeOut('fast');
			$('.start-helper').fadeOut('fast');
			$('.record-results').fadeIn('fast');
			console.log('starting');		
		}
		recognizer.onend = function(e){
			recognizing = false;
			console.log('stopping');
			//alert(window.query);
			$('.record-results').addClass('final'); 
			var query = $('.record-results').text();
			$('.record-results').fadeOut('fast');
			Meteor.call('getdata', query, function(error, result){
			//console.log(result);
			var content = result;
			var az = $(content).find('cite:contains(www.az)').first().text();
			console.log(az);
			az = 'http://' + az;

			Meteor.call('getAz', az, function(error, result){
				var content = result;
				var title = $(content).find('.ringtone').next('b').text().replace(/\"/g, "");
				var album = $(content).find('.album-panel').find('a').text().replace(/\"/g, "");
				var artist = $(content).find('.lyricsh').first().find('b').text().replace(/\"/g, "");
				console.log(artist.split(' LYRICS')[0]);
				artist = toTitleCase(artist.split(' LYRICS')[0]);
				//alert(title);
				$('.song-title').find('.text').html(title);
				$('.song-album').find('.text').html(album);
				$('.song-artist').find('.text').html(artist);
				var googleplay = 'https://play.google.com/store/search?q=' + artist + ' ' + title + '&hl=en';
				$('.play-store-link').attr('href', googleplay);
				$('.search-results').fadeIn('fast');

				Meteor.call('getVideo', title, function(error, result){
					var content = result;
					var videoUrl = $(content).find('h3 a').first().attr('href');
					var videoSplit = videoUrl.split('v=');
					var videoId = videoSplit[1];
					var embed = 'https://www.youtube.com/embed/' + videoId;
					$('.video-embed').attr('src', embed).fadeIn('fast');
					$('.video-card').fadeIn('fast');
					//alert(videoUrl);
					speak('It sounds to me like ' + title + ' by ' + artist);

				});
			});
		});
		}

		recognizer.onresult = function(e){
			if(e.results.length){
				console.log(e);
				var lastResultIdx = e.results[0][0];
				console.log(lastResultIdx.transcript);
				var interim_transcript = '';
				for (var i = e.resultIndex; i < e.results.length; ++i) {
					if (e.results[i].isFinal) {
						final_transcript = e.results[i][0].transcript;
					} else {
						interim_transcript = e.results[i][0].transcript;
					}
				}

				console.log(final_transcript);
				//alert(lastResultIdx.transcript);
				$('.record-results').html(final_transcript);
				window.query = final_transcript;

			}
		
		}

		
		Template.body.helpers({
			'songs': function(){
				var fromDb = Results.find({}, {sort: {createdAt: -1}}).fetch();
				console.log(fromDb);
				return fromDb;
			}
		});

Template.body.events({
	'click .search-fire': function(event){
		window.speechSynthesis.onvoiceschanged = function() {
			window.speechSynthesis.getVoices();
			window.voices = window.speechSynthesis.getVoices();
		};

		var query =	$('.query-term').val();
		$('.start-helper').fadeOut('fast');
		Meteor.call('getdata', query, function(error, result){
			//console.log(result);
			var content = result;
			var az = $(content).find('cite:contains(www.az)').first().text();
			console.log(az);
			az = 'http://' + az;

			Meteor.call('getAz', az, function(error, result){
				var content = result;
				var title = $(content).find('.ringtone').next('b').text().replace(/\"/g, "");
				var album = $(content).find('.album-panel').find('a').text().replace(/\"/g, "");
				var artist = $(content).find('.lyricsh').first().find('b').text().replace(/\"/g, "");
				console.log(artist.split(' LYRICS')[0]);
				artist = toTitleCase(artist.split(' LYRICS')[0]);
				//alert(title);
				$('.song-title').find('.text').html(title);
				$('.song-album').find('.text').html(album);
				$('.song-artist').find('.text').html(artist);
				var googleplay = 'https://play.google.com/store/search?q=' + artist + ' ' + title + '&hl=en';
				$('.play-search').find('.play-store-link').attr('href', googleplay);
				$('.search-results').fadeIn('fast');

				Meteor.call('getVideo', title, function(error, result){
					var content = result;
					var videoUrl = $(content).find('h3 a').first().attr('href');
					var videoSplit = videoUrl.split('v=');
					var videoId = videoSplit[1];
					var embed = 'https://www.youtube.com/embed/' + videoId;
					$('.video-embed').attr('src', embed).fadeIn('fast');
					$('.video-card').fadeIn('fast');
					//alert(videoUrl);
					speak('It sounds to me like ' + title + ' by ' + artist);

				});
			});
		});
				
		},
	'click .record-button': function(event){

		var btn = $(event.currentTarget);
		if(btn.hasClass('active')){
			btn.removeClass('active');
			recognizer.stop();
		}else{
			btn.addClass('active');
			
		
		recognizer.start();
		}
	}
});

}

if (Meteor.isServer) {

    	var phantomjs = Meteor.npmRequire('phantomjs');
		//var cheerio = Meteor.npmRequire('cheerio');
		var spawn = Meteor.npmRequire('child_process').spawn;
     
      Meteor.methods({
      	getdata: function (query) {
        		var response = request.getSync({
    				url: "http://www.bing.com/search?q=song+lyrics+" + query
  				});
  				return response.body;
    		},
    		getAz: function(lyricslink){
    			console.log('getting az:'+ lyricslink);
    			var response = request.getSync({
    				url: lyricslink
  				});
  				console.log(response);
  				return response.body;
    		},
    		getVideo: function(title){
    			var link = "https://www.youtube.com/results?search_query=" + title;
				var response = request.getSync({
						url: link
				});
				return response.body;  		
    		}
		
      });


}

function speak(text, callback) {

	console.log(window.voices);
	var u = new SpeechSynthesisUtterance();
	u.voice = window.voices[0];
	u.text = text;
	u.lang = 'en-US';

	u.onend = function () {
		if (callback) {
			callback();
		}
	};

	u.onerror = function (e) {
		if (callback) {
			callback(e);
		}
	};

	speechSynthesis.speak(u);
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

if(Meteor.isCordova) {

	Meteor.startup(function () {
		console.log("Device is ready");
		//console.log(cordova);

		recognition = new window.plugins.SpeechRecognition();
		recognition.onresult = function(event) {
			if (event.results.length > 0) {
				q.value = event.results[0][0].transcript;
				q.form.submit();
			}
		}

/*
		Meteor.defer(function() {

			cordova.plugins.speechrecognizer.getSupportedLanguages(function (languages) {
				// display the json array
				alert(languages);
			}, function (error) {
				alert("Could not retrieve the supported languages : " + error);
			});
		});

		Template.body.events({
			'click .start-recognizing': function(){
				alert('recognizing');
				var maxMatches = 5;
				var language = "en-US";
				cordova.speechrecognizer.start(resultCallback, errorCallback, maxMatches, language);
			},
			'click .get-languages': function(){
				cordova.speechrecognizer.getSupportedLanguages(function (languages) {
					// display the json array
					alert(languages);
				}, function (error) {
					alert("Could not retrieve the supported languages : " + error);
				});
			},
			'click .stop-recognizing': function(){
				cordova.plugins.speechrecognizer.stop(resultCallback, errorCallback);
			}

		});
 */
	});




// Show the list of the supported languages


}


function resultCallback(result) {
	console.log(result);
	alert(result.results[0][0].transcript);
}

function errorCallback(error) {
	console.log(error);
}