var genParamString = function(paramObject) {
    var outputString = '?'
    if(token !== ''){
       for (var key in paramObject) {
        outputString += key + '=' + paramObject[key] + '&'
        return outputString.substr(0,outputString.length - 1)

       }
   } else {
       return token
   }
}

try {
	var token = GLOBAL_TOKEN
}
catch (e) {
	var token = ''
}

var repoURL = 'https://api.github.com/users/ecullu/repos'
var userURL = 'https://api.github.com/users/ecullu'

var params = {
	access_token: token
}
var userInfoPromise = $.getJSON(userURL + genParamString(params))
var repoPromise = $.getJSON(repoURL + genParamString(params))

var searchNode = document.querySelector('#search')
var userInfo = document.querySelector('#leftCol')
var repoList = document.querySelector('#repo')
var htmlString = ''
var repoHTMLString = ''

var searchUser = function (input){
	if(input.keyCode === 13){
		var keyedName = input.target
		var inputName = keyedName.value
		repoURL = 'https://api.github.com/users/' + inputName + '/repos'
		userURL = 'https://api.github.com/users/' + inputName
		var searchUserInfoPromise = $.getJSON(userURL + genParamString(params))
		var searchRepoPromise = $.getJSON(repoURL + genParamString(params))
		htmlString = ''
		repoHTMLString = ''
		keyedName.value = ''
	}
	searchUserInfoPromise.then(showUserInfo)
	searchRepoPromise.then(showRepo)
	
}

var getMonth = function (dateArr){
	var months = ["Jan", "Feb", "Mar","Apr", "May", "June", "July","Aug", "Sept", "Oct","Nov", "Dec"]
	var month = parseInt(dateArr[1])
	for(var i = 0; i < months.length; i++){
		var index = i+1
		if(index === month){
			return months[i]
		}
	}
}

var showUserInfo = function(response){
	console.log(response)
	var userImg = response.avatar_url
	var userFullName = response.name
	var userLogin =  response.login
	var userLocation = response.location
	var userEmail = response.email
	var userBlog = response.blog
	var userCreated = response.created_at
	var followers = response.followers
	var following = response.following

	// convert created time to date
	var dateInt = userCreated.substr(0,10)
	console.log(dateInt)
	var splitDateInt = dateInt.split("-")

	htmlString += '<div id="photo">'
	htmlString += 	'<img src="' + userImg + '">'
	htmlString +=	'<p id="name">' + userFullName + '</p>'
	htmlString += 	'<p id="username">' + userLogin + '</p>'
	htmlString += 	'<hr>'
	htmlString += '</div>'

	htmlString += '<div id="info">'
	htmlString +=	'<div id="location">'
	htmlString += 		'<i class="fa fa-map-marker" aria-hidden="true"></i><p>' + userLocation + ', TX</p>'
	htmlString +=	'</div>'
	if(userEmail !== null){
		htmlString += 	'<div id="email">'
		htmlString += 		'<i class="fa fa-envelope-o" aria-hidden="true"></i><p>' + userEmail + '</p>'
		htmlString +=	'</div>'
	}
	if(userBlog !== null) {
		htmlString +=	'<div id="blog">'
		htmlString += 		'<i class="fa fa-link" aria-hidden="true"></i><p>' + userBlog + '</p>'
		htmlString +=	'</div>'
	}
	htmlString +=	'<div id="joined-date">'
	htmlString +=		'<i class="fa fa-clock-o" aria-hidden="true"></i><p>Joined on ' + getMonth(splitDateInt) + " " + splitDateInt[2] + ", " + splitDateInt[0] + '</p>'
	htmlString += 	'</div>'
	htmlString += 	'<hr>'
	htmlString +='</div>' 

	htmlString += '<div id="stats">'
	htmlString += 	'<div id="followers">'
	htmlString +=		'<div>'+ followers + '</div>'
	htmlString +=		'<p>Followers</p>'
	htmlString += 	'</div>'
	htmlString += 	'<div id="following">'
	htmlString +=		'<div>' + following + '</div>'
	htmlString +=		'<p>Following</p>'
	htmlString += 	'</div>'
	htmlString += '</div>'
	htmlString += 	'<hr>'

	userInfo.innerHTML = htmlString
}

 

var elapsedTime = function (inputMilliSeconds, dateArr) {

   var seconds = Math.floor(inputMilliSeconds/1000) + " second"
   var minutes = Math.floor(inputMilliSeconds/(1000 * 60)) + " minute"
   var hours = Math.floor(inputMilliSeconds/(1000 * 60 * 60)) + " hour"
   var days = Math.floor(inputMilliSeconds/(1000 * 60 * 60 * 24)) + " day"
   var months = Math.floor(inputMilliSeconds/(1000 * 60 * 60 * 24 * 30)) + " month"
   var years = Math.floor(inputMilliSeconds/(1000 * 60 * 60 * 24 * 30 * 12)) + " year"

   var timeArray = [years, months, days, hours, minutes, seconds]

   var dateFormat = dateArr.substr(0,10)
   var splitDateFormat = dateFormat.split("-")
   console.log(getMonth(splitDateFormat))

   for(var i = 0; i < timeArray.length; i++) {
       if(parseInt(timeArray[1]) >= 1 && parseInt(timeArray[0]) < 1){
       	return "on " + getMonth(splitDateFormat) + " " + splitDateFormat[2]
       }
       else if(parseInt(timeArray[0]) >=1){
       	return "on " + getMonth(splitDateFormat) + " " + splitDateFormat[2] + ", " + splitDateFormat[0]
       }
       else{
	       if (parseInt(timeArray[i]) !== 0) {

	           if(parseInt(timeArray[i]) >= 2) {
	               return "about " + timeArray[i] + "s ago"
	           }
	           else if (parseInt(timeArray[i]) < 2) {
	               return timeArray[i] + " ago"
	           }
	       }
		}
   }
}


var showRepo = function(repoArr){
	console.log(repoArr)

	for(var i = 0; i < repoArr.length; i++){
		var repo = repoArr[i]
		var repoName = repo.name
		var repoDescription = repo.description
		var repoLanguage = repo.language
		var repoForksCount = repo.forks_count
		var repoStargazers = repo.stargazers_count

		var today = new Date()
		var repoUpdated = repo.updated_at
		var updateDate = new Date(repoUpdated)
		var elapsed = today - updateDate
 			

		if(repoDescription === null){
			repoDescription = 'No Description'
		}
		if(repoLanguage ==null){
			repoLanguage = 'not specified'
		}

		repoHTMLString += '<div id="repoList">'
		repoHTMLString += 	'<div class="repo">'
		repoHTMLString += 		'<div class="leftColRepo">'
		repoHTMLString += 			'<li>' + repoName + '</li>'
		repoHTMLString +=			'<p class="repoDesc">' + repoDescription + '</p>'
		repoHTMLString +=			'<p>Updated ' + elapsedTime(elapsed,repoUpdated) + '</p>'
		repoHTMLString +=		'</div>'
		repoHTMLString +=		'<div class="rightColRepo">'
		repoHTMLString +=			'<div>' + repoLanguage + '</div>'
		repoHTMLString +=			'<div><i class="fa fa-star" aria-hidden="true"></i>' + repoStargazers + '</div>'
		repoHTMLString +=			'<div><i class="fa fa-code-fork" aria-hidden="true"></i>' + repoForksCount + '</div>'
		repoHTMLString +=		'</div>'
		repoHTMLString += 	'</div>'
		repoHTMLString += '</div>'
		repoList.innerHTML = repoHTMLString
	}
}

userInfoPromise.then(showUserInfo)
repoPromise.then(showRepo)
searchNode.addEventListener('keydown', searchUser)


console.log('token>>>' + token)
