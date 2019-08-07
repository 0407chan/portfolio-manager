import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import store from '../store'
import 'firebase/functions'
import 'firebase/messaging'

const POSTS = 'posts'
const PORTFOLIOS = 'portfolios'
const PAGELOGS = 'pagelogs'
const USERS = 'users'
const POSTCOMMENTS = "postcomments"
const PORTFOLIOCOMMENTS = 'portfoliocomments'

// Setup Firebase
const config = {
	projectId: 'todo-vue-3ea4e',
	authDomain: 'todo-vue-3ea4e.firebaseapp.com',
	apiKey: 'AIzaSyBSufO4FShHm8XHe6mD9CotDFQfzpkTxUU',
	databaseURL: 'https://todo-vue-3ea4e.firebaseio.com',
	storageBucket: 'todo-vue-3ea4e.appspot.com',
	messagingSenderId: "437302839629",
	appId: "1:437302839629:web:6c403028be6fe081"

	// projectId: 'elice-ssafy',
	// authDomain: 'elice-ssafy.firebaseapp.com',
	// apiKey: 'AIzaSyCax1KLYHHlLEoxNkRIW8efgUBWooyEB2Q',
	// databaseURL: 'https://elice-ssafy.firebaseio.com',
	// storageBucket: 'gs://elice-ssafy.appspot.com'

}


firebase.initializeApp(config)
const firestore = firebase.firestore();
// const firestorage = firebase.storage();
const fireFunctions = firebase.functions();
if (firebase.messaging.isSupported()){
	const fireMessage  = firebase.messaging();
}


export default {

	/********************\
 \     Post 함수들      \
	\********************/
	getPost(id){
		var postDoc = firestore.collection(POSTS).doc(id);
		return postDoc.get().then(function(doc) {
				if (doc.exists) {
					let data = doc.data();
					data.title = doc.data().title;
					data.body = doc.data().body;
					data.id = id;
					data.email = doc.data().email;
					data.name = doc.data().name;
					return data;
				} else {
						console.log("No such document!");
				}
		}).catch(function(error) {
				console.log("Error getting document:", error);
		});
	},
	getPosts() {
		const postsCollection = firestore.collection(POSTS)
		return postsCollection
				.orderBy('created_at', 'desc')
				.get()
				.then((docSnapshots) => {
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						data.id = doc.id;
						data.created_at = new Date(data.created_at.toDate())
						return data
					})
				})
	},
	getPostsById(userId) {
		const postsCollection = firestore.collection(POSTS)
		return postsCollection
				.where("userId", "==", userId)
				.orderBy('created_at', 'desc')
				.get()
				.then((docSnapshots) => {
					return docSnapshots.docs.map((doc) => {

						let data = doc.data();
						data.id = doc.id;
						data.created_at = new Date(data.created_at.toDate());
						return data
					})
				})
	},


	postPost(title, body, userId, name) {
		return firestore.collection(POSTS).add({
			title,
			body,
			userId,
			created_at: firebase.firestore.FieldValue.serverTimestamp(),
			email:store.state.user.email,
			name: name
		}).then(function(docRef) {
    		return docRef.id;
		})
	},

	modifyPost(title,body,id, name){
		return firestore.collection(POSTS).doc(id).update({
			"title":title,
			"body":body,
			"name": name,
			"email":store.state.user.email
		})
	},
	deletePost(id){
		var userId = firebase.auth().currentUser.uid;
		firestore.collection(USERS).doc(userId).update({
    		posts: firebase.firestore.FieldValue.arrayRemove(id),
		})

		return firestore.collection(POSTS).doc(id).delete().then(function() {

		}).catch(function(error) {
				console.error("Error removing document: ", error);
		});
	},

	postAddToCommentList(postId,commentId){
		return firestore.collection(POSTS).doc(postId).update({
    	comments: firebase.firestore.FieldValue.arrayUnion(commentId),
		})
	},




	/********************\
	\  PostCommnet 함수들  \
	\********************/

	postPostComment(postId, body, name, userImageUrl){
		return firestore.collection(POSTCOMMENTS).add({
			postId,
			body,
			created_at: firebase.firestore.FieldValue.serverTimestamp(),
			name: name,
			email:store.state.user.email,
			isModify: false,
			userImageUrl: userImageUrl,
			userId:store.state.user.uid,
		}).then(function(docRef) {
    		return docRef.id;
		})
	},
	getPostComments(postId) {
		const postCommentCollection = firestore.collection(POSTCOMMENTS)
		return postCommentCollection
				.where("postId", "==", postId)
				.orderBy("created_at", 'desc')
				.get()
				.then((docSnapshots) => {
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						data.id = doc.id;
						data.created_at = new Date(data.created_at.toDate())
						return data
					})
				})
	},
	getPostCommentsById(userId) {
		const postCommentCollection = firestore.collection(POSTCOMMENTS)
		return postCommentCollection
				.where("userId", "==", userId)
				.orderBy("created_at", 'desc')
				.get()
				.then((docSnapshots) => {
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						data.id = doc.id;
						data.created_at = new Date(data.created_at.toDate())
						return data
					})
				})
	},

	getPostComment(commentId) {
		const postCommentCollection = firestore.collection(POSTCOMMENTS).doc(commentId)
		return postCommentCollection.get().then(function(doc) {
				if (doc.exists) {
					let data = doc.data();
					data.id = doc.id;
					data.created_at = new Date(data.created_at.toDate())
					return data;
				} else {

				}
			})
	},

	canModify(comment){
		return firestore.collection(POSTCOMMENTS).doc(comment.id).set({
			body: comment.body,
			created_at: comment.created_at,
			isModify: false,
			name: comment.name,
			postId: comment.postId,
			email: store.state.user.email
		})
	},
	modifyComment(comment, newComment){
		return firestore.collection(POSTCOMMENTS).doc(comment.id).update({
			"body": newComment,
			"created_at": comment.created_at,
			"isModify": false,
			"name": comment.name,
			"postId": comment.postId,
			"userImageUrl": comment.userImageUrl,
			"email": store.state.user.email,
			"userId":store.state.user.uid,
		})
	},
	deleteComment(postId, commentId){
		var userId = firebase.auth().currentUser.uid;
		firestore.collection(USERS).doc(userId).update({
    		postcomments: firebase.firestore.FieldValue.arrayRemove(commentId),
		});
		firestore.collection(POSTS).doc(postId).update({
    		comments: firebase.firestore.FieldValue.arrayRemove(commentId),
		});

		return firestore.collection(POSTCOMMENTS).doc(commentId).delete().then(function() {

		}).catch(function(error) {
				console.error("Error removing postComment: ", error);
		});
	},



	/********************\
 \   Portfolio 함수들   \
	\********************/
	deletePortfolio(id){
		var userId = firebase.auth().currentUser.uid;
		firestore.collection(USERS).doc(userId).update({
    		portfolios: firebase.firestore.FieldValue.arrayRemove(id),
		})

		return firestore.collection(PORTFOLIOS).doc(id).delete().then(function() {

		}).catch(function(error) {
				console.error("Error removing document: ", error);
		});
	},
	getPortfolio(id){
		var portfolioDoc = firestore.collection(PORTFOLIOS).doc(id);
		return portfolioDoc.get().then(function(doc) {
				if (doc.exists) {
					let data = doc.data();
					data.title = doc.data().title;
					data.body = doc.data().body;
					data.img = doc.data().img;
					data.id = id;
					return data;
				} else {
						console.log("No such document!");
				}
		}).catch(function(error) {
				console.log("Error getting document:", error);
		});
	},
	getPortfolios() {
		const portfoliosCollection = firestore.collection(PORTFOLIOS)
		return portfoliosCollection
				.orderBy('created_at', 'desc')
				.get()
				.then((docSnapshots) => {
					return docSnapshots.docs.map((doc) => {
						let data = doc.data();
						data.id = doc.id;
						data.created_at = new Date(data.created_at.toDate());
						return data
					})
				})
	},
	getPortfoliosById(userId) {
		const portfoliosCollection = firestore.collection(PORTFOLIOS)
		return portfoliosCollection
				.where("userId", "==", userId)
				.orderBy('created_at', 'desc')
				.get()
				.then((docSnapshots) => {
					return docSnapshots.docs.map((doc) => {

						let data = doc.data();
						data.id = doc.id;
						data.created_at = new Date(data.created_at.toDate());
						return data
					})
				})
	},

	modifyPortfolio(title,body,img,id,name){
		return firestore.collection(PORTFOLIOS).doc(id).update({
			"title":title,
			"img":img,
			"body":body,
			"name":name,
			"email":store.state.user.email
		})
	},

	postPortfolio(title, body, img, id, name) {
		return firestore.collection(PORTFOLIOS).add({
			title,
			body,
			img,
			name,
			userId:id,
			created_at: firebase.firestore.FieldValue.serverTimestamp(),
			email:store.state.user.email
		}).then(function(docRef) {
    		return docRef.id;
		})
	},

	portfolioAddToCommentList(portfolioId,commentId){
		return firestore.collection(PORTFOLIOS).doc(portfolioId).update({
    	comments: firebase.firestore.FieldValue.arrayUnion(commentId),
		})
	},
	/**************************\
 \ Portfolio Comment 함수들   \
	\**************************/



	postPortfolioComment(portfolioId, body, name, userImageUrl){
		return firestore.collection(PORTFOLIOCOMMENTS).add({
			portfolioId,
			body,
			created_at: firebase.firestore.FieldValue.serverTimestamp(),
			name: name,
			email:store.state.user.email,
			isModify: false,
			userImageUrl: userImageUrl,
			userId:store.state.user.uid,
		}).then(function(docRef) {
 		   	return docRef.id;
		})
	},

	getPortfolioComments(portfolioId) {
		const portfolioCommentCollection = firestore.collection(PORTFOLIOCOMMENTS)
		return portfolioCommentCollection
				.where("portfolioId", "==", portfolioId)
				.orderBy("created_at", 'desc')
				.get()
				.then((docSnapshots) => {
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						data.id = doc.id;
						data.created_at = new Date(data.created_at.toDate())
						return data
					})
				})
	},
	getPortfolioCommentsById(userId) {
		const portfolioCommentCollection = firestore.collection(PORTFOLIOCOMMENTS)
		return portfolioCommentCollection
				.where("userId", "==", userId)
				.orderBy("created_at", 'desc')
				.get()
				.then((docSnapshots) => {
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						data.id = doc.id;
						data.created_at = new Date(data.created_at.toDate())
						return data
					})
				})
	},
	canPortfolioModify(comment){
		return firestore.collection(PORTFOLIOCOMMENTS).doc(comment.id).set({
			body: comment.body,
			created_at: comment.created_at,
			isModify: false,
			name: comment.name,
			portfolioId: comment.portfolioId,
			email: store.state.user.email
		})
	},
	modifyPortfolioComment(comment, newComment){
		return firestore.collection(PORTFOLIOCOMMENTS).doc(comment.id).update({
			"body": newComment,
			"created_at": comment.created_at,
			"isModify": false,
			"name": comment.name,
			"portfolioId": comment.portfolioId,
			"userImageUrl": comment.userImageUrl,
			"email": store.state.user.email,
			"userId":store.state.user.uid,
		})
	},
	deletePortfolioComment(portfolioId,commentId){
		var userId = firebase.auth().currentUser.uid;
		firestore.collection(USERS).doc(userId).update({
    		portfoliocomments: firebase.firestore.FieldValue.arrayRemove(commentId),
		});

		firestore.collection(PORTFOLIOS).doc(portfolioId).update({
    		comments: firebase.firestore.FieldValue.arrayRemove(commentId),
		});

		return firestore.collection(PORTFOLIOCOMMENTS).doc(commentId).delete().then(function() {

		}).catch(function(error) {
				console.error("Error removing portfolioComment: ", error);
		});
	},

	/********************\
 \     User 함수들      \
	\********************/
	getUsers(){
		const usersCollection = firestore.collection(USERS)
		return usersCollection
				.orderBy('created_at', 'desc')
				.get()
				.then((docSnapshots) => {
					return docSnapshots.docs.map((doc) => {
						let data = doc.data();
						data.id = doc.id;
						if(data.created_at != ""){
							data.created_at = new Date(data.created_at.toDate())
						}
						if(data.current_at != ""){
							data.current_at = new Date(data.current_at.toDate())
						}
						return data
					})
				})
	},

	modifyUser(user){
		return firestore.collection(USERS).doc(user.id).update({
			"name": user.name,
			"classify": user.classify,
			"email": user.email,
			"created_at": user.created_at,
			"current_at": user.current_at,
			"userImageUrl": user.userImageUrl,
			"isPortfolioOpen": user.isPortfolioOpen,
			"isPostOpen": user.isPostOpen,
			"isCommentOpen": user.isCommentOpen,
		})
	},

	modifyUserWithImage(user, image){
		return firestore.collection(USERS).doc(user.id).set({
			name: user.name,
			classify: user.classify,
			email: user.email,
			created_at: user.created_at,
			current_at: user.current_at,
			userImageUrl: image,
		})
	},

	deleteUserbyId(id){
		//delete user data from firebase
		// firestore.collection(USERS).doc(id).delete().then(function() {
		//
		// }).catch(function(error) {
		// 		console.error("Error removing document: ", error);
		// });

		//delete user from Athentication
		var a = firebase.auth().getUser(id);
		console.log(a);
		// firebase.auth().deleteUser(id).then(function() {
		//
		// }).catch(function(error) {
		//   console.log("이미 지워졌당ㅋ",error);
		// });
	},

	addToPortfolioList(id){
		var userId = firebase.auth().currentUser.uid;
		return firestore.collection(USERS).doc(userId).update({
    	portfolios: firebase.firestore.FieldValue.arrayUnion(id),
		})
	},
	addToPostList(id){
		var userId = firebase.auth().currentUser.uid;
		return firestore.collection(USERS).doc(userId).update({
    	posts: firebase.firestore.FieldValue.arrayUnion(id),
		})
	},
	addToPostcommentList(id){
		var userId = firebase.auth().currentUser.uid;
		return firestore.collection(USERS).doc(userId).update({
    	postcomments: firebase.firestore.FieldValue.arrayUnion(id),
		})
	},
	addToPortfoliocommentList(id){
		var userId = firebase.auth().currentUser.uid;
		return firestore.collection(USERS).doc(userId).update({
    	portfoliocomments: firebase.firestore.FieldValue.arrayUnion(id),
		})
	},

	/********************\
 \    Login 함수들      \
	\********************/
	loginWithGoogle() {
		let provider = new firebase.auth.GoogleAuthProvider()
		firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
		return firebase.auth().signInWithPopup(provider).then(function(result) {

			return result
		}).catch(function(error) {
			console.error('[Google Login Error]', error)
		})
	},
	loginWithFacebook(){
		// Sign in using a popup.
		var provider = new firebase.auth.FacebookAuthProvider();
		firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
		return firebase.auth().signInWithPopup(provider).then(function(result) {
			return result
		}).catch(function(error){
			console.error('[Favebook Loing Error]', error)
		});
	},

	logout() {
		return firebase.auth().signOut()
	},

	getUser(id){
		var userDoc = firestore.collection(USERS).doc(id);
		return userDoc.get().then(function(result) {
			let data = result.data();
			data.id = result.id;
			return data;
		}).catch(function(error) {
				console.log("Error getting document:", error);
		});
	},

	getUserData(){
		var user = firebase.auth().currentUser;
		if(user != null){
			var userData = firestore.collection(USERS).doc(user.uid);
			return userData.get().then(function(result) {
				var data = result.data();
				data.id = result.id;
				return data;
			}).catch(function(error) {
				console.log("Error getting cached document:", error);
			});
		}else{
			return "[getUserData] 로그인을 해주세요";
		}
	},

	userDataInit(){
		var userId = firebase.auth().currentUser.uid;
		return firestore.collection(USERS).doc(userId).set({
			email:"",
			classify:"",
			name:"",
			created_at:"",
			current_at:"",
			userImageUrl:"",
			isPostOpen:true,
			isPortfolioOpen:true,
			isCommentOpen:true,

		}).then(function(result){

		});
	},

	userDataToDB(email,classify,name,created_at,userImageUrl){
		var userId = firebase.auth().currentUser.uid;
		return firestore.collection(USERS).doc(userId).update({
			"email":email,
			"classify":classify,
			"name":name,
			"created_at":created_at,
			"userImageUrl":userImageUrl,
			current_at: firebase.firestore.FieldValue.serverTimestamp(),
		}).then(function(result){

		});
	},

	//셀프 탈퇴
	selfDeleteUser(){
		var user = firebase.auth().currentUser;
		if(user !== null){
			firestore.collection(USERS).doc(user.uid).delete().then(function() {

			}).catch(function(error) {
					console.error("Error removing document: ", error);
			});

			return user.delete().then(function() {

			}).catch(function(error) {
			  console.log("유저 삭제",error);
			});
		}else{
			console.log("유저없음");
		}
	},

	/********************\
 \    PageLog 함수들    \
	\********************/
	getPageLogs() {
		const pageLogCollection = firestore.collection(PAGELOGS)
		return pageLogCollection
				.orderBy('visitTime', 'desc')
				.get()
				.then((docSnapshots) => {
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						data.visitTime = new Date(data.visitTime.toDate())
						return data
					})
				})
	},
	postPageLog(uID, from, to) {
		return firestore.collection(PAGELOGS).add({
			uID,
			from,
			to,
			visitTime: firebase.firestore.FieldValue.serverTimestamp()
		})
	},


	/********************\
 \ Page Offline 함수들  \
	\********************/

	/** 오프라인 지속성 구현 */
	enablePersistence(){
      firestore.enablePersistence()
        .catch(function(err) {
            if (err.code == 'failed-precondition') {
                // Multiple tabs open, persistence can only be enabled
                // in one tab at a a time.
                // ...
            } else if (err.code == 'unimplemented') {
                // The current browser does not support all of the
                // features required to enable persistence
                // ...
            }
        });
      // Subsequent queries will use persistence, if it was enabled successfully
      // [END initialize_persistence]
  },

	// it("should reply with .fromCache fields", () => {
  //     // [START use_from_cache]
  //     db.collection("cities").where("state", "==", "CA")
  //       .onSnapshot({ includeMetadataChanges: true }, function(snapshot) {
  //           snapshot.docChanges().forEach(function(change) {
  //               if (change.type === "added") {
  //                   console.log("New city: ", change.doc.data());
  //               }
	//
  //               var source = snapshot.metadata.fromCache ? "local cache" : "server";
  //               console.log("Data came from " + source);
  //           });
  //       });
  //     // [END use_from_cache]
  //   })

	/**************************\
 \ push 함수들   \
	\**************************/
	alarmOnFirstVisit() {
		if (window.Notification) {
        return fireMessage.requestPermission()
            .then(function () {
                return fireMessage.getToken().then(idToken=>{
					return idToken
                });
            })
            .catch(function (err) {
                console.log(err + 'occured')
			})
		}
    },
    onMessageResponse() {
        return fireMessage.onMessage(function (payload) {
			var notification = new Notification('EEEAZY Notification', {
				icon: 'https://i.imgur.com/wxV4WcW.png',
				body: '읽지않은 알림이 있습니다..',
			  });
			  notification.onclick = function () {
				window.open('http://localhost:8080/');
			  };
        });
    },
    addToCloudMessagingUserList(token) {
        const saveObject = firestore.collection('messageList').doc(token);
        return saveObject.set({
                cloudMessaging: token,
            },
            {
                merge: true
            }
        )
    },

}
