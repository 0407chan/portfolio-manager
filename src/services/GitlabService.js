import Api from '@/services/Api'

const BASE_URL = 'https://lab.ssafy.com/api/v4'

export default {
	getRepos(userName, privateToken='') {
		let DETAIL_URL = `/users/${userName}/projects`;
		if(privateToken != ''){
			DETAIL_URL += '?private_token='+privateToken
		}
		return Api(BASE_URL).get(DETAIL_URL)
	},
	getCommits(fullName, privateToken='') {
		let d = new Date()
		d.setMonth(0)
		d.setDate(1)
		let DETAIL_URL = `/projects/${fullName}/repository/commits?since=${d.toISOString()}`;
		if(privateToken != ''){
			DETAIL_URL += '&private_token='+privateToken
		}
		return Api(BASE_URL).get(DETAIL_URL)
	}
}
