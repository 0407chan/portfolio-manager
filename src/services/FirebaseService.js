import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import store from '../store'

const POSTS = 'posts'
const PORTFOLIOS = 'portfolios'
const PAGELOGS = 'pagelogs'
const USERS = 'users'
const POSTCOMMENTS = "postcomments"

// Setup Firebase
const config = {
	projectId: 'todo-vue-3ea4e',
	authDomain: 'todo-vue-3ea4e.firebaseapp.com',
	apiKey: 'AIzaSyBSufO4FShHm8XHe6mD9CotDFQfzpkTxUU',
	databaseURL: 'https://todo-vue-3ea4e.firebaseio.com',
	storageBucket: 'gs://todo-vue-3ea4e.appspot.com'

	// projectId: 'elice-ssafy',
	// authDomain: 'elice-ssafy.firebaseapp.com',
	// apiKey: 'AIzaSyCax1KLYHHlLEoxNkRIW8efgUBWooyEB2Q',
	// databaseURL: 'https://elice-ssafy.firebaseio.com',
	// storageBucket: 'gs://elice-ssafy.appspot.com'

}


firebase.initializeApp(config)
const firestore = firebase.firestore()


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
					data.writer = doc.data().writer;
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
	postPost(title, body, name) {
		return firestore.collection(POSTS).add({
			title,
			body,
			created_at: firebase.firestore.FieldValue.serverTimestamp(),
			writer:store.state.user.email,
			name: name
		})
	},

	modifyPost(title,body,id, name){
		return firestore.collection(POSTS).doc(id).set({
			title,
			body,
			id,
			name: name,
			created_at: firebase.firestore.FieldValue.serverTimestamp(),
			writer:store.state.user.email
		})
	},
	deletePost(id){
		return firestore.collection(POSTS).doc(id).delete().then(function() {

		}).catch(function(error) {
				console.error("Error removing document: ", error);
		});
	},

	/********************\
 \  PostCommnet 함수들  \
	\********************/
	postPostComment(postId, body, name){
		return firestore.collection(POSTCOMMENTS).add({
			postId,
			body,
			created_at: firebase.firestore.FieldValue.serverTimestamp(),
			name: name,
			writer:store.state.user.email,
			isModify: false,
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
	canModify(comment){
		return firestore.collection(POSTCOMMENTS).doc(comment.id).set({
			body: comment.body,
			created_at: comment.created_at,
			isModify: false,
			name: comment.name,
			postId: comment.postId,
			writer: store.state.user.email
		})
	},
	modifyComment(comment, newComment){
		return firestore.collection(POSTCOMMENTS).doc(comment.id).set({
			body: newComment,
			created_at: comment.created_at,
			isModify: false,
			name: comment.name,
			postId: comment.postId,
			writer: store.state.user.email
		})
	},
	deleteComment(commentId){
		return firestore.collection(POSTCOMMENTS).doc(commentId).delete().then(function() {

		}).catch(function(error) {
				console.error("Error removing postComment: ", error);
		});
	},

	/********************\
 \   Portfolio 함수들   \
	\********************/
	deletePortfolio(id){
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
	modifyPortfolio(title,body,img,id){
		return firestore.collection(PORTFOLIOS).doc(id).set({
			title,
			body,
			img,
			id,
			created_at: firebase.firestore.FieldValue.serverTimestamp()
		})
	},

	postPortfolio(title, body, img) {
		return firestore.collection(PORTFOLIOS).add({
			title,
			body,
			img,
			created_at: firebase.firestore.FieldValue.serverTimestamp()
		})
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
						data.created_at = new Date(data.created_at.toDate())
						data.current_at = new Date(data.current_at.toDate())
						return data
					})
				})
	},


	modifyUser(user){
		return firestore.collection(USERS).doc(user.id).set({
			name: user.name,
			classify: user.classify,
			email: user.email,
			created_at: user.created_at,
			current_at: user.current_at
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


	getUser(){
		var userDoc = firestore.collection(USERS).doc(user.uid);
		return userDoc.get().then(function(doc) {
				if (doc.exists) {
					let data = doc.data();
					data.name = doc.data().name;
					data.email = doc.data().email;
					data.classify = doc.data().classify;
					data.id = id;
					return data;
				} else {
						console.log("No such document!");
				}
		}).catch(function(error) {
				console.log("Error getting document:", error);
		});
	},
	getUserData(){
		var user = firebase.auth().currentUser;
		if(user != null){
			var userData = firestore.collection(USERS).doc(user.uid);
			return userData.get().then(function(result) {

				return result.data();
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
		}).then(function(result){

		});
	},

	userDataToDB(email,classify,name,created_at){
		var userId = firebase.auth().currentUser.uid;
		return firestore.collection(USERS).doc(userId).set({
			email,
			classify,
			name,
			created_at,
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
			  console.log("이미 지워졌당ㅋ",error);
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

}
